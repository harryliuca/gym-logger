import { supabase } from './supabase';
import { WorkoutSession, SessionExercise, Exercise, WorkoutTemplateWithExercises } from '../types/database';

export interface WorkoutSessionWithExercises extends WorkoutSession {
  session_exercises: (SessionExercise & {
    exercises: Exercise;
  })[];
}

export const templateService = {
  /**
   * Get all public workout templates
   */
  async getPublicTemplates(): Promise<WorkoutTemplateWithExercises[]> {
    const { data, error } = await supabase
      .from('workout_templates')
      .select(`
        *,
        template_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('is_public', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data as WorkoutTemplateWithExercises[];
  },

  /**
   * Get a specific template by ID
   */
  async getTemplate(templateId: string): Promise<WorkoutTemplateWithExercises> {
    const { data, error } = await supabase
      .from('workout_templates')
      .select(`
        *,
        template_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('id', templateId)
      .single();

    if (error) throw error;
    return data as WorkoutTemplateWithExercises;
  },

  /**
   * Get the most recently used template by user
   * (based on workout sessions with matching template name)
   */
  async getMostRecentTemplate(): Promise<WorkoutTemplateWithExercises | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get the most recent workout session
    const { data: recentSession } = await supabase
      .from('workout_sessions')
      .select('category')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(1)
      .single();

    if (!recentSession?.category) return null;

    // Try to find a template matching the category
    const { data: template } = await supabase
      .from('workout_templates')
      .select(`
        *,
        template_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('name', recentSession.category)
      .eq('is_public', true)
      .single();

    return template as WorkoutTemplateWithExercises | null;
  },

  /**
   * Get the most popular template (by usage count)
   */
  async getMostPopularTemplate(): Promise<WorkoutTemplateWithExercises | null> {
    // For now, just return the first public template
    // TODO: Track template usage and return actual most popular
    const { data, error } = await supabase
      .from('workout_templates')
      .select(`
        *,
        template_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('is_public', true)
      .limit(1)
      .single();

    if (error) return null;
    return data as WorkoutTemplateWithExercises;
  },
};

export const profileService = {
  /**
   * Get all public profiles with calculated stats
   */
  async getPublicProfiles() {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, public_username, is_public')
      .eq('is_public', true);

    if (error) throw error;

    // Calculate stats for each profile
    const profilesWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const stats = await workoutService.getUserStatsForUser(profile.id);
        return {
          ...profile,
          total_sessions: stats.totalSessions,
          total_volume: stats.totalVolume,
          last_workout_date: stats.lastWorkoutDate,
        };
      })
    );

    // Sort by total volume
    return profilesWithStats.sort((a, b) => b.total_volume - a.total_volume);
  },

  /**
   * Get a specific user's public profile data
   */
  async getPublicProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, public_username, is_public, total_sessions, total_volume, last_workout_date')
      .eq('id', userId)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Toggle current user's public profile setting
   */
  async togglePublicProfile(isPublic: boolean, publicUsername?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error} = await supabase
      .from('profiles')
      .update({
        is_public: isPublic,
        public_username: publicUsername || null,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get current user's profile
   */
  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },
};

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
   * Get workout sessions for a public user
   */
  async getPublicUserSessions(userId: string): Promise<WorkoutSessionWithExercises[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select(`
        *,
        session_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('user_id', userId)
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
   * Get the most recent workout session for a specific category
   */
  async getMostRecentWorkoutByCategory(category: string): Promise<WorkoutSessionWithExercises | null> {
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
      .eq('category', category)
      .order('session_date', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data as WorkoutSessionWithExercises;
  },

  /**
   * Get all unique workout categories for the current user
   */
  async getUserCategories(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('workout_sessions')
      .select('category')
      .eq('user_id', user.id)
      .not('category', 'is', null)
      .order('session_date', { ascending: false });

    if (error) throw error;

    // Get unique categories in order of most recent use
    const categories = data
      ?.map(s => s.category)
      .filter((cat): cat is string => cat !== null);

    return [...new Set(categories)];
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
   * Get or create a workout session for a specific date
   * If a session already exists for that date, return it
   * Otherwise, create a new one
   */
  async getOrCreateSession(
    sessionDate: string,
    notes?: string,
    category?: string
  ): Promise<WorkoutSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First, try to find an existing session for this date
    const { data: existingSession } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('session_date', sessionDate)
      .maybeSingle();

    if (existingSession) {
      // Update category if provided
      if (category && existingSession.category !== category) {
        const { data: updated } = await supabase
          .from('workout_sessions')
          .update({ category })
          .eq('id', existingSession.id)
          .select()
          .single();
        return updated || existingSession;
      }
      return existingSession;
    }

    // No existing session, create a new one
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

    return this.getUserStatsForUser(user.id);
  },

  /**
   * Get stats for any user (for public profiles)
   */
  async getUserStatsForUser(userId: string) {
    // Get total sessions
    const { count: totalSessions } = await supabase
      .from('workout_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get total volume by summing all session_exercises for user's sessions
    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select(`
        id,
        session_exercises (
          total_volume
        )
      `)
      .eq('user_id', userId);

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
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
      .limit(1)
      .single();

    return {
      totalSessions: totalSessions || 0,
      totalVolume,
      lastWorkoutDate: recentSession?.session_date || null,
    };
  },

  /**
   * Get volume trend over time (for charts)
   */
  async getVolumeTrend(): Promise<{ date: string; volume: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select(`
        session_date,
        session_exercises (
          total_volume
        )
      `)
      .eq('user_id', user.id)
      .order('session_date', { ascending: true });

    if (!sessions) return [];

    return sessions.map(session => {
      const totalVolume = session.session_exercises?.reduce(
        (sum: number, ex: any) => sum + (ex.total_volume || 0),
        0
      ) || 0;

      return {
        date: session.session_date,
        volume: totalVolume,
      };
    });
  },

  /**
   * Get personal records for each exercise
   */
  async getPersonalRecords(): Promise<{
    exercise: string;
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
    date: string;
  }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select(`
        session_date,
        session_exercises (
          exercise_id,
          sets,
          total_volume,
          exercises (
            canonical_name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('session_date', { ascending: false });

    if (!sessions) return [];

    // Calculate PRs by exercise
    const prsByExercise = new Map<string, {
      exercise: string;
      maxWeight: number;
      maxReps: number;
      maxVolume: number;
      date: string;
    }>();

    sessions.forEach(session => {
      session.session_exercises?.forEach((ex: any) => {
        const exerciseName = ex.exercises.canonical_name;
        const sets = ex.sets || [];

        // Find max weight and max reps in this session
        let maxWeight = 0;
        let maxReps = 0;
        sets.forEach((set: any) => {
          if (set.weight > maxWeight) maxWeight = set.weight;
          if (set.reps > maxReps) maxReps = set.reps;
        });

        const existing = prsByExercise.get(exerciseName);
        if (!existing || ex.total_volume > existing.maxVolume) {
          prsByExercise.set(exerciseName, {
            exercise: exerciseName,
            maxWeight: Math.max(existing?.maxWeight || 0, maxWeight),
            maxReps: Math.max(existing?.maxReps || 0, maxReps),
            maxVolume: ex.total_volume,
            date: session.session_date,
          });
        }
      });
    });

    return Array.from(prsByExercise.values()).sort((a, b) =>
      b.maxVolume - a.maxVolume
    );
  },

  /**
   * Get workout frequency stats
   */
  async getWorkoutFrequency(): Promise<{
    totalDays: number;
    workoutDays: number;
    averagePerWeek: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: sessions } = await supabase
      .from('workout_sessions')
      .select('session_date')
      .eq('user_id', user.id)
      .order('session_date', { ascending: true });

    if (!sessions || sessions.length === 0) {
      return {
        totalDays: 0,
        workoutDays: 0,
        averagePerWeek: 0,
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    const dates = sessions.map(s => new Date(s.session_date).toDateString());
    const uniqueDates = [...new Set(dates)];

    const firstDate = new Date(sessions[0].session_date);
    const lastDate = new Date(sessions[sessions.length - 1].session_date);
    const totalDays = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const averagePerWeek = (uniqueDates.length / totalDays) * 7;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const sortedDates = uniqueDates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = Math.ceil((sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) { // Allow 1 day gap
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Check current streak
    const today = new Date();
    const lastWorkout = sortedDates[sortedDates.length - 1];
    const daysSinceLastWorkout = Math.ceil((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastWorkout <= 2) {
      currentStreak = tempStreak;
    }

    return {
      totalDays,
      workoutDays: uniqueDates.length,
      averagePerWeek: Math.round(averagePerWeek * 10) / 10,
      currentStreak,
      longestStreak,
    };
  },
};
