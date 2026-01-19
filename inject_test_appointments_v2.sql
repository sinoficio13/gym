-- Create 15 Dummy Profiles and Appointments
-- This is mainly for UI testing of high-density calendar
-- NOTE: We are bypassing auth.users. If your profiles table has a strict FK to auth.users, this might fail unless we insert there too.
-- However, often local dev or some setups allow this, or we just fail.
-- IF it fails, we will fallback to reusing existing users.

DO $$
DECLARE
    new_user_id UUID;
    i INT;
    names TEXT[] := ARRAY[
        'Ana García', 'Carlos Lopez', 'Beatriz Mendez', 'David Ruiz', 'Elena Volkov',
        'Fernando Torres', 'Gabriela H.', 'Hugo Sanchez', 'Isabel Diaz', 'Jorge P.',
        'Karla M.', 'Luis Luis', 'Monica N.', 'Nicolas O.', 'Olivia P.'
    ];
    goals TEXT[] := ARRAY[
        'Pérdida de Peso', 'Ganancia Muscular', 'Resistencia', 'Flexibilidad', 'Salud General'
    ];
    chosen_goal TEXT;
    start_time_val TIMESTAMPTZ;
BEGIN
    -- Set start time to tomorrow at 10:00 AM fixed for all
    start_time_val := date_trunc('day', NOW() + INTERVAL '1 day') + INTERVAL '10 hours';

    FOR i IN 1..15 LOOP
        new_user_id := gen_random_uuid();
        chosen_goal := goals[1 + (i % 5)];

        -- Attempt to insert dummy profile
        -- We use a BEGIN exception block to handle potential FK violations if auth.users is strict
        BEGIN
            INSERT INTO public.profiles (id, full_name, email, training_goal, role)
            VALUES (
                new_user_id,
                names[i],
                'test_user_' || i || '@example.com',
                chosen_goal,
                'user'
            );
            
            -- If profile insert succeeds, insert appointment
            INSERT INTO public.appointments (user_id, start_time, end_time, status)
            VALUES (
                new_user_id, 
                start_time_val, 
                start_time_val + INTERVAL '1 hour', 
                'scheduled'
            );
            
        EXCEPTION WHEN OTHERS THEN
            -- If FK constraint fails (e.g. auth.users missing), let's fallback to finding a VALID random user
            -- and just creating the appointment for them, but with a note in the details if possible?
            -- Actually appointments doesn't have a 'note' field visible in the grid usually.
            -- Let's just create multiple appointments for the existing valid users to simulate density.
            RAISE NOTICE 'Could not create dummy profile for % (likely auth FK), reusing existing user.', names[i];
            
            SELECT id INTO new_user_id FROM public.profiles ORDER BY random() LIMIT 1;
            
            IF new_user_id IS NOT NULL THEN
                 INSERT INTO public.appointments (user_id, start_time, end_time, status)
                VALUES (
                    new_user_id, 
                    start_time_val, 
                    start_time_val + INTERVAL '1 hour', 
                    'scheduled'
                );
            END IF;
        END;
    END LOOP;
END $$;
