-- 1. Ensure Columns Exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS subscription_expiry timestamptz;

-- 2. Update Trigger Function to set defaults for NEW users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
      id, 
      full_name, 
      email, 
      avatar_url, 
      role, 
      subscription_status, 
      subscription_plan
  )
  VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name', 
      new.email, 
      new.raw_user_meta_data->>'avatar_url', 
      'user',
      'pending', -- Default status: Pending Payment / Free
      'Free'     -- Default plan: Free
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update existing users who might have nulls (Optional but good for consistency)
UPDATE public.profiles 
SET subscription_status = 'pending' 
WHERE subscription_status IS NULL;

UPDATE public.profiles 
SET subscription_plan = 'Free' 
WHERE subscription_plan IS NULL;
