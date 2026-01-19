-- 1. Find users who are 'pendiente' in profiles but MISSING in subscriptions (or not pending there)
SELECT 
    p.id, 
    p.full_name, 
    p.email, 
    p.subscription_status as profile_status,
    p.subscription_plan as profile_plan,
    s.status as subscription_table_status
FROM 
    public.profiles p
LEFT JOIN 
    public.subscriptions s ON p.id = s.user_id AND s.status = 'pendiente'
WHERE 
    p.subscription_status = 'pendiente';

-- 2. Check if they have ANY subscription row at all
SELECT * FROM public.subscriptions WHERE user_id IN (
    SELECT id FROM public.profiles WHERE subscription_status = 'pendiente'
);
