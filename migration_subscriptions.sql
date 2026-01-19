-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('weekly', 'monthly')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'rejected', 'expired')) DEFAULT 'pending',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    price DECIMAL(10, 2), -- Optional: to record the price at the time of subscription
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert (request) subscriptions
CREATE POLICY "Users can create subscriptions"
ON public.subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions FOR SELECT
USING (public.is_admin());

-- Policy: Admins can update subscriptions (approve/reject)
CREATE POLICY "Admins can update subscriptions"
ON public.subscriptions FOR UPDATE
USING (public.is_admin());

-- 4. Trigger Function to Sync Profile
CREATE OR REPLACE FUNCTION public.handle_subscription_update()
RETURNS TRIGGER AS $$
BEGIN
    -- When a subscription becomes ACTIVE
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        UPDATE public.profiles
        SET 
            subscription_status = 'active',
            subscription_plan = NEW.plan_type,
            subscription_expiry = NEW.end_date::DATE
        WHERE id = NEW.user_id;
    END IF;

    -- When a subscription is manually EXPIRED or REJECTED (and it was previously active logic could be complex, for now simple)
    -- Ideally, we rely on the Expiry date in profiles, but if we manually mark a sub as expired in this table, we might want to reflect it.
    IF NEW.status = 'expired' AND OLD.status = 'active' THEN
        UPDATE public.profiles
        SET subscription_status = 'inactive'
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger Definition
DROP TRIGGER IF EXISTS on_subscription_update ON public.subscriptions;
CREATE TRIGGER on_subscription_update
AFTER UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.handle_subscription_update();
