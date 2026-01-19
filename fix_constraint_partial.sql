-- 1. Drop the rigid constraint that blocks cancelled appointments
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS unique_client_time_slot;

-- 2. Create a "Partial Unique Index"
-- This ensures uniqueness ONLY for active appointments.
-- If status is 'cancelled', we don't care about uniqueness (allowing re-booking).
CREATE UNIQUE INDEX unique_active_client_booking 
ON public.appointments (client_id, start_time) 
WHERE status != 'cancelled';

-- 3. Also fix the potential double-booking from the other side (Global Availability)
-- (Optional but good practice)
-- If we had a constraint for global slots, we'd do the same.
