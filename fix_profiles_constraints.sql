-- Fix Constraints on Profiles Table
-- The previous migration updated data but missed updating the CHECK constraints on the profiles table.

-- 1. Drop potential old constraints (using common naming conventions)
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;
    EXCEPTION
        WHEN undefined_object THEN NULL;
    END;
END $$;

-- 2. Add New Constraints (Spanish Support)
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN ('activo', 'inactivo', 'pendiente', 'rechazado', 'vencido', 'active', 'pending', 'inactive', '')); 
-- Note: Included English temporarily if needed, but aimed at Spanish mostly. 
-- Let's make it strict Spanish as per user request "reusan a cambiar".
-- Actually, let's Stick to Spanish ONLY to force migration.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_status_check 
CHECK (subscription_status IN ('activo', 'inactivo', 'pendiente', 'rechazado', 'vencido', ''));

-- 3. Verify
SELECT id, full_name, subscription_status FROM public.profiles LIMIT 5;
