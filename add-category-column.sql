-- Add category column to workout_sessions table
-- Run this in Supabase SQL Editor

ALTER TABLE public.workout_sessions
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add comment
COMMENT ON COLUMN public.workout_sessions.category IS 'Workout category/split: Push, Pull, Legs, etc.';
