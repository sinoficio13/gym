-- 1. Truncate appointments table (Clean slate as requested)
TRUNCATE TABLE public.appointments RESTART IDENTITY CASCADE;

-- 2. Add Unique Constraint to prevent multiple bookings for same client at same time
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS unique_client_time_slot;

ALTER TABLE public.appointments
ADD CONSTRAINT unique_client_time_slot UNIQUE (client_id, start_time);

-- 3. Also meaningful to prevent overlapping?
-- For now, exact start time uniqueness is the main fix for "double clicking".
