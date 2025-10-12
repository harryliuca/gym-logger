import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeWorkouts() {
  console.log('Fetching Harry\'s workout sessions...\n');

  // Get Harry's user ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'harry.liu.ca@gmail.com')
    .single();

  if (!profile) {
    console.error('Could not find Harry\'s profile');
    return;
  }

  const harryId = profile.id;
  console.log(`Harry's ID: ${harryId}\n`);

  // Get all exercises first
  const { data: allExercises } = await supabase
    .from('exercises')
    .select('id, canonical_name');

  const exerciseMap = new Map(allExercises?.map(e => [e.id, e.canonical_name]) || []);

  // Get all workout sessions
  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select(`
      id,
      session_date,
      category,
      session_exercises (
        id,
        exercise_id,
        sets,
        display_order
      )
    `)
    .eq('user_id', harryId)
    .order('session_date', { ascending: false });

  console.log(`Total sessions: ${sessions?.length || 0}\n`);

  // Group by category
  const day1Sessions = sessions?.filter(s => s.category === 'Day 1') || [];
  const day2Sessions = sessions?.filter(s => s.category === 'Day 2') || [];
  const day3Sessions = sessions?.filter(s => s.category === 'Day 3') || [];

  console.log(`Day 1 sessions: ${day1Sessions.length}`);
  console.log(`Day 2 sessions: ${day2Sessions.length}`);
  console.log(`Day 3 sessions: ${day3Sessions.length}\n`);

  // Analyze each day
  console.log('='.repeat(80));
  console.log('DAY 1 ANALYSIS');
  console.log('='.repeat(80));
  await analyzeDay(day1Sessions, exerciseMap, 'Day 1');

  console.log('\n' + '='.repeat(80));
  console.log('DAY 2 ANALYSIS');
  console.log('='.repeat(80));
  await analyzeDay(day2Sessions, exerciseMap, 'Day 2');

  console.log('\n' + '='.repeat(80));
  console.log('DAY 3 ANALYSIS');
  console.log('='.repeat(80));
  await analyzeDay(day3Sessions, exerciseMap, 'Day 3');
}

async function analyzeDay(sessions: any[], exerciseMap: Map<string, string>, dayName: string) {
  if (sessions.length === 0) {
    console.log('No sessions found for this day');
    return;
  }

  // Collect all exercises across sessions
  const exerciseStats = new Map<string, {
    id: string;
    name: string;
    count: number;
    totalSets: number;
    totalReps: number;
    totalWeight: number;
    setCount: number;
    displayOrders: number[];
  }>();

  sessions.forEach(session => {
    session.session_exercises?.forEach((se: any) => {
      const exerciseId = se.exercise_id;
      const exerciseName = exerciseMap.get(exerciseId) || 'Unknown';
      const sets = se.sets || [];

      const existing = exerciseStats.get(exerciseId) || {
        id: exerciseId,
        name: exerciseName,
        count: 0,
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        setCount: 0,
        displayOrders: [] as number[],
      };

      existing.count += 1;
      existing.totalSets += sets.length;
      existing.displayOrders.push(se.display_order);

      sets.forEach((set: any) => {
        existing.totalReps += set.reps || 0;
        existing.totalWeight += set.weight || 0;
        existing.setCount += 1;
      });

      exerciseStats.set(exerciseId, existing);
    });
  });

  // Calculate averages and sort by most common display order
  const patterns = Array.from(exerciseStats.values())
    .map(stat => {
      const avgDisplayOrder = stat.displayOrders.reduce((a: number, b: number) => a + b, 0) / stat.displayOrders.length;
      return {
        exerciseName: stat.name,
        exerciseId: stat.id,
        frequency: stat.count,
        avgSets: Math.round(stat.totalSets / stat.count),
        avgReps: stat.setCount > 0 ? Math.round(stat.totalReps / stat.setCount) : 0,
        avgWeight: stat.setCount > 0 ? Math.round(stat.totalWeight / stat.setCount) : 0,
        avgDisplayOrder,
      };
    })
    .sort((a, b) => a.avgDisplayOrder - b.avgDisplayOrder);

  // Display results
  console.log(`\nExercises (sorted by typical order):\n`);
  console.log('Exercise Name'.padEnd(30), 'Freq', 'Avg Sets', 'Avg Reps', 'Avg Weight');
  console.log('-'.repeat(80));

  patterns.forEach(p => {
    console.log(
      p.exerciseName.padEnd(30),
      String(p.frequency).padEnd(5),
      String(p.avgSets).padEnd(9),
      String(p.avgReps).padEnd(9),
      String(p.avgWeight).padEnd(10)
    );
  });

  // Generate SQL INSERT statements
  console.log(`\n\nSQL INSERT statements for ${dayName}:\n`);
  patterns.forEach((p, index) => {
    const repMin = Math.max(1, p.avgReps - 2);
    const repMax = p.avgReps + 2;
    console.log(`-- ${p.exerciseName}`);
    console.log(`INSERT INTO public.template_exercises (template_id, exercise_id, display_order, suggested_sets, suggested_reps_min, suggested_reps_max)`);
    console.log(`SELECT id, '${p.exerciseId}', ${index}, ${p.avgSets}, ${repMin}, ${repMax}`);
    console.log(`FROM public.workout_templates WHERE name = 'Harry''s ${dayName}';`);
    console.log('');
  });
}

analyzeWorkouts().catch(console.error);
