-- Create table for blocked slots
CREATE TABLE IF NOT EXISTS public.blocked_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for blocked_slots
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Policy for reading blocked slots (everyone can see them to avoid booking)
CREATE POLICY "Anyone can view blocked slots"
ON public.blocked_slots FOR SELECT
USING (true);

-- Policy for managing blocked slots (only admin)
CREATE POLICY "Admins can manage blocked slots"
ON public.blocked_slots FOR ALL
USING (
  (SELECT public.is_admin())
);


-- Add subscription fields to profiles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_plan') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_plan TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive'; -- 'active', 'inactive'
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subscription_expiry') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_expiry DATE;
    END IF;
END $$;
