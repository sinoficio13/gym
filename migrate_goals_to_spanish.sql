-- Migrate training_goal values to Spanish
-- This script updates existing records so the database matches the frontend expectations natively
-- and prevents the need for constant translation keys.

UPDATE public.profiles 
SET training_goal = 'Pérdida de Peso' 
WHERE training_goal = 'weight_loss';

UPDATE public.profiles 
SET training_goal = 'Ganancia Muscular' 
WHERE training_goal = 'muscle_gain';

UPDATE public.profiles 
SET training_goal = 'Resistencia' 
WHERE training_goal = 'endurance';

UPDATE public.profiles 
SET training_goal = 'Flexibilidad' 
WHERE training_goal = 'flexibility';

UPDATE public.profiles 
SET training_goal = 'Salud General' 
WHERE training_goal = 'general_health';

-- Verify update
SELECT training_goal, COUNT(*) 
FROM public.profiles 
GROUP BY training_goal;
