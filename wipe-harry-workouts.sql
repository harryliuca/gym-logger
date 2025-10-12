-- Wipe out all workout data for Harry
-- This will remove all workout sessions, session exercises, and exercises
-- Then you can re-import cleanly with import-final.sql

BEGIN;

-- Get Harry's user ID
DO $$
DECLARE
  v_user_id UUID;
  v_session_count INTEGER;
  v_exercise_count INTEGER;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: harry.liu.ca@gmail.com';
  END IF;

  RAISE NOTICE 'Found user ID: %', v_user_id;

  -- Count current data
  SELECT COUNT(*) INTO v_session_count
  FROM public.workout_sessions
  WHERE user_id = v_user_id;

  SELECT COUNT(*) INTO v_exercise_count
  FROM public.exercises;

  RAISE NOTICE 'Current workout sessions: %', v_session_count;
  RAISE NOTICE 'Current exercises: %', v_exercise_count;

  -- Delete all session_exercises for Harry's sessions
  -- (Will be auto-deleted by CASCADE, but being explicit)
  DELETE FROM public.session_exercises
  WHERE session_id IN (
    SELECT id FROM public.workout_sessions WHERE user_id = v_user_id
  );

  RAISE NOTICE 'Deleted all session exercises';

  -- Delete all Harry's workout sessions
  DELETE FROM public.workout_sessions
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Deleted all workout sessions';

  -- Delete all exercises (since they're specific to your imports)
  DELETE FROM public.exercises;

  RAISE NOTICE 'Deleted all exercises';

  -- Reset Harry's stats in profile
  UPDATE public.profiles
  SET
    total_sessions = 0,
    total_volume = 0,
    last_workout_date = NULL
  WHERE id = v_user_id;

  RAISE NOTICE 'Reset profile stats';

  RAISE NOTICE '===================================';
  RAISE NOTICE 'All workout data wiped successfully';
  RAISE NOTICE 'You can now run import-final.sql to re-import your data';
  RAISE NOTICE '===================================';

END $$;

COMMIT;

-- Verify cleanup
SELECT
  'workout_sessions' as table_name,
  COUNT(*) as remaining_count
FROM public.workout_sessions
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com')

UNION ALL

SELECT
  'session_exercises' as table_name,
  COUNT(*) as remaining_count
FROM public.session_exercises
WHERE session_id IN (
  SELECT id FROM public.workout_sessions
  WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com')
)

UNION ALL

SELECT
  'exercises' as table_name,
  COUNT(*) as remaining_count
FROM public.exercises;

-- All counts should be 0
