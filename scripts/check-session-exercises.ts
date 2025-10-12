import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSessionExercises() {
  const { data, error } = await supabase
    .from('session_exercises')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample session_exercises:\n');
  console.log(JSON.stringify(data, null, 2));
}

checkSessionExercises().catch(console.error);
