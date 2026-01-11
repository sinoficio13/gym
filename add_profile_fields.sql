-- Add training_goal column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS training_goal TEXT;

-- Update birth_date script to be comprehensive
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Create an index for faster filtering by goal if needed later
CREATE INDEX IF NOT EXISTS idx_profiles_goal ON public.profiles(training_goal);
