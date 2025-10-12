-- Add public profile functionality
-- Run this in Supabase SQL Editor

-- 1. Add is_public column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Add public_username for public profiles (optional display name)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS public_username TEXT;

-- 3. Create index for public profiles
CREATE INDEX IF NOT EXISTS idx_profiles_is_public ON public.profiles(is_public) WHERE is_public = true;

-- 4. Update RLS policies to allow viewing public profiles
-- Allow anyone to view public profiles
CREATE POLICY "Anyone can view public profiles" ON public.profiles
  FOR SELECT USING (is_public = true);

-- 5. Update workout_sessions policies to allow viewing public sessions
CREATE POLICY "Anyone can view public sessions" ON public.workout_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = workout_sessions.user_id
      AND profiles.is_public = true
    )
  );

-- 6. Update session_exercises policies to allow viewing public exercises
CREATE POLICY "Anyone can view public session exercises" ON public.session_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      JOIN public.profiles p ON p.id = ws.user_id
      WHERE ws.id = session_exercises.session_id
      AND p.is_public = true
    )
  );

-- 7. Update user_exercise_stats to allow viewing public stats
CREATE POLICY "Anyone can view public exercise stats" ON public.user_exercise_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_exercise_stats.user_id
      AND profiles.is_public = true
    )
  );

-- 8. Set your profile as public (replace with your actual email)
UPDATE public.profiles
SET is_public = true, public_username = 'Harry'
WHERE email = 'harry.liu.ca@gmail.com';

-- Verify the changes
SELECT id, email, display_name, public_username, is_public
FROM public.profiles
WHERE email = 'harry.liu.ca@gmail.com';
