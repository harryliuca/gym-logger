import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total exercises found: ${data?.length}\n`);

  data?.forEach(ex => {
    console.log(`ID: ${ex.id}`);
    console.log(`Name: ${ex.canonical_name}`);
    console.log(`Alternates: ${JSON.stringify(ex.alternate_names)}`);
    console.log('---');
  });
}

listExercises().catch(console.error);
