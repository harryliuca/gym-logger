-- Fix RLS policy to allow unauthenticated guests to view exercises
-- This enables the invite/share feature to show exercise details to guests

-- Drop the old policy that only allowed authenticated users
DROP POLICY IF EXISTS "Authenticated users can view exercises" ON public.exercises;

-- Create new policy that allows anyone (authenticated or not) to view exercises
CREATE POLICY "Anyone can view exercises" ON public.exercises
  FOR SELECT USING (true);

-- Note: We keep the insert policy for authenticated users only
-- Guests can read exercises but not create new ones
