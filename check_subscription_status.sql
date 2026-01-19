-- Check all subscriptions and their statuses
SELECT id, user_id, plan_type, status, created_at
FROM public.subscriptions
ORDER BY created_at DESC;

-- Also check distinct statuses to see what values exist
SELECT DISTINCT status FROM public.subscriptions;
