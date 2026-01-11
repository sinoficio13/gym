-- Add birth_date column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Optional: Calculate age from birth_date ensures data consistency
-- But for now we just add the column to store it.
