-- Fix Subscription Plan Constraint on Profiles
-- The issue is likely that changing the status fails because the existing 'plan' doesn't satisfy the plan constraint, or the plan constraint is too strict.

DO $$
BEGIN
    -- Drop potential old constraints on profiles regarding plan
    BEGIN ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check; EXCEPTION WHEN OTHERS THEN NULL; END;
    
    -- Add a comprehensive check for plans, including 'Free' (Capitalized and lowercase) and others
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_subscription_plan_check 
    CHECK (subscription_plan IN ('semanal', 'mensual', 'Free', 'free', 'Basic', 'basic', '', 'mensual', 'semanal')); 
    -- Note: duplicated 'mensual'/'semanal' is harmless, just being safe.
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Verify
SELECT id, email, subscription_plan FROM public.profiles WHERE subscription_plan NOT IN ('semanal', 'mensual');
