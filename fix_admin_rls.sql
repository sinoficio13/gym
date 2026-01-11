-- 1. Enable RLS on appointments if not already
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it conflicts or is strict
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;

-- 3. Create generic Admin Policy
CREATE POLICY "Admins can view all appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- 4. Verify existing appointments
SELECT count(*) as total_appointments FROM public.appointments;
