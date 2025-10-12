-- Remove Duplicate Workout Sessions and Session Exercises
-- This script removes duplicate workout sessions for the same user on the same date
-- keeping only the most recent entry

BEGIN;

-- Get Harry's user ID
DO $$
DECLARE
  v_user_id UUID;
  v_duplicate_count INTEGER;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: harry.liu.ca@gmail.com';
  END IF;

  RAISE NOTICE 'Found user ID: %', v_user_id;

  -- Check for duplicates
  SELECT COUNT(*) INTO v_duplicate_count
  FROM (
    SELECT session_date, COUNT(*) as cnt
    FROM public.workout_sessions
    WHERE user_id = v_user_id
    GROUP BY session_date
    HAVING COUNT(*) > 1
  ) dups;

  RAISE NOTICE 'Found % dates with duplicate sessions', v_duplicate_count;

  -- Delete duplicate session_exercises for duplicate sessions
  -- (They will be deleted automatically by CASCADE, but showing for clarity)
  RAISE NOTICE 'Removing duplicate session exercises...';

  -- Delete duplicate workout sessions, keeping only the most recent one for each date
  -- The most recent one has the latest created_at timestamp
  DELETE FROM public.workout_sessions
  WHERE id IN (
    SELECT ws.id
    FROM public.workout_sessions ws
    INNER JOIN (
      SELECT
        session_date,
        MAX(created_at) as latest_created_at
      FROM public.workout_sessions
      WHERE user_id = v_user_id
      GROUP BY session_date
      HAVING COUNT(*) > 1
    ) latest
    ON ws.session_date = latest.session_date
    AND ws.created_at < latest.latest_created_at
    WHERE ws.user_id = v_user_id
  );

  RAISE NOTICE 'Duplicates removed successfully';

  -- Show final count
  SELECT COUNT(*) INTO v_duplicate_count
  FROM public.workout_sessions
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Total workout sessions remaining: %', v_duplicate_count;

END $$;

COMMIT;

-- Verify no duplicates remain
SELECT
  session_date,
  category,
  COUNT(*) as session_count,
  STRING_AGG(id::text, ', ') as session_ids
FROM public.workout_sessions
WHERE user_id = (SELECT id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com')
GROUP BY session_date, category
HAVING COUNT(*) > 1;

-- If the above query returns no rows, duplicates have been successfully removed
