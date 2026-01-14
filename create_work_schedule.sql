-- Create table for work schedule (slots)
CREATE TABLE IF NOT EXISTS public.work_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...
    start_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(day_of_week, start_time)
);

-- Enable RLS
ALTER TABLE public.work_schedule ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access"
ON public.work_schedule FOR SELECT
USING (true);

CREATE POLICY "Admin full access"
ON public.work_schedule FOR ALL
USING (
  (SELECT public.is_admin())
);

-- Insert default slots (optional, to avoid empty state)
-- Example: Mon-Fri, 07:00, 08:30, 10:00, 16:00, 17:30, 19:00, 20:30
INSERT INTO public.work_schedule (day_of_week, start_time)
VALUES 
(1, '07:00'), (1, '08:30'), (1, '10:00'), (1, '16:00'), (1, '17:30'), (1, '19:00'), (1, '20:30'),
(2, '07:00'), (2, '08:30'), (2, '10:00'), (2, '16:00'), (2, '17:30'), (2, '19:00'), (2, '20:30'),
(3, '07:00'), (3, '08:30'), (3, '10:00'), (3, '16:00'), (3, '17:30'), (3, '19:00'), (3, '20:30'),
(4, '07:00'), (4, '08:30'), (4, '10:00'), (4, '16:00'), (4, '17:30'), (4, '19:00'), (4, '20:30'),
(5, '07:00'), (5, '08:30'), (5, '10:00'), (5, '16:00'), (5, '17:30'), (5, '19:00'), (5, '20:30')
ON CONFLICT DO NOTHING;
