-- Check for duplicate appointments
SELECT 
    client_id, 
    start_time, 
    COUNT(*) as count 
FROM 
    public.appointments 
GROUP BY 
    client_id, start_time 
HAVING 
    COUNT(*) > 1;

-- View details of the duplicates
SELECT * FROM public.appointments 
WHERE (client_id, start_time) IN (
    SELECT client_id, start_time 
    FROM public.appointments 
    GROUP BY client_id, start_time 
    HAVING COUNT(*) > 1
)
ORDER BY start_time, client_id;
