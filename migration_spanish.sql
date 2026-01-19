-- Migration to Spanish Values

-- 1. Disable Trigger to avoid side-effects during update
DROP TRIGGER IF EXISTS on_subscription_update ON public.subscriptions;

-- 2. Modify Constraints
-- We must drop old constraints first
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;

-- 3. Update Data (Subscriptions)
UPDATE public.subscriptions SET plan_type = 'semanal' WHERE plan_type = 'weekly';
UPDATE public.subscriptions SET plan_type = 'mensual' WHERE plan_type = 'monthly';

UPDATE public.subscriptions SET status = 'pendiente' WHERE status = 'pending';
UPDATE public.subscriptions SET status = 'activo' WHERE status = 'active';
UPDATE public.subscriptions SET status = 'rechazado' WHERE status = 'rejected';
UPDATE public.subscriptions SET status = 'vencido' WHERE status = 'expired';

-- 4. Update Data (Profiles)
UPDATE public.profiles SET subscription_plan = 'semanal' WHERE subscription_plan = 'weekly';
UPDATE public.profiles SET subscription_plan = 'mensual' WHERE subscription_plan = 'monthly';

UPDATE public.profiles SET subscription_status = 'pendiente' WHERE subscription_status = 'pending';
UPDATE public.profiles SET subscription_status = 'activo' WHERE subscription_status = 'active';
UPDATE public.profiles SET subscription_status = 'inactivo' WHERE subscription_status = 'inactive';

-- 5. Add New Constraints (Spanish)
ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('semanal', 'mensual', 'free', '')); -- Added free just in case

ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_status_check 
CHECK (status IN ('pendiente', 'activo', 'rechazado', 'vencido', 'inactivo'));

-- 6. Update Trigger Function
CREATE OR REPLACE FUNCTION public.handle_subscription_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando se ACTIVA
    IF NEW.status = 'activo' AND (OLD.status IS NULL OR OLD.status != 'activo') THEN
        UPDATE public.profiles
        SET 
            subscription_status = 'activo',
            subscription_plan = NEW.plan_type,
            subscription_expiry = NEW.end_date::DATE
        WHERE id = NEW.user_id;
    END IF;

    -- Cuando VENCE
    IF (NEW.status = 'vencido' OR NEW.status = 'inactivo') AND OLD.status = 'activo' THEN
        UPDATE public.profiles
        SET subscription_status = 'inactivo'
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Re-enable Trigger
CREATE TRIGGER on_subscription_update
AFTER UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.handle_subscription_update();

-- 8. Verify
SELECT * FROM public.subscriptions LIMIT 5;
