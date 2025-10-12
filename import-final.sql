-- Generated SQL from: /Users/harryliu/Documents/gym/Master_Workout_History_FIXED.xlsx
-- Total rows: 61
-- Generated: 2025-10-12T07:42:33.818Z
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-03', '', 0, NULL)
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-04', '', 0, NULL)
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-05', '', 0, NULL)
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-09', '', 0, NULL)
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-10', '', 0, NULL)
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-15', '', 0, NULL)
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-16', '', 0, NULL)
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


  -- Session: 2025-06-17 (Day 2)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-17', '', 0, 'Day 2')
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
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-18', '', 0, NULL)
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":27.5,"unit":"lb"}]'::jsonb, 20, 550.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":0,"unit":"lb"}]'::jsonb, 20, 0.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":10,"unit":"lb"},{"set":2,"reps":20,"weight":10,"unit":"lb"}]'::jsonb, 35, 350.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-06-23 (Day 1)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-23', '', 0, 'Day 1')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":12,"weight":60,"unit":"lb"},{"set":2,"reps":12,"weight":60,"unit":"lb"},{"set":3,"reps":12,"weight":60,"unit":"lb"}]'::jsonb, 36, 2160.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":12,"weight":16.25,"unit":"lb"},{"set":2,"reps":12,"weight":16.25,"unit":"lb"},{"set":3,"reps":12,"weight":16.25,"unit":"lb"}]'::jsonb, 36, 585.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":50,"unit":"lb"},{"set":2,"reps":15,"weight":50,"unit":"lb"}]'::jsonb, 30, 1500.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-06-24 (Day 2)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-24', '', 0, 'Day 2')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":55,"unit":"lb"},{"set":2,"reps":10,"weight":55,"unit":"lb"}]'::jsonb, 20, 1100.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":50,"unit":"lb"},{"set":2,"reps":10,"weight":50,"unit":"lb"},{"set":3,"reps":10,"weight":50,"unit":"lb"}]'::jsonb, 30, 1500.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":5,"unit":"lb"},{"set":2,"reps":15,"weight":5,"unit":"lb"}]'::jsonb, 30, 150.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-06-25 (Day 3)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-06-25', '', 0, 'Day 3')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":27.5,"unit":"lb"},{"set":2,"reps":20,"weight":27.5,"unit":"lb"},{"set":3,"reps":20,"weight":27.5,"unit":"lb"}]'::jsonb, 60, 1650.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":0,"unit":"lb"},{"set":2,"reps":20,"weight":0,"unit":"lb"}]'::jsonb, 40, 0.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":10,"unit":"lb"},{"set":2,"reps":20,"weight":10,"unit":"lb"}]'::jsonb, 40, 400.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-07-14 (Day 1)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-07-14', '', 0, 'Day 1')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":45,"unit":"lb"},{"set":2,"reps":10,"weight":45,"unit":"lb"},{"set":3,"reps":10,"weight":45,"unit":"lb"}]'::jsonb, 30, 1350.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":15,"unit":"lb"},{"set":2,"reps":15,"weight":15,"unit":"lb"},{"set":3,"reps":10,"weight":15,"unit":"lb"}]'::jsonb, 40, 600.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":50,"unit":"lb"},{"set":2,"reps":13,"weight":50,"unit":"lb"}]'::jsonb, 28, 1400.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-07-15 (Day 2)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-07-15', '', 0, 'Day 2')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":100,"unit":"lb"},{"set":2,"reps":15,"weight":100,"unit":"lb"},{"set":3,"reps":10,"weight":100,"unit":"lb"}]'::jsonb, 40, 4000.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":50,"unit":"lb"},{"set":2,"reps":10,"weight":50,"unit":"lb"},{"set":3,"reps":10,"weight":50,"unit":"lb"}]'::jsonb, 30, 1500.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":5,"unit":"lb"},{"set":2,"reps":15,"weight":5,"unit":"lb"}]'::jsonb, 30, 150.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-07-16 (Day 3)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-07-16', '', 0, 'Day 3')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":27.5,"unit":"lb"},{"set":2,"reps":20,"weight":27.5,"unit":"lb"},{"set":3,"reps":20,"weight":27.5,"unit":"lb"}]'::jsonb, 60, 1650.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":0,"unit":"lb"},{"set":2,"reps":15,"weight":0,"unit":"lb"}]'::jsonb, 30, 0.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":10,"unit":"lb"},{"set":2,"reps":20,"weight":10,"unit":"lb"}]'::jsonb, 40, 400.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-07-21 (Day 1)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-07-21', '', 0, 'Day 1')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":55,"unit":"lb"},{"set":2,"reps":10,"weight":55,"unit":"lb"},{"set":3,"reps":10,"weight":55,"unit":"lb"}]'::jsonb, 30, 1650.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":15,"unit":"lb"},{"set":2,"reps":15,"weight":15,"unit":"lb"},{"set":3,"reps":15,"weight":15,"unit":"lb"}]'::jsonb, 45, 675.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":16,"weight":50,"unit":"lb"},{"set":2,"reps":15,"weight":50,"unit":"lb"},{"set":3,"reps":15,"weight":50,"unit":"lb"}]'::jsonb, 46, 2300.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-07-22 (Day 2)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-07-22', '', 0, 'Day 2')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":80,"unit":"lb"},{"set":2,"reps":15,"weight":80,"unit":"lb"},{"set":3,"reps":20,"weight":80,"unit":"lb"}]'::jsonb, 50, 4000.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Press (Machine)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Press (Machine)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Press (Machine)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":40,"unit":"lb"},{"set":2,"reps":15,"weight":40,"unit":"lb"},{"set":3,"reps":15,"weight":40,"unit":"lb"}]'::jsonb, 45, 1800.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":5,"unit":"lb"},{"set":2,"reps":15,"weight":5,"unit":"lb"},{"set":3,"reps":15,"weight":5,"unit":"lb"}]'::jsonb, 45, 225.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-07-23 (Day 3)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-07-23', '', 0, 'Day 3')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":27.5,"unit":"lb"},{"set":2,"reps":15,"weight":27.5,"unit":"lb"},{"set":3,"reps":15,"weight":27.5,"unit":"lb"}]'::jsonb, 50, 1375.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":0,"unit":"lb"},{"set":2,"reps":15,"weight":0,"unit":"lb"}]'::jsonb, 30, 0.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Shoulder Raise (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Shoulder Raise (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Shoulder Raise (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":20,"weight":10,"unit":"lb"},{"set":2,"reps":20,"weight":10,"unit":"lb"}]'::jsonb, 40, 400.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-08-26 (Day 1)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-08-26', '', 0, 'Day 1')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":55,"unit":"lb"},{"set":2,"reps":10,"weight":55,"unit":"lb"},{"set":3,"reps":10,"weight":55,"unit":"lb"}]'::jsonb, 30, 1650.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Bicep Curl (Dumbbell)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Bicep Curl (Dumbbell)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Bicep Curl (Dumbbell)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":15,"unit":"lb"},{"set":2,"reps":15,"weight":15,"unit":"lb"},{"set":3,"reps":10,"weight":15,"unit":"lb"}]'::jsonb, 35, 525.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":12,"weight":50,"unit":"lb"},{"set":2,"reps":10,"weight":50,"unit":"lb"},{"set":3,"reps":11,"weight":50,"unit":"lb"}]'::jsonb, 33, 1650.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-08-27 (Day 2)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-08-27', '', 0, 'Day 2')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":90,"unit":"lb"},{"set":2,"reps":15,"weight":90,"unit":"lb"},{"set":3,"reps":15,"weight":90,"unit":"lb"}]'::jsonb, 45, 4050.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":5,"unit":"lb"},{"set":2,"reps":15,"weight":5,"unit":"lb"},{"set":3,"reps":15,"weight":5,"unit":"lb"}]'::jsonb, 45, 225.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Lunge (Bodyweight)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Lunge (Bodyweight)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Lunge (Bodyweight)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":0,"unit":"lb"},{"set":2,"reps":15,"weight":0,"unit":"lb"}]'::jsonb, 30, 0.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-09-02 (Day 1)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-09-02', '', 0, 'Day 1')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":55,"unit":"lb"},{"set":2,"reps":15,"weight":55,"unit":"lb"},{"set":3,"reps":15,"weight":55,"unit":"lb"}]'::jsonb, 45, 2475.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Chest Press
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Chest Press')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Chest Press', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":50,"unit":"lb"},{"set":2,"reps":12,"weight":50,"unit":"lb"},{"set":3,"reps":12,"weight":50,"unit":"lb"}]'::jsonb, 39, 1950.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Dumbbell Bicep Curl
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Dumbbell Bicep Curl')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Dumbbell Bicep Curl', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":15,"unit":"lb"},{"set":2,"reps":15,"weight":15,"unit":"lb"},{"set":3,"reps":15,"weight":15,"unit":"lb"}]'::jsonb, 45, 675.00, 2)
  ON CONFLICT DO NOTHING;


  -- Session: 2025-09-03 (Day 2)
  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)
  VALUES (v_user_id, '2025-09-03', '', 0, 'Day 2')
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

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":10,"weight":40,"unit":"lb"},{"set":2,"reps":10,"weight":40,"unit":"lb"},{"set":3,"reps":10,"weight":40,"unit":"lb"}]'::jsonb, 30, 1200.00, 0)
  ON CONFLICT DO NOTHING;

  -- Exercise: Back Dumbbell Row
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Back Dumbbell Row')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Back Dumbbell Row', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":5,"unit":"lb"},{"set":2,"reps":15,"weight":5,"unit":"lb"},{"set":3,"reps":15,"weight":5,"unit":"lb"}]'::jsonb, 45, 225.00, 1)
  ON CONFLICT DO NOTHING;

  -- Exercise: Abductor Machine (Outer)
  SELECT id INTO v_exercise_id FROM public.exercises
  WHERE LOWER(canonical_name) = LOWER('Abductor Machine (Outer)')
  LIMIT 1;

  IF v_exercise_id IS NULL THEN
    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)
    VALUES ('Abductor Machine (Outer)', ARRAY[]::TEXT[], 'other', 'lb')
    RETURNING id INTO v_exercise_id;
  END IF;

  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)
  VALUES (v_session_id, v_exercise_id, '[{"set":1,"reps":15,"weight":90,"unit":"lb"},{"set":2,"reps":15,"weight":90,"unit":"lb"},{"set":3,"reps":15,"weight":90,"unit":"lb"}]'::jsonb, 45, 4050.00, 2)
  ON CONFLICT DO NOTHING;


END $$;

COMMIT;

-- Done! Import complete.
-- Run this SQL in Supabase SQL Editor
