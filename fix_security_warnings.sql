-- 1. LIMPIEZA: Eliminar funciones antiguas o duplicadas para evitar confusión
DROP FUNCTION IF EXISTS public.get_my_role();

-- 2. FUNCIÓN SEGURA: is_admin()
-- Corrige el warning: function_search_path_mutable
-- Consolida la lógica de verificación de admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- IMPORTANTE: Fija el search_path para seguridad
AS $$
BEGIN
  -- Verifica si el usuario actual tiene rol 'admin' en la tabla profiles
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$;

-- 3. FUNCIÓN SEGURA: handle_new_user()
-- Corrige el warning: function_search_path_mutable
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- IMPORTANTE: Fija el search_path para seguridad
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Default role
  );
  RETURN new;
END;
$$;

-- 4. ACTUALIZAR POLÍTICAS
-- Aseguramos que las políticas usen la función segura is_admin()
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Unified Profile Visibility" ON profiles;
DROP POLICY IF EXISTS "Admins can see all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles; -- Nombre antiguo
DROP POLICY IF EXISTS "Users can view own profile" ON profiles; -- Nombre antiguo

-- Política Consolidada de Lectura
CREATE POLICY "Unified Profile Visibility"
ON profiles
FOR SELECT
USING (
  auth.uid() = id       -- El usuario puede ver su propio perfil
  OR 
  public.is_admin()     -- O el admin puede ver TODO
);

-- Política de Actualización (Usuario edita su perfil)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Nota: Para inserts, el trigger handle_new_user se encarga, o se permite insert authenticated si fuera necesario, 
-- pero generalmente los perfiles se crean vía trigger.
