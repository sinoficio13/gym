-- FIX INFINITE RECURSION IN RLS
-- The previous policy caused a loop because it queried 'profiles' to check permissions on 'profiles'.
-- Solution: Use a SECURITY DEFINER function to bypass RLS when checking admin status.

-- 1. Create a secure function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the creator, bypassing RLS
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 3. Re-create policies using the secure function
-- Policy for Admins: Can update ANY row
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

-- Policy for Users: Can only update their OWN row
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
USING ( auth.uid() = id );

-- Ensure Select is still open (or restricted if needed, but keeping open for now as per previous logic)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- 4. Grant execute permission just in case
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon;

-- 5. Force Retry of Pending Updates (just to be helpful)
-- Re-run the update for the blocked users just in case it failed before due to this.
UPDATE public.profiles
SET subscription_status = 'pendiente'
WHERE email IN ('lic.euscarisp@gmail.com', 'cemabqtoca@gmail.com');
