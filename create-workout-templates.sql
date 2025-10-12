-- Workout Templates System
-- Allows users to choose from pre-defined workout splits

-- ============================================
-- 1. WORKOUT_TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- e.g., "Push Day", "Pull Day", "Legs Day"
  description TEXT,
  category TEXT, -- e.g., "PPL", "Upper/Lower", "Bro Split", "Custom"
  is_public BOOLEAN DEFAULT true, -- Public templates available to all users
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL for system templates
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TEMPLATE_EXERCISES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  display_order INTEGER DEFAULT 0,
  suggested_sets INTEGER DEFAULT 3,
  suggested_reps_min INTEGER, -- e.g., 8 reps
  suggested_reps_max INTEGER, -- e.g., 12 reps
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_templates_category ON public.workout_templates(category);
CREATE INDEX IF NOT EXISTS idx_workout_templates_public ON public.workout_templates(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id ON public.template_exercises(template_id);

-- RLS
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;

-- Anyone can view public templates
CREATE POLICY "Anyone can view public templates" ON public.workout_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

-- Anyone can view exercises in public templates
CREATE POLICY "Anyone can view public template exercises" ON public.template_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND (workout_templates.is_public = true OR workout_templates.created_by = auth.uid())
    )
  );

-- Users can create their own templates
CREATE POLICY "Users can create own templates" ON public.workout_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own templates" ON public.workout_templates
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own templates" ON public.workout_templates
  FOR DELETE USING (created_by = auth.uid());

-- Users can add exercises to their own templates
CREATE POLICY "Users can add exercises to own templates" ON public.template_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.created_by = auth.uid()
    )
  );

-- ============================================
-- 3. INSERT HARRY'S DAY 1/2/3 TEMPLATES
-- ============================================

-- Get Harry's user ID
DO $$
DECLARE
  v_harry_id UUID;
BEGIN
  SELECT id INTO v_harry_id FROM public.profiles WHERE email = 'harry.liu.ca@gmail.com';

  -- Day 1 Template (Based on typical Day 1 workouts)
  INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
  VALUES (
    'Harry''s Day 1',
    'Harry''s typical Day 1 workout routine',
    'Custom Split',
    true,
    v_harry_id
  );

  -- Day 2 Template
  INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
  VALUES (
    'Harry''s Day 2',
    'Harry''s typical Day 2 workout routine',
    'Custom Split',
    true,
    v_harry_id
  );

  -- Day 3 Template
  INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
  VALUES (
    'Harry''s Day 3',
    'Harry''s typical Day 3 workout routine',
    'Custom Split',
    true,
    v_harry_id
  );
END $$;

-- ============================================
-- 4. INSERT COMMON WORKOUT SPLIT TEMPLATES
-- ============================================

-- Push Day (PPL)
INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
VALUES (
  'Push Day',
  'Chest, Shoulders, and Triceps - Part of Push/Pull/Legs split',
  'PPL',
  true,
  NULL
);

-- Pull Day (PPL)
INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
VALUES (
  'Pull Day',
  'Back and Biceps - Part of Push/Pull/Legs split',
  'PPL',
  true,
  NULL
);

-- Legs Day (PPL)
INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
VALUES (
  'Legs Day',
  'Quads, Hamstrings, and Calves - Part of Push/Pull/Legs split',
  'PPL',
  true,
  NULL
);

-- Upper Body Day
INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
VALUES (
  'Upper Body',
  'All upper body muscles - Part of Upper/Lower split',
  'Upper/Lower',
  true,
  NULL
);

-- Lower Body Day
INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
VALUES (
  'Lower Body',
  'All lower body muscles - Part of Upper/Lower split',
  'Upper/Lower',
  true,
  NULL
);

-- Full Body
INSERT INTO public.workout_templates (name, description, category, is_public, created_by)
VALUES (
  'Full Body',
  'Complete full body workout hitting all major muscle groups',
  'Full Body',
  true,
  NULL
);

-- ============================================
-- 5. ADD EXERCISES TO TEMPLATES
-- ============================================

-- Push Day Exercises
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Push Day'),
  e.id,
  ROW_NUMBER() OVER () - 1,
  CASE e.canonical_name
    WHEN 'Bench Press' THEN 4
    WHEN 'Overhead Press' THEN 3
    ELSE 3
  END,
  8,
  12
FROM public.exercises e
WHERE e.canonical_name IN ('Bench Press', 'Overhead Press', 'Dip', 'Tricep Extension');

-- Pull Day Exercises
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Pull Day'),
  e.id,
  ROW_NUMBER() OVER () - 1,
  CASE e.canonical_name
    WHEN 'Deadlift' THEN 3
    WHEN 'Barbell Row' THEN 4
    ELSE 3
  END,
  6,
  12
FROM public.exercises e
WHERE e.canonical_name IN ('Deadlift', 'Barbell Row', 'Pull-up', 'Lat Pulldown', 'Bicep Curl');

-- Legs Day Exercises
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Legs Day'),
  e.id,
  ROW_NUMBER() OVER () - 1,
  CASE e.canonical_name
    WHEN 'Squat' THEN 4
    WHEN 'Leg Press' THEN 3
    ELSE 3
  END,
  8,
  15
FROM public.exercises e
WHERE e.canonical_name IN ('Squat', 'Leg Press', 'Leg Curl', 'Calf Raise');

-- Upper Body Exercises
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Upper Body'),
  e.id,
  ROW_NUMBER() OVER () - 1,
  3,
  8,
  12
FROM public.exercises e
WHERE e.canonical_name IN ('Bench Press', 'Barbell Row', 'Overhead Press', 'Pull-up', 'Bicep Curl', 'Tricep Extension');

-- Lower Body Exercises
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Lower Body'),
  e.id,
  ROW_NUMBER() OVER () - 1,
  CASE e.canonical_name
    WHEN 'Squat' THEN 4
    WHEN 'Deadlift' THEN 3
    ELSE 3
  END,
  8,
  12
FROM public.exercises e
WHERE e.canonical_name IN ('Squat', 'Deadlift', 'Leg Press', 'Leg Curl', 'Calf Raise');

-- Full Body Exercises
INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)
SELECT
  (SELECT id FROM public.workout_templates WHERE name = 'Full Body'),
  e.id,
  ROW_NUMBER() OVER () - 1,
  3,
  8,
  12
FROM public.exercises e
WHERE e.canonical_name IN ('Squat', 'Bench Press', 'Barbell Row', 'Overhead Press', 'Deadlift');

-- Verify
SELECT
  wt.name AS template_name,
  wt.category,
  COUNT(te.id) AS exercise_count
FROM public.workout_templates wt
LEFT JOIN public.template_exercises te ON te.template_id = wt.id
GROUP BY wt.id, wt.name, wt.category
ORDER BY wt.category, wt.name;
