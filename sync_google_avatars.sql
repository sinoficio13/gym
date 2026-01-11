-- 1. Ensure the column exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Sync Avatar URLs from Auth Metadata to Profiles
-- This grabs the picture URL that Google provides (stored in raw_user_meta_data)
-- and puts it into our profiles table so we can see it.
UPDATE public.profiles p
SET avatar_url = u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
WHERE p.id = u.id
AND p.avatar_url IS NULL -- Only update if currently empty
AND u.raw_user_meta_data->>'avatar_url' IS NOT NULL; -- And if Google actually gave us a photo

-- 3. Verify it worked (display update count)
SELECT count(*) as profiles_updated FROM public.profiles WHERE avatar_url IS NOT NULL;
