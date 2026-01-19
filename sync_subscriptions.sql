-- Sync Profiles -> Subscriptions
-- For every user who is 'pendiente' in profiles but has NO 'pendiente' row in subscriptions table:
-- Create a new subscription request.

INSERT INTO public.subscriptions (user_id, plan_type, status, created_at, updated_at)
SELECT 
    p.id as user_id,
    COALESCE(p.subscription_plan, 'mensual') as plan_type, -- Default to monthly if plan is missing
    'pendiente' as status,
    NOW() as created_at,
    NOW() as updated_at
FROM 
    public.profiles p
WHERE 
    p.subscription_status = 'pendiente'
    AND NOT EXISTS (
        SELECT 1 FROM public.subscriptions s 
        WHERE s.user_id = p.id AND s.status = 'pendiente'
    );

-- Verify the result
SELECT count(*) as new_pending_requests FROM public.subscriptions WHERE status = 'pendiente';
