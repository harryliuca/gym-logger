-- Populate Harry's Day 1/2/3 Templates with Actual Exercises
-- Run this AFTER running create-workout-templates.sql

-- ============================================
-- POPULATE HARRY'S DAY 1
-- ============================================

-- Day 1: Chest Press, Adductor Machine, Shoulder Raise, Lat Pulldown, Push Plate Machine
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 1'),
  e.id,
  0,
  3,
  10,
  14
FROM public.exercises e
WHERE e.canonical_name = 'Chest Press';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 1'),
  e.id,
  1,
  3,
  11,
  15
FROM public.exercises e
WHERE e.canonical_name = 'Adductor Machine';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 1'),
  e.id,
  2,
  3,
  11,
  15
FROM public.exercises e
WHERE e.canonical_name = 'Shoulder Raise';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 1'),
  e.id,
  3,
  3,
  12,
  16
FROM public.exercises e
WHERE e.canonical_name = 'Lat Pulldown';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 1'),
  e.id,
  4,
  3,
  13,
  17
FROM public.exercises e
WHERE e.canonical_name = 'Push Plate Machine';

-- ============================================
-- POPULATE HARRY'S DAY 2
-- ============================================

-- Day 2: Deadlift, Chest Press, Leg Press/Extension, Shoulder Press, Pull-up, Leg Curl
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 2'),
  e.id,
  0,
  3,
  11,
  15
FROM public.exercises e
WHERE e.canonical_name = 'Deadlift';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 2'),
  e.id,
  1,
  2,
  8,
  12
FROM public.exercises e
WHERE e.canonical_name = 'Chest Press';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 2'),
  e.id,
  2,
  3,
  14,
  18
FROM public.exercises e
WHERE e.canonical_name = 'Leg Press/Extension';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 2'),
  e.id,
  3,
  3,
  9,
  13
FROM public.exercises e
WHERE e.canonical_name = 'Shoulder Press';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 2'),
  e.id,
  4,
  3,
  13,
  17
FROM public.exercises e
WHERE e.canonical_name = 'Pull-up';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 2'),
  e.id,
  5,
  2,
  13,
  17
FROM public.exercises e
WHERE e.canonical_name = 'Leg Curl';

-- ============================================
-- POPULATE HARRY'S DAY 3
-- ============================================

-- Day 3: Squat, Leg Curl, Leg Extension
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 3'),
  e.id,
  0,
  3,
  17,
  21
FROM public.exercises e
WHERE e.canonical_name = 'Squat';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 3'),
  e.id,
  1,
  2,
  15,
  19
FROM public.exercises e
WHERE e.canonical_name = 'Leg Curl';

INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Harry''s Day 3'),
  e.id,
  2,
  2,
  18,
  22
FROM public.exercises e
WHERE e.canonical_name = 'Leg Extension';

-- Verify templates
SELECT
  wt.name AS template_name,
  wt.category,
  COUNT(te.id) AS exercise_count,
  STRING_AGG(e.canonical_name, ', ' ORDER BY te.display_order) AS exercises
FROM public.workout_templates wt
LEFT JOIN public.template_exercises te ON te.template_id = wt.id
LEFT JOIN public.exercises e ON e.id = te.exercise_id
WHERE wt.name LIKE 'Harry%'
GROUP BY wt.id, wt.name, wt.category
ORDER BY wt.name;
