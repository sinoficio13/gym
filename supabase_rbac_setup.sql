-- 1. Agregar columna de rol a la tabla profiles si no existe
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Asegurarnos que la tabla profiles tenga RLS (Row Level Security) activo
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear política: Los usuarios normales solo pueden ver su propio perfil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- 4. Crear política: Los administradores pueden ver TODOS los perfiles
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 5. Crear política: Los admins pueden actualizar citas (appointments)
CREATE POLICY "Admins can update appointments" 
ON appointments FOR ALL 
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 6. Crear política: Los usuarios pueden ver sus propias citas
CREATE POLICY "Users can view own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = client_id);

-- INSTRUCCIÓN PARA EL USUARIO:
-- Una vez corras esto, busca tu usuario en la tabla 'profiles' y cambia su rol a 'admin' manualemente o corre:
-- UPDATE profiles SET role = 'admin' WHERE id = 'TU_ID_DE_USUARIO';
