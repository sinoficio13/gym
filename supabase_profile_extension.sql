-- 1. Agregar columnas de forma segura (solo si no existen)
DO $$ 
BEGIN 
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cedula text;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age integer;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes text;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS alias text;
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'mensual';
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email text;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'column already exists, skipping';
END $$;

-- 2. Funciones de Seguridad (SECURITY DEFINER + search_path fix)

-- is_admin: Verifica si el usuario es administrador de forma segura
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$;

-- handle_new_user: Crea perfil automáticamente al registrarse
-- handle_new_user: Crea perfil automáticamente al registrarse (Versión Robusta)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name text;
  v_avatar_url text;
BEGIN
  -- Extract metadata safely
  v_full_name := new.raw_user_meta_data->>'full_name';
  v_avatar_url := new.raw_user_meta_data->>'avatar_url';

  -- Fallback if full_name is missing (e.g. email login vs oauth)
  IF v_full_name IS NULL THEN
    v_full_name := split_part(new.email, '@', 1);
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    v_full_name, 
    v_avatar_url,
    'user'
  );
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log error but allow auth user creation to proceed
  RAISE WARNING 'Error creating profile for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

-- 3. Trigger conexión Auth -> Profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Políticas de Seguridad (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Limpieza de políticas antiguas
DROP POLICY IF EXISTS "Unified Profile Visibility" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can see all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;
DROP POLICY IF EXISTS "Users Insert Own" ON profiles;
DROP POLICY IF EXISTS "Universal Update Access" ON profiles;
DROP POLICY IF EXISTS "Universal Read Access" ON profiles;

-- Lectura: Dueño O Admin (Optimizado)
CREATE POLICY "Unified Profile Visibility"
ON profiles FOR SELECT 
USING (
  (select auth.uid()) = id OR (select public.is_admin())
);

-- Escalera: Solo Dueño
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING ((select auth.uid()) = id);

-- Insert opcional (aunque se usa trigger)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK ((select auth.uid()) = id);
