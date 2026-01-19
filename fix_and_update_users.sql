-- 1. Asegurar Constraints Correctos (Fix Exhaustivo)
DO $$
BEGIN
    -- Intentar borrar constraints viejos si existen
    BEGIN ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_status_check; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check; EXCEPTION WHEN OTHERS THEN NULL; END;

    -- Aplicar Constraints Nuevos (Español + Inglés por compatibilidad temporal)
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_subscription_status_check 
    CHECK (subscription_status IN ('activo', 'inactivo', 'pendiente', 'rechazado', 'vencido', 'active', 'pending', 'inactive', 'rejected', 'expired', ''));

    ALTER TABLE public.subscriptions 
    ADD CONSTRAINT subscriptions_status_check 
    CHECK (status IN ('activo', 'inactivo', 'pendiente', 'rechazado', 'vencido', 'active', 'pending', 'inactive', 'rejected', 'expired'));
EXCEPTION
    WHEN OTHERS THEN NULL; -- Si ya existen, ignorar error
END $$;

-- 2. Forzar actualización de los 3 usuarios a 'pendiente'
UPDATE public.profiles
SET subscription_status = 'pendiente', subscription_expiry = NULL
WHERE email IN (
    'lic.euscarisp@gmail.com',
    'cemabqtoca@gmail.com',
    'cema.suscripciones@gmail.com',
    'guarojjft19@gmail.com' -- Agregado por si acaso el usuario Jose Fariña también lo necesita
);

-- Actualizar también sus suscripciones activas si las hay
UPDATE public.subscriptions
SET status = 'pendiente'
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email IN ('lic.euscarisp@gmail.com', 'cemabqtoca@gmail.com', 'cema.suscripciones@gmail.com')
);

SELECT email, subscription_status FROM public.profiles WHERE email IN ('lic.euscarisp@gmail.com', 'cemabqtoca@gmail.com', 'cema.suscripciones@gmail.com');
