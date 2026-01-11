-- LIMPIEZA TOTAL DE POLÍTICAS
-- Tienes muchas reglas basura duplicadas. Vamos a borrar TODO y empezar de cero.

-- 1. BORRADO MASIVO (Usando los nombres exactos que me diste)
DROP POLICY IF EXISTS "Admins Update Access" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated Users Read Access" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles; -- Ojo con el punto final
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- 2. REGLAS DEFINITIVAS Y LIMPIAS

-- A) LECTURA: Todos los autenticados ven todo (Simple y funciona)
CREATE POLICY "Universal Read Access"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- B) INSERTAR: Cualquiera puede crear su propio perfil al registrarse
CREATE POLICY "Users Insert Own"
ON profiles FOR INSERT
TO public
WITH CHECK (auth.uid() = id);

-- C) ACTUALIZAR: Admin toca todo O Usuario toca lo suyo
CREATE POLICY "Universal Update Access"
ON profiles FOR UPDATE
TO authenticated
USING (
  -- O eres el dueño, O eres admin
  auth.uid() = id 
  OR 
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
