// Script to analyze Harry's workout patterns and extract Day 1/2/3 templates
// This will help us create workout templates based on actual usage

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeWorkoutPatterns() {
  console.log('Analyzing workout patterns...\n');

  // Get all sessions with category Day 1, Day 2, Day 3
  const { data: sessions, error } = await supabase
    .from('workout_sessions')
    .select(`
      id,
      category,
      session_date,
      session_exercises (
        exercise_id,
        sets,
        exercises (
          canonical_name
        )
      )
    `)
    .in('category', ['Day 1', 'Day 2', 'Day 3'])
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Group by category
  const patterns: Record<string, Map<string, number>> = {
    'Day 1': new Map(),
    'Day 2': new Map(),
    'Day 3': new Map(),
  };

  sessions?.forEach((session: any) => {
    const category = session.category;
    if (!category) return;

    session.session_exercises?.forEach((se: any) => {
      if (!se.exercises || !se.exercises.canonical_name) return;
      const exerciseName = se.exercises.canonical_name;
      const currentCount = patterns[category].get(exerciseName) || 0;
      patterns[category].set(exerciseName, currentCount + 1);
    });
  });

  // Print results
  for (const [day, exercises] of Object.entries(patterns)) {
    console.log(`\n=== ${day} ===`);
    console.log(`Total sessions: ${sessions?.filter((s: any) => s.category === day).length}`);
    console.log('\nMost common exercises:');

    const sorted = Array.from(exercises.entries())
      .sort((a, b) => b[1] - a[1]);

    sorted.forEach(([exercise, count]) => {
      console.log(`  ${exercise}: ${count} times`);
    });
  }

  // Find most recent workout for each day to get typical set/rep scheme
  console.log('\n\n=== Most Recent Workout Examples ===');
  for (const day of ['Day 1', 'Day 2', 'Day 3']) {
    const recentSession = sessions?.find((s: any) => s.category === day);
    if (recentSession) {
      console.log(`\n${day} (${recentSession.session_date}):`);
      recentSession.session_exercises?.forEach((se: any) => {
        const sets = se.sets || [];
        const setsSummary = sets.map((s: any) => `${s.reps}×${s.weight}lb`).join(', ');
        console.log(`  - ${se.exercises.canonical_name}: ${sets.length} sets [${setsSummary}]`);
      });
    }
  }
}

analyzeWorkoutPatterns();
