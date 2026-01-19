-- Insert dummy users if they don't exist (using offsets to avoid conflicts)
-- We need 15 profiles to link appointments to.
-- This script assumes you have at least one valid user or will create dummies.

DO $$
DECLARE
    dummy_user_id UUID;
    i INT;
    start_time_val TIMESTAMPTZ := NOW() + INTERVAL '1 day'; -- Tomorrow
BEGIN
    -- Set start time to tomorrow at 10:00 AM
    start_time_val := date_trunc('day', start_time_val) + INTERVAL '10 hours';

    -- Create 15 dummy appointments
    FOR i IN 1..15 LOOP
        -- Attempt to find a profile, or create a fake one if needed (simplified for this test)
        -- In a real scenario, we'd insert into auth.users but we can't do that easily from here without admin rights.
        -- So we will piggyback on existing profiles if possible, or insert into public.profiles directly if your schema allows it (usually requires auth.users trigger).
        -- FALLBACK: We will just Create 15 appointments linked to *random* existing users or a single test user if multiple not found.
        -- BETTER: Let's create appointments for a SPECIFIC dummy structure or just reuse one user for density testing if names don't matter,
        -- BUT the user wants to see "15 clients", so names matter.
        
        -- Let's just insert into appointments. 
        -- NOTE: If your app requires valid foreign keys to profiles, we need valid IDs.
        -- STRATEGY: Select random profiles. If not enough, reuse.
        
        SELECT id INTO dummy_user_id FROM public.profiles ORDER BY random() LIMIT 1;
        
        IF dummy_user_id IS NULL THEN
            RAISE NOTICE 'No profiles found. Please create at least one user first.';
            RETURN;
        END IF;

        INSERT INTO public.appointments (user_id, start_time, end_time, status)
        VALUES (
            dummy_user_id, 
            start_time_val, 
            start_time_val + INTERVAL '1 hour', 
            'scheduled'
        );
    END LOOP;
END $$;
