-- 1. Enable Realtime (Crucial Fix)
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;

-- 2. Test Setup: Create a transient test user logic (Simulation only, assume we pick an existing user)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Pick the first non-admin user found, or create one if needed (simplified: pick ANY profile)
    SELECT id INTO test_user_id FROM public.profiles LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No dummy user found, cannot test.';
        RETURN;
    END IF;

    -- 3. Simulate Request
    INSERT INTO public.subscriptions (user_id, plan_type, status)
    VALUES (test_user_id, 'monthly', 'pending');

    RAISE NOTICE 'Subscription requested for %', test_user_id;

    -- 4. Simulate Approval (This should trigger the profile update)
    UPDATE public.subscriptions
    SET 
        status = 'active',
        start_date = NOW(),
        end_date = NOW() + INTERVAL '1 month'
    WHERE user_id = test_user_id AND status = 'pending';

    RAISE NOTICE 'Subscription approved.';

    -- 5. Verification
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = test_user_id 
        AND subscription_status = 'active'
        AND subscription_plan = 'monthly'
    ) THEN
        RAISE NOTICE 'SUCCESS: Profile updated automatically via Trigger!';
    ELSE
        RAISE EXCEPTION 'FAILURE: Profile was NOT updated.';
    END IF;

    -- Cleanup (Rollback changes for the test)
    -- DELETE FROM public.subscriptions WHERE user_id = test_user_id;
    -- UPDATE public.profiles SET subscription_status = 'inactive' WHERE id = test_user_id;
END $$;
