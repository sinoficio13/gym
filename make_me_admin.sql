-- ⚠️ REEMPLAZA 'tu_email@gmail.com' POR TU CORREO REAL DE GOOGLE

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'tu_email@gmail.com' LIMIT 1
);

-- Verificamos el cambio
SELECT email, role FROM public.profiles 
JOIN auth.users ON public.profiles.id = auth.users.id
WHERE email = 'tu_email@gmail.com';
