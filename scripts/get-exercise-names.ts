import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const exerciseIds = [
  // Day 1
  'ca85126f-5b26-4b84-84e4-e58d44e9a9de',
  'dfef69c7-7502-4ec7-8ca1-cb7c32d7fc80',
  '8dabcc30-4870-464c-b5f1-e242d93dc350',
  '7198623e-dc9c-4f46-aa9a-c5a713abd6c1',
  '7d0dade1-9332-401d-adf3-fdc669e2d689',
  '7362d014-7979-4cd9-9fcb-a05f9f6bca51',
  // Day 2
  'e6243040-3f0f-4dda-8cd9-e07f19e87432',
  'f29782de-c710-482f-a297-b324148c26f0',
  'ab3d2812-013a-4472-b229-b0b416438f8f',
  'bab9d468-4422-47ee-a3e9-4380185847f7',
  '712712b0-487f-44a7-896e-886cd118ace0',
  // Day 3
  'f8c505dc-0def-406c-a858-ac6f42d2631c',
  'b9c50290-5063-4d80-aec1-f877f6efcbce',
];

async function getNames() {
  const { data } = await supabase
    .from('exercises')
    .select('id, canonical_name')
    .in('id', exerciseIds);

  console.log('Exercise Names:\n');
  data?.forEach(ex => {
    console.log(`'${ex.id}' => ${ex.canonical_name}`);
  });
}

getNames().catch(console.error);
