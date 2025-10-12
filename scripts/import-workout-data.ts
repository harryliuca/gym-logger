/**
 * Import workout history from Excel file to Supabase
 *
 * Usage: npx ts-node scripts/import-workout-data.ts <path-to-excel-file> <user-email>
 */

import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase setup
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Parse "bar + X" notation to weight
function parseWeight(input: string): number {
  const barWeight = 45; // Standard Olympic bar

  if (typeof input === 'number') return input;

  const str = input.toString().trim().toLowerCase();

  // Handle "bar + 10" notation
  const barMatch = str.match(/bar\s*\+\s*(\d+)/i);
  if (barMatch) {
    return barWeight + parseInt(barMatch[1]);
  }

  // Handle "bar" alone
  if (str === 'bar') return barWeight;

  // Handle regular numbers
  const numMatch = str.match(/(\d+\.?\d*)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }

  return 0;
}

// Parse range values (e.g., "10-15" returns 12.5)
function parseReps(input: string | number): number {
  if (typeof input === 'number') return input;

  const str = input.toString().trim();

  // Handle ranges like "10-15"
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    return Math.round((min + max) / 2);
  }

  // Handle regular numbers
  const numMatch = str.match(/(\d+)/);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }

  return 0;
}

// Find or create exercise by name (handles alternate names)
async function findOrCreateExercise(exerciseName: string): Promise<string | null> {
  // First, try to find by canonical name or alternate names
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or(`canonical_name.ilike.%${exerciseName}%,alternate_names.cs.{${exerciseName}}`);

  if (exercises && exercises.length > 0) {
    return exercises[0].id;
  }

  // If not found, create new exercise
  console.log(`📝 Creating new exercise: ${exerciseName}`);
  const { data: newExercise, error } = await supabase
    .from('exercises')
    .insert({
      canonical_name: exerciseName,
      alternate_names: [],
      category: 'other',
      default_weight_unit: 'lb',
    })
    .select()
    .single();

  if (error) {
    console.error(`❌ Error creating exercise "${exerciseName}":`, error);
    return null;
  }

  return newExercise.id;
}

// Main import function
async function importWorkouts(filePath: string, userEmail: string) {
  console.log(`📂 Reading Excel file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  // Read Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`📊 Found ${data.length} rows in Excel file`);

  // Get user ID
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!profiles) {
    console.error(`❌ User not found with email: ${userEmail}`);
    console.log('💡 Create an account first, then run this script again');
    process.exit(1);
  }

  const userId = profiles.id;
  console.log(`✅ Found user: ${userEmail}`);

  // Group by date
  const sessionsByDate = new Map<string, any[]>();

  for (const row of data) {
    const date = row['Date'] || row['date']; // Handle different column names
    if (!date) continue;

    if (!sessionsByDate.has(date)) {
      sessionsByDate.set(date, []);
    }
    sessionsByDate.get(date)!.push(row);
  }

  console.log(`📅 Found ${sessionsByDate.size} unique workout dates`);

  let imported = 0;
  let skipped = 0;

  // Process each session
  for (const [dateStr, rows] of sessionsByDate.entries()) {
    console.log(`\n📆 Processing: ${dateStr}`);

    // Create or get workout session
    const { data: existingSession } = await supabase
      .from('workout_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('session_date', dateStr)
      .single();

    let sessionId: string;

    if (existingSession) {
      sessionId = existingSession.id;
      console.log(`  ⏭️  Session already exists, skipping`);
      skipped++;
      continue;
    } else {
      const { data: newSession, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userId,
          session_date: dateStr,
          notes: '',
        })
        .select()
        .single();

      if (error || !newSession) {
        console.error(`  ❌ Error creating session:`, error);
        continue;
      }

      sessionId = newSession.id;
      console.log(`  ✅ Created session`);
    }

    // Process exercises for this session
    for (const row of rows) {
      const exerciseName = row['Exercise'] || row['exercise'];
      if (!exerciseName) continue;

      const exerciseId = await findOrCreateExercise(exerciseName);
      if (!exerciseId) continue;

      // Parse sets data
      const sets = [];
      let setNumber = 1;

      // Look for columns like "Set1", "Set2", "Reps1", "Reps2", "Weight1", "Weight2"
      while (row[`Set${setNumber}`] || row[`set${setNumber}`]) {
        const reps = parseReps(row[`Reps${setNumber}`] || row[`reps${setNumber}`] || 0);
        const weight = parseWeight(row[`Weight${setNumber}`] || row[`weight${setNumber}`] || row[`Set${setNumber}`] || 0);

        if (reps > 0) {
          sets.push({
            set: setNumber,
            reps,
            weight,
            unit: 'lb',
          });
        }

        setNumber++;
      }

      if (sets.length === 0) {
        console.log(`  ⚠️  No sets found for ${exerciseName}, skipping`);
        continue;
      }

      // Calculate totals
      const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);
      const totalVolume = sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);

      // Insert exercise
      const { error: exerciseError } = await supabase
        .from('session_exercises')
        .insert({
          session_id: sessionId,
          exercise_id: exerciseId,
          sets,
          total_reps: totalReps,
          total_volume: totalVolume,
          display_order: rows.indexOf(row),
        });

      if (exerciseError) {
        console.error(`  ❌ Error inserting exercise:`, exerciseError);
      } else {
        console.log(`  ✅ ${exerciseName}: ${sets.length} sets, ${totalReps} reps, ${totalVolume.toFixed(0)} lb volume`);
      }
    }

    imported++;
  }

  console.log(`\n🎉 Import complete!`);
  console.log(`  ✅ Imported: ${imported} sessions`);
  console.log(`  ⏭️  Skipped: ${skipped} sessions`);
}

// Run the script
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Usage: npx ts-node scripts/import-workout-data.ts <excel-file-path> <user-email>

Example:
  npx ts-node scripts/import-workout-data.ts ./workout-history.xlsx user@example.com
  `);
  process.exit(1);
}

const [filePath, userEmail] = args;

importWorkouts(filePath, userEmail)
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
