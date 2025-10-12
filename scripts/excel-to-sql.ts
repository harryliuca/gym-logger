/**
 * Convert Excel workout history to SQL INSERT statements
 *
 * Usage: npx ts-node scripts/excel-to-sql.ts <excel-file> <user-email> > output.sql
 */

import XLSX from 'xlsx';
import fs from 'fs';

// Parse "bar + X" notation to weight
function parseWeight(input: any): number {
  const barWeight = 45;

  if (typeof input === 'number') return input;

  const str = String(input).trim().toLowerCase();

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
function parseReps(input: any): number {
  if (typeof input === 'number') return input;

  const str = String(input).trim();

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

// Escape single quotes for SQL
function sqlEscape(str: string): string {
  return str.replace(/'/g, "''");
}

// Convert Excel to SQL
function excelToSQL(filePath: string, userEmail: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Read Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data: any[] = XLSX.utils.sheet_to_json(worksheet);

  console.log(`-- Generated SQL from: ${filePath}`);
  console.log(`-- Total rows: ${data.length}`);
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log(`-- User email: ${userEmail}\n`);

  // Group by date
  const sessionsByDate = new Map<string, any[]>();

  for (const row of data) {
    const date = row['Date'] || row['date'];
    if (!date) continue;

    // Convert Excel date if needed
    let dateStr: string;
    if (typeof date === 'number') {
      // Excel serial date
      const excelDate = new Date((date - 25569) * 86400 * 1000);
      dateStr = excelDate.toISOString().split('T')[0];
    } else {
      dateStr = String(date).split('T')[0]; // Remove time if present
    }

    if (!sessionsByDate.has(dateStr)) {
      sessionsByDate.set(dateStr, []);
    }
    sessionsByDate.get(dateStr)!.push(row);
  }

  console.log(`-- Found ${sessionsByDate.size} unique workout dates\n`);

  // Start transaction
  console.log('BEGIN;\n');

  // Get user ID
  console.log(`-- Get user ID`);
  console.log(`DO $$`);
  console.log(`DECLARE`);
  console.log(`  v_user_id UUID;`);
  console.log(`  v_session_id UUID;`);
  console.log(`  v_exercise_id UUID;`);
  console.log(`BEGIN`);
  console.log(`  -- Get user ID from email`);
  console.log(`  SELECT id INTO v_user_id FROM public.profiles WHERE email = '${sqlEscape(userEmail)}';`);
  console.log(`  IF v_user_id IS NULL THEN`);
  console.log(`    RAISE EXCEPTION 'User not found: ${sqlEscape(userEmail)}';`);
  console.log(`  END IF;\n`);

  console.log(`  RAISE NOTICE 'Found user ID: %', v_user_id;\n`);

  // Process each session
  for (const [dateStr, rows] of sessionsByDate.entries()) {
    // Extract Day from the session (should be the same for all exercises in a session)
    let sessionDay: string | null = null;
    for (const row of rows) {
      const day = row['Day'] || row['day'];
      if (day) {
        sessionDay = String(day);
        break; // Use the first Day value found
      }
    }

    console.log(`  -- Session: ${dateStr}${sessionDay ? ' (' + sessionDay + ')' : ''}`);
    console.log(`  INSERT INTO public.workout_sessions (user_id, session_date, notes, total_volume, category)`);
    console.log(`  VALUES (v_user_id, '${dateStr}', '', 0, ${sessionDay ? "'" + sqlEscape(sessionDay) + "'" : 'NULL'})`);
    console.log(`  ON CONFLICT (user_id, session_date) DO NOTHING`);
    console.log(`  RETURNING id INTO v_session_id;\n`);

    console.log(`  IF v_session_id IS NULL THEN`);
    console.log(`    SELECT id INTO v_session_id FROM public.workout_sessions`);
    console.log(`    WHERE user_id = v_user_id AND session_date = '${dateStr}';`);
    console.log(`  END IF;\n`);

    // Track unique exercises for this session
    const exercises = new Map<string, any[]>();

    for (const row of rows) {
      const exerciseName = row['Exercise'] || row['exercise'];
      if (!exerciseName) continue;

      if (!exercises.has(exerciseName)) {
        exercises.set(exerciseName, []);
      }
      exercises.get(exerciseName)!.push(row);
    }

    // Process each exercise
    let displayOrder = 0;
    for (const [exerciseName, exerciseRows] of exercises.entries()) {
      console.log(`  -- Exercise: ${exerciseName}`);

      // Find or create exercise
      console.log(`  SELECT id INTO v_exercise_id FROM public.exercises`);
      console.log(`  WHERE LOWER(canonical_name) = LOWER('${sqlEscape(exerciseName)}')`);
      console.log(`  LIMIT 1;\n`);

      console.log(`  IF v_exercise_id IS NULL THEN`);
      console.log(`    INSERT INTO public.exercises (canonical_name, alternate_names, category, default_weight_unit)`);
      console.log(`    VALUES ('${sqlEscape(exerciseName)}', ARRAY[]::TEXT[], 'other', 'lb')`);
      console.log(`    RETURNING id INTO v_exercise_id;`);
      console.log(`  END IF;\n`);

      // Build sets array
      const sets: any[] = [];

      for (const row of exerciseRows) {
        let setNumber = 1;

        // Look for Reps_S1, Reps_S2, Reps_S3 or Reps1, Reps2, Reps3 columns
        while (
          row[`Reps_S${setNumber}`] !== undefined ||
          row[`Reps${setNumber}`] !== undefined ||
          row[`reps_s${setNumber}`] !== undefined ||
          row[`reps${setNumber}`] !== undefined
        ) {
          const repsCol = row[`Reps_S${setNumber}`] || row[`Reps${setNumber}`] || row[`reps_s${setNumber}`] || row[`reps${setNumber}`];
          const weightCol = row[`Weight_S${setNumber}`] || row[`Weight${setNumber}`] || row[`weight_s${setNumber}`] || row[`weight${setNumber}`] || row[`Set${setNumber}`] || row[`set${setNumber}`];

          if (repsCol !== undefined && repsCol !== null && repsCol !== '') {
            const reps = parseReps(repsCol);
            const weight = parseWeight(weightCol || 0);

            if (reps > 0) {
              sets.push({
                set: setNumber,
                reps,
                weight,
                unit: 'lb'
              });
            }
          }

          setNumber++;
        }
      }

      if (sets.length === 0) continue;

      // Calculate totals
      const totalReps = sets.reduce((sum, s) => sum + s.reps, 0);
      const totalVolume = sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);

      // Generate JSONB array
      const setsJSON = JSON.stringify(sets).replace(/'/g, "''");

      console.log(`  INSERT INTO public.session_exercises (session_id, exercise_id, sets, total_reps, total_volume, display_order)`);
      console.log(`  VALUES (v_session_id, v_exercise_id, '${setsJSON}'::jsonb, ${totalReps}, ${totalVolume.toFixed(2)}, ${displayOrder})`);
      console.log(`  ON CONFLICT DO NOTHING;\n`);

      displayOrder++;
    }

    console.log('');
  }

  console.log(`END $$;\n`);
  console.log('COMMIT;\n');
  console.log(`-- Done! Import complete.`);
  console.log(`-- Run this SQL in Supabase SQL Editor`);
}

// Run
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Usage: npx ts-node scripts/excel-to-sql.ts <excel-file> <user-email> > output.sql

Example:
  npx ts-node scripts/excel-to-sql.ts workout-history.xlsx john@example.com > import.sql

Then run import.sql in Supabase SQL Editor.
  `);
  process.exit(1);
}

const [filePath, userEmail] = args;

try {
  excelToSQL(filePath, userEmail);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
