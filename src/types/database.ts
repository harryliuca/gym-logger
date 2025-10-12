// Database types matching Supabase schema

export type WeightUnit = 'lb' | 'kg';
export type ExerciseCategory = 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'other';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;

  // Settings
  default_weight_unit: WeightUnit;
  default_set_count: number;
  voice_language: string;

  // Stats
  total_sessions: number;
  total_volume: number;
  last_workout_date: string | null;

  // Public profile
  is_public: boolean;
  public_username: string | null;
}

export interface Exercise {
  id: string;
  canonical_name: string;
  alternate_names: string[];
  category: ExerciseCategory | null;
  default_weight_unit: WeightUnit;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  session_date: string; // ISO date string (YYYY-MM-DD)
  notes: string | null;
  category: string | null; // Workout category/split: Push, Pull, Legs, etc.
  total_volume: number;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface Set {
  set: number;
  reps: number;
  weight: number;
  unit: WeightUnit;
  notes?: string;
}

export interface SessionExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  sets: Set[];
  total_reps: number;
  total_volume: number;
  notes: string | null;
  display_order: number;
  created_at: string;

  // Joined data (not in DB)
  exercise?: Exercise;
}

export interface UserExerciseStats {
  id: string;
  user_id: string;
  exercise_id: string;
  last_weight: number | null;
  last_weight_unit: WeightUnit;
  last_reps: number | null;
  last_sets: number | null;
  last_performed: string | null;
  total_sessions: number;
  max_weight: number | null;
  max_reps: number | null;
  total_volume: number;
  updated_at: string;

  // Joined data (not in DB)
  exercise?: Exercise;
}

// Extended types for UI
export interface WorkoutSessionWithExercises extends WorkoutSession {
  exercises: SessionExercise[];
}

// Voice input parsing types
export interface ParsedExercise {
  exerciseName: string;
  sets: Array<{
    reps: number;
    weight: number;
    unit: WeightUnit;
  }>;
  notes?: string;
}

export interface VoiceParseResult {
  exercises: ParsedExercise[];
  rawTranscript: string;
  confidence: number;
}
