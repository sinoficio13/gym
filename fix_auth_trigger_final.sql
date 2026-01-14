-- 1. Ensure all potentially missing columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS subscription_plan text DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS subscription_expiry timestamptz,
ADD COLUMN IF NOT EXISTS avatar_url text, 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'client';

-- 2. Redefine the Trigger Function with "Safe" logic
--    - Uses 'client' as default role (matches dashboard route)
--    - Handles missing metadata gracefully
--    - Sets search_path for security
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
      COALESCE(new.raw_user_meta_data->>'full_name', new.email), -- Fallback to email if name missing
      new.email, 
      new.raw_user_meta_data->>'avatar_url', 
      'client', -- Default role is 'client' (not 'user')
      'pending', 
      'Free'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Ensure Trigger is Bound
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Verify/Fix existing roles
UPDATE public.profiles SET role = 'client' WHERE role = 'user';
