import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStructure() {
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

  // Get one session with all details
  const { data: session, error } = await supabase
    .from('workout_sessions')
    .select(`
      id,
      session_date,
      category,
      session_exercises (
        id,
        exercise_id,
        sets,
        display_order,
        exercises (
          id,
          canonical_name
        )
      )
    `)
    .eq('user_id', harryId)
    .eq('category', 'Day 1')
    .order('session_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Session structure:');
  console.log(JSON.stringify(session, null, 2));
}

checkStructure().catch(console.error);
