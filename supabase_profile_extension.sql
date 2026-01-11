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

-- 2. Eliminar políticas antiguas para evitar error "already exists"
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 3. Re-crear políticas asegurando permisos
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
