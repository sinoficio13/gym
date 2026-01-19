-- MASTER REPAIR SCRIPT V2
-- This script addresses Permissions (RLS), Data Integrity (Constraints), and specific Data Correction.

BEGIN;

-- 1. FIX ROW LEVEL SECURITY (RLS) POLICIES
-- Enabling Admins to update ANY profile. By default, users can often only update themselves.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might verify "auth.uid() = id" only
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Re-create "Users can update own profile"
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create "Admins can update all profiles"
-- This assumes you have a 'role' column in profiles and you are an admin.
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
) WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Also ensure INSERT/SELECT permissions are correct
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);


-- 2. FIX CONSTRAINTS (Allow Spanish Values + Free)
-- We drop everything first to be sure.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

-- Re-Add Permissive Constraints
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN ('activo', 'inactivo', 'pendiente', 'rechazado', 'vencido', 'active', 'pending', 'inactive', 'rejected', 'expired', ''));

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_plan_check 
CHECK (subscription_plan IN ('semanal', 'mensual', 'Free', 'free', 'Basic', 'basic', '', 'mensual', 'semanal', 'Weekly', 'Monthly'));

ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('activo', 'inactivo', 'pendiente', 'rechazado', 'vencido', 'active', 'pending', 'inactive', 'rejected', 'expired'));

-- 3. FORCE UPDATE TARGET USERS
-- Resetting them to 'pendiente' as requested.

UPDATE public.profiles
SET subscription_status = 'pendiente', subscription_expiry = NULL
WHERE email IN (
    'lic.euscarisp@gmail.com',
    'cemabqtoca@gmail.com',
    'cema.suscripciones@gmail.com',
    'guarojjft19@gmail.com'
);

-- Ensure their subscription records (if any) match
UPDATE public.subscriptions
SET status = 'pendiente'
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email IN ('lic.euscarisp@gmail.com', 'cemabqtoca@gmail.com', 'cema.suscripciones@gmail.com', 'guarojjft19@gmail.com')
);

COMMIT;

-- 4. VERIFICATION
SELECT email, subscription_status, subscription_plan FROM public.profiles 
WHERE email IN ('lic.euscarisp@gmail.com', 'cemabqtoca@gmail.com', 'cema.suscripciones@gmail.com');
