-- 1. Crear una función segura para leer el rol (evita la recursión)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER -- Esto es la clave: corre con permisos del sistema, no del usuario
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- 2. Eliminar la política recursiva que causa el error 500
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 3. Crear la nueva política usando la función segura
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  get_my_role() = 'admin'
);

-- 4. Asegurar que los perfiles se pueden crear (INSERT) si usas el trigger, 
-- pero para UPDATE aseguramos que el usuario pueda editarse a sí mismo sin problemas.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
