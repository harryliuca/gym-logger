-- Clean up duplicate workout sessions and exercises
-- Run this in Supabase SQL Editor

BEGIN;

-- Delete duplicate session_exercises (keep the ones with data)
DELETE FROM public.session_exercises
WHERE id IN (
  SELECT se.id
  FROM public.session_exercises se
  INNER JOIN public.workout_sessions ws ON se.session_id = ws.id
  WHERE ws.user_id = (SELECT id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com')
);

-- Delete all workout sessions for this user (we'll re-import clean data)
DELETE FROM public.workout_sessions
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com');

COMMIT;

-- Ready for fresh import!
