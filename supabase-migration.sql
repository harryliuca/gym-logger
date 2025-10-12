-- Gym Logger Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Settings
  default_weight_unit TEXT DEFAULT 'lb' CHECK (default_weight_unit IN ('lb', 'kg')),
  default_set_count INTEGER DEFAULT 3,
  voice_language TEXT DEFAULT 'en-US',

  -- Stats
  total_sessions INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2) DEFAULT 0, -- Total weight lifted all time
  last_workout_date DATE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 2. EXERCISES TABLE (Master Exercise List)
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canonical_name TEXT UNIQUE NOT NULL,
  alternate_names TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g., ["Dead lift", "DL", "deadlifts"]
  category TEXT CHECK (category IN ('push', 'pull', 'legs', 'core', 'cardio', 'other')),
  default_weight_unit TEXT DEFAULT 'lb',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster searching
CREATE INDEX IF NOT EXISTS idx_exercises_canonical_name ON public.exercises(canonical_name);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);

-- RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view exercises" ON public.exercises
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert exercises" ON public.exercises
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 3. WORKOUT_SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  notes TEXT,
  total_volume DECIMAL(10,2) DEFAULT 0, -- Calculated: sum of all sets (reps * weight)
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, session_date) -- One session per user per day
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON public.workout_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON public.workout_sessions(user_id, session_date DESC);

-- RLS
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.workout_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.workout_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. SESSION_EXERCISES TABLE (The actual workout logs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.session_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE RESTRICT NOT NULL,

  -- Sets data stored as JSONB array: [{set: 1, reps: 15, weight: 55, unit: 'lb', notes: ''}]
  sets JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Calculated fields (updated via trigger or application)
  total_reps INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2) DEFAULT 0,

  notes TEXT,
  display_order INTEGER DEFAULT 0, -- Order in which exercises appear in the session
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id ON public.session_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise_id ON public.session_exercises(exercise_id);

-- RLS
ALTER TABLE public.session_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session exercises" ON public.session_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = session_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own session exercises" ON public.session_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = session_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own session exercises" ON public.session_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = session_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own session exercises" ON public.session_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = session_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. USER_EXERCISE_STATS TABLE (Quick comparison view)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_exercise_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,

  -- Last performed stats
  last_weight DECIMAL(10,2),
  last_weight_unit TEXT DEFAULT 'lb',
  last_reps INTEGER,
  last_sets INTEGER,
  last_performed DATE,

  -- Aggregate stats
  total_sessions INTEGER DEFAULT 0,
  max_weight DECIMAL(10,2),
  max_reps INTEGER,
  total_volume DECIMAL(10,2) DEFAULT 0,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, exercise_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_exercise_stats_user_id ON public.user_exercise_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_stats_exercise_id ON public.user_exercise_stats(exercise_id);

-- RLS
ALTER TABLE public.user_exercise_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercise stats" ON public.user_exercise_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercise stats" ON public.user_exercise_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise stats" ON public.user_exercise_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SAMPLE DATA (Common Exercises)
-- ============================================

INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit, notes)
VALUES
  ('Deadlift', ARRAY['Dead lift', 'DL', 'deadlifts'], 'pull', 'lb', 'Compound movement'),
  ('Bench Press', ARRAY['Bench', 'BP', 'chest press'], 'push', 'lb', 'Upper body compound'),
  ('Squat', ARRAY['Back squat', 'squats'], 'legs', 'lb', 'Lower body compound'),
  ('Overhead Press', ARRAY['OHP', 'Military press', 'shoulder press'], 'push', 'lb', 'Shoulder compound'),
  ('Barbell Row', ARRAY['Bent row', 'BB row', 'rows'], 'pull', 'lb', 'Back compound'),
  ('Pull-up', ARRAY['Pullups', 'chin-up', 'chinups'], 'pull', 'lb', 'Bodyweight back exercise'),
  ('Dip', ARRAY['Dips', 'parallel bar dips'], 'push', 'lb', 'Bodyweight push exercise'),
  ('Bicep Curl', ARRAY['Biceps curl', 'curls', 'DB curl'], 'pull', 'lb', 'Isolation'),
  ('Tricep Extension', ARRAY['Triceps extension', 'overhead extension'], 'push', 'lb', 'Isolation'),
  ('Leg Press', ARRAY['LP'], 'legs', 'lb', 'Quad focused'),
  ('Lat Pulldown', ARRAY['Pulldown', 'lat pull'], 'pull', 'lb', 'Back isolation'),
  ('Leg Curl', ARRAY['Hamstring curl', 'lying leg curl'], 'legs', 'lb', 'Hamstring isolation'),
  ('Calf Raise', ARRAY['Calf raises', 'standing calf'], 'legs', 'lb', 'Calf isolation')
ON CONFLICT (canonical_name) DO NOTHING;
