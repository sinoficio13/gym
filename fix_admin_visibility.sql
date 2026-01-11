-- 1. Crear función segura para verificar admin (Rompe la recursión infinita)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Esta consulta corre con privilegios de dueño, ignorando RLS temporalmente
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Asegurar que RLS está activo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Borrar políticas defectuosas anteriores
DROP POLICY IF EXISTS "Unified Profile Visibility" ON profiles;
DROP POLICY IF EXISTS "Admins can see all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;

-- 4. Crear la política definitiva usando la función segura
CREATE POLICY "Unified Profile Visibility"
ON profiles
FOR SELECT
USING (
  auth.uid() = id       -- Puedes ver tu propio perfil
  OR 
  public.is_admin()     -- O si la función dice que eres admin, puedes ver todo
);

-- 5. Asegurar roles (por si acaso no se aplicaron antes)
UPDATE profiles 
SET role = 'admin' 
WHERE email IN ('guarojf19@gmail.com', 'Lic.euscarisp@gmail.com');
