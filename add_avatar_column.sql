-- Add avatar_url column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Update RLS if needed (optional, usually standard update policy covers it if 'using' clause allows)
-- But ensuring it is selectable is good. We already allowed admins full access.

-- Verify column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'avatar_url';
