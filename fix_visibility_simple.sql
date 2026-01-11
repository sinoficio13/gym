-- SOLUCIÓN FINAL SIMPLIFICADA
-- Vamos a permitir que CUALQUIER usuario conectado pueda leer la lista de perfiles.
-- Esto elimina cualquier posible error de lógica o recursión.

-- 1. Asegurar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. BORRAR TODAS las políticas complejas de lectura anteriores
DROP POLICY IF EXISTS "Unified Profile Visibility" ON profiles;
DROP POLICY IF EXISTS "Admins can see all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles" ON profiles;

-- 3. CREAR POLÍTICA SIMPLE (Lectura Global para Autenticados)
-- "Si estás logueado, puedes ver la lista de gente"
CREATE POLICY "Authenticated Users Read Access"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- 4. Mantener protección de ESCRITURA (Update/Delete solo Admins)
-- Solo permitimos que los admins EDITEN, aunque todos puedan VER.
CREATE POLICY "Admins Update Access"
ON profiles
FOR UPDATE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
