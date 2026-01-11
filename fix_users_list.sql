-- 1. Asegurar que RLS está activo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas conflictivas si existen
DROP POLICY IF EXISTS "Admins can see all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles" ON profiles;

-- 3. Crear política unificada: 
--    - Un usuario puede ver su propio perfil.
--    - Un administrador puede ver TODOS los perfiles.
CREATE POLICY "Unified Profile Visibility"
ON profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 4. CONCEDER ROL ADMIN AL USUARIO PRINCIPAL
--    Esto es crucial para que TU usuario pueda ver a los demás.
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'guarojf19@gmail.com';

-- 5. Verificar (Opcional)
SELECT email, role FROM profiles WHERE email = 'guarojf19@gmail.com';
