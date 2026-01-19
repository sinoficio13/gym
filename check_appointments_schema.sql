-- Check Appointments Table Constraints and Values
SELECT conname, pg_get_constraintdef(c.oid)
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public'
AND conrelid = 'public.appointments'::regclass;

-- Check existing values
SELECT status, count(*) FROM public.appointments GROUP BY status;
