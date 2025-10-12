import { supabase } from './supabase';
import { WorkoutSession, SessionExercise, Exercise } from '../types/database';

export interface WorkoutSessionWithExercises extends WorkoutSession {
  session_exercises: (SessionExercise & {
    exercises: Exercise;
  })[];
}

export const workoutService = {
  /**
   * Get all workout sessions for the current user
   */
  async getSessions(): Promise<WorkoutSessionWithExercises[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        session_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('user_id', user.id)
      .order('session_date', { ascending: false });

    if (error) throw error;
    return data as WorkoutSessionWithExercises[];
  },

  /**
   * Get recent workout sessions (last N sessions)
   */
  async getRecentSessions(limit: number = 3): Promise<WorkoutSessionWithExercises[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        session_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as WorkoutSessionWithExercises[];
  },

  /**
   * Get a single workout session by ID
   */
  async getSession(sessionId: string): Promise<WorkoutSessionWithExercises | null> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        session_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data as WorkoutSessionWithExercises;
  },

  /**
   * Create a new workout session
   */
  async createSession(
    sessionDate: string,
    notes?: string,
    category?: string
  ): Promise<WorkoutSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        session_date: sessionDate,
        notes: notes || '',
        category: category || null,
        total_volume: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a workout session
   */
  async updateSession(
    sessionId: string,
    updates: Partial<Pick<WorkoutSession, 'notes' | 'total_volume'>>
  ): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a workout session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('workout_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  },

  /**
   * Add exercise to session
   */
  async addExerciseToSession(
    sessionId: string,
    exerciseId: string,
    sets: any[],
    displayOrder: number
  ): Promise<SessionExercise> {
    const totalReps = sets.reduce((sum, set) => sum + (set.reps || 0), 0);
    const totalVolume = sets.reduce((sum, set) => sum + ((set.reps || 0) * (set.weight || 0)), 0);

    const { data, error } = await supabase
      .from('session_exercises')
      .insert({
        session_id: sessionId,
        exercise_id: exerciseId,
        sets: sets,
        total_reps: totalReps,
        total_volume: totalVolume,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update exercise in session
   */
  async updateSessionExercise(
    sessionExerciseId: string,
    sets: any[]
  ): Promise<SessionExercise> {
    const totalReps = sets.reduce((sum, set) => sum + (set.reps || 0), 0);
    const totalVolume = sets.reduce((sum, set) => sum + ((set.reps || 0) * (set.weight || 0)), 0);

    const { data, error } = await supabase
      .from('session_exercises')
      .update({
        sets: sets,
        total_reps: totalReps,
        total_volume: totalVolume,
      })
      .eq('id', sessionExerciseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete exercise from session
   */
  async deleteSessionExercise(sessionExerciseId: string): Promise<void> {
    const { error } = await supabase
      .from('session_exercises')
      .delete()
      .eq('id', sessionExerciseId);

    if (error) throw error;
  },

  /**
   * Get all available exercises
   */
  async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('canonical_name');

    if (error) throw error;
    return data;
  },

  /**
   * Search exercises by name
   */
  async searchExercises(query: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .or(`canonical_name.ilike.%${query}%,alternate_names.cs.{${query}}`)
      .order('canonical_name')
      .limit(10);

    if (error) throw error;
    return data;
  },

  /**
   * Create a new exercise
   */
  async createExercise(
    canonicalName: string,
    category: string = 'other',
    alternateNames: string[] = []
  ): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        canonical_name: canonicalName,
        alternate_names: alternateNames,
        category: category,
        default_weight_unit: 'lb',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get user stats (total sessions, total volume, etc.)
   */
  async getUserStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get total sessions
    const { count: totalSessions } = await supabase
      .from('workout_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get total volume by summing all session_exercises for user's sessions
    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select(`
        id,
        session_exercises (
          total_volume
        )
      `)
      .eq('user_id', user.id);

    // Calculate total volume from all session_exercises
    let totalVolume = 0;
    sessions?.forEach(session => {
      session.session_exercises?.forEach((ex: any) => {
        totalVolume += ex.total_volume || 0;
      });
    });

    // Get most recent session date
    const { data: recentSession } = await supabase
      .from('workout_sessions')
      .select('session_date')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(1)
      .single();

    return {
      totalSessions: totalSessions || 0,
      totalVolume,
      lastWorkoutDate: recentSession?.session_date || null,
    };
  },
};
