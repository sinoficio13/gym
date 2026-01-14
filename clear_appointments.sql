-- Delete all appointments to reset the calendar for testing
DELETE FROM public.appointments;

-- Verify
SELECT count(*) as remaining_appointments FROM public.appointments;
