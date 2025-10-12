-- Generated SQL from: /Users/harryliu/Documents/gym/Master_Workout_History_FIXED.xlsx
-- Total rows: 61
-- Generated: 2025-10-12T04:41:47.909Z
-- User email: harry.liu.ca@gmail.com

-- Found 22 unique workout dates

BEGIN;

-- Get user ID
DO $$
DECLARE
  v_user_id UUID;
  v_session_id UUID;
  v_exercise_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com';
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found: harry.liu.ca@gmail.com';
  END IF;

  RAISE NOTICE 'Found user ID: %', v_user_id;

  -- Session: 2025-06-03
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-03', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-03';
  END IF;

  -- Exercise: Leg Press/Extension
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Leg Press/Extension')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Leg Press/Extension', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-04
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-04', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-04';
  END IF;

  -- Exercise: Rest Day
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Rest Day')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Rest Day', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-05
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-05', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-05';
  END IF;

  -- Exercise: Leg Press/Extension
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Leg Press/Extension')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Leg Press/Extension', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-09
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-09', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-09';
  END IF;

  -- Exercise: Adductor Machine
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Adductor Machine')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Adductor Machine', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-10
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-10', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-10';
  END IF;

  -- Exercise: Shoulder Raise
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lat Pulldown
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lat Pulldown')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lat Pulldown', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Push Plate Machine
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Push Plate Machine')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Push Plate Machine', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-15
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-15', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-15';
  END IF;

  -- Exercise: Deadlift
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lat Pulldown
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lat Pulldown')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lat Pulldown', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Raise
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-16
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-16', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-16';
  END IF;

  -- Exercise: Squat (unspecified)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Squat (unspecified)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Squat (unspecified)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Press (unspecified)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Press (unspecified)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Press (unspecified)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-17
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-17', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-17';
  END IF;

  -- Exercise: Deadlift
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-18
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-18', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-18';
  END IF;

  -- Exercise: Tricep Extension
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Tricep Extension')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Tricep Extension', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-23
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-23', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-23';
  END IF;

  -- Exercise: Squat Machine
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Squat Machine')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Squat Machine', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-24
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-24', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-24';
  END IF;

  -- Exercise: Deadlift
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-06-25
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-06-25', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-06-25';
  END IF;

  -- Exercise: Tricep Extension
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Tricep Extension')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Tricep Extension', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-07-14
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-07-14', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-07-14';
  END IF;

  -- Exercise: Deadlift (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-07-15
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-07-15', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-07-15';
  END IF;

  -- Exercise: Adductor Machine
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Adductor Machine')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Adductor Machine', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-07-16
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-07-16', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-07-16';
  END IF;

  -- Exercise: Tricep Extension
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Tricep Extension')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Tricep Extension', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-07-21
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-07-21', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-07-21';
  END IF;

  -- Exercise: Deadlift
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-07-22
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-07-22', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-07-22';
  END IF;

  -- Exercise: Abductor Machine (Outer)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Abductor Machine (Outer)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Abductor Machine (Outer)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-07-23
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-07-23', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-07-23';
  END IF;

  -- Exercise: Tricep Extension
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Tricep Extension')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Tricep Extension', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-08-26
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-08-26', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-08-26';
  END IF;

  -- Exercise: Deadlift
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-08-27
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-08-27', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-08-27';
  END IF;

  -- Exercise: Abductor Machine (Outer)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Abductor Machine (Outer)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Abductor Machine (Outer)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-09-02
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-09-02', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-09-02';
  END IF;

  -- Exercise: Deadlift
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Deadlift')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Deadlift', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Dumbbell Bicep Curl
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Dumbbell Bicep Curl')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Dumbbell Bicep Curl', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


  -- Session: 2025-09-03
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume)
  VALUES (v_user_id, '2025-09-03', '', 0)
  ON CONFLICT (user_id, session_date) DO NOTHING
  RETURNING id INTO v_session_id;

  IF v_session_id IS NULL THEN
    SELECT id INTO v_session_id FROM public.workout_sessions
    WHERE user_id = v_user_id AND session_date = '2025-09-03';
  END IF;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  -- Exercise: Abductor Machine (Outer)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Abductor Machine (Outer)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Abductor Machine (Outer)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;


END $$;

COMMIT;

-- Done! Import complete.
-- Run this SQL in Supabase SQL Editor
