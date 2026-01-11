-- CONSULTA DE DIAGNÓSTICO
-- Ejecuta esto para ver EXACTAMENTE qué reglas están activas en la tabla 'profiles'.

SELECT
    schemaname as "Esquema",
    tablename as "Tabla",
    policyname as "Nombre Regla",
    permissive as "Es Permisiva?",
    roles as "Roles Afectados",
    cmd as "Acción (SELECT/ALL)",
    qual as "Condición (USING)",
    with_check as "Condición Check"
FROM
    pg_policies
WHERE
    tablename = 'profiles';
