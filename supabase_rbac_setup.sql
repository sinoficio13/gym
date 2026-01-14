-- 1. Agregar columna de rol a la tabla profiles si no existe
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Asegurarnos que la tabla profiles tenga RLS (Row Level Security) activo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear política: Unified Profile Visibility (Optimizado)
CREATE POLICY "Unified Profile Visibility" 
ON profiles FOR SELECT 
USING (
  (select auth.uid()) = id OR (select public.is_admin())
);

-- 4. Crear política: Users can update appointments (Optimizado)
CREATE POLICY "Admins can update appointments" 
ON appointments FOR ALL 
USING (
  (select public.is_admin())
);

-- 6. Crear política: Unified Appointment Visibility (Optimizado)
CREATE POLICY "Unified Appointment Visibility" 
ON appointments FOR SELECT 
USING (
  (select auth.uid()) = client_id OR (select public.is_admin())
);

-- INSTRUCCIÓN PARA EL USUARIO:
-- Una vez corras esto, busca tu usuario en la tabla 'profiles' y cambia su rol a 'admin' manualemente o corre:
-- UPDATE profiles SET role = 'admin' WHERE id = 'TU_ID_DE_USUARIO';
