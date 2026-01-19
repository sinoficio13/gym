-- Insert 15 appointments for testing High Density Calendar
-- User requested to use EXISTING user to avoid FK issues with Auth.
-- We will fetch an existing profile ID and create 15 appointments for it (or distribute among existing if multiple).

DO $$
DECLARE
    target_client_id UUID;
    i INT;
    start_time_val TIMESTAMPTZ;
BEGIN
    -- 1. Find a valid client_id from existing profiles (Limit 1 to be safe, or remove LIMIT to get random if multiple exist)
    SELECT id INTO target_client_id FROM public.profiles LIMIT 1;

    IF target_client_id IS NULL THEN
        RAISE EXCEPTION 'No existing profiles found. Please create at least one user in your app first.';
    END IF;

    -- Set start time to tomorrow at 10:00 AM
    start_time_val := date_trunc('day', NOW() + INTERVAL '1 day') + INTERVAL '10 hours';

    -- 2. Create 15 appointments
    FOR i IN 1..15 LOOP
        INSERT INTO public.appointments (client_id, start_time, end_time, status) -- Changed user_id to client_id
        VALUES (
            target_client_id, 
            start_time_val, 
            start_time_val + INTERVAL '1 hour', 
            'confirmed' -- Status 'confirmed' so they show up clearly
        );
    END LOOP;
    
    RAISE NOTICE 'Created 15 appointments for client ID %', target_client_id;
END $$;
