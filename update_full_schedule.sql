-- Clear existing schedule for cleaner state
DELETE FROM public.work_schedule;

-- Insert Monday (1) to Saturday (6)
-- using explicit casting ::TIME to avoid type errors

INSERT INTO public.work_schedule (day_of_week, start_time)
SELECT 
    d.day,
    t.time::TIME
FROM 
    (VALUES (1), (2), (3), (4), (5), (6)) AS d(day),
    (VALUES 
        ('07:00'), ('08:00'), ('09:00'), ('10:00'), ('11:00'),
        ('14:00'), ('15:00'), ('16:00'), ('17:00'), ('18:00'), ('19:00')
    ) AS t(time);

-- Verify
SELECT count(*) as total_slots FROM public.work_schedule;
