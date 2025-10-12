# Import Workout History from Excel

This guide explains how to import your existing workout data from an Excel file into the Gym Logger app.

## Prerequisites

1. ✅ Supabase database set up (tables created)
2. ✅ User account created in the app
3. ✅ Excel file with workout history

---

## Step 1: Prepare Your Excel File

The import script expects your Excel file to have columns like:

### Required Columns:
- **Date** - Workout date (e.g., `2025-01-15`)
- **Exercise** - Exercise name (e.g., `Deadlift`, `Bench Press`)

### Set Data (one of these formats):

**Option A: Separate columns for each set**
- `Reps1`, `Weight1` - First set
- `Reps2`, `Weight2` - Second set
- `Reps3`, `Weight3` - Third set
- etc.

**Option B: Combined Set columns**
- `Set1` - Weight for first set (e.g., `135`)
- `Reps1` - Reps for first set (e.g., `10`)
- etc.

### Example Excel Format:

| Date       | Exercise    | Reps1 | Weight1 | Reps2 | Weight2 | Reps3 | Weight3 |
|------------|-------------|-------|---------|-------|---------|-------|---------|
| 2025-01-15 | Deadlift    | 15    | bar+10  | 12    | 135     | 10    | 185     |
| 2025-01-15 | Bench Press | 15    | 95      | 12    | 115     | 10    | 135     |
| 2025-01-16 | Squat       | 12    | 135     | 10    | 185     | 8     | 225     |

---

## Step 2: Place Your Excel File

Copy your Excel file to the gym-logger project directory:

```bash
cp ~/path/to/your/workout-history.xlsx /Users/harryliu/CascadeProjects/gym-logger/
```

---

## Step 3: Create an Account

Before importing, you need to have a user account:

1. Run the app: `npm start`
2. Press `w` to open in browser
3. Sign up with your email and password
4. Note your email address (you'll need it for the import)

---

## Step 4: Run the Import Script

```bash
cd /Users/harryliu/CascadeProjects/gym-logger

npx ts-node scripts/import-workout-data.ts workout-history.xlsx your-email@example.com
```

### Example:

```bash
npx ts-node scripts/import-workout-data.ts workout-history.xlsx john@gmail.com
```

---

## What the Script Does

1. ✅ Reads your Excel file
2. ✅ Groups exercises by date
3. ✅ Creates workout sessions for each date
4. ✅ Finds or creates exercises (handles alternate names)
5. ✅ Parses weight notation:
   - `bar + 10` → 55 lb (45 lb bar + 10 lb)
   - `bar` → 45 lb
   - `135` → 135 lb
6. ✅ Parses rep ranges:
   - `10-15` → 12 (midpoint)
   - `10` → 10
7. ✅ Calculates total reps and volume per exercise
8. ✅ Inserts all data into Supabase

---

## Expected Output

```
📂 Reading Excel file: workout-history.xlsx
📊 Found 150 rows in Excel file
✅ Found user: john@gmail.com
📅 Found 50 unique workout dates

📆 Processing: 2025-01-15
  ✅ Created session
  ✅ Deadlift: 3 sets, 37 reps, 4785 lb volume
  ✅ Bench Press: 3 sets, 37 reps, 3845 lb volume

📆 Processing: 2025-01-16
  ✅ Created session
  ✅ Squat: 3 sets, 30 reps, 5850 lb volume

🎉 Import complete!
  ✅ Imported: 50 sessions
  ⏭️  Skipped: 0 sessions

✅ Done!
```

---

## Troubleshooting

### Error: "File not found"
- Make sure the Excel file path is correct
- Use absolute path or place file in project directory

### Error: "User not found"
- Create an account in the app first
- Check that the email address matches exactly

### Error: "Supabase credentials not found"
- Make sure `.env` file exists with Supabase credentials
- Check that `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set

### Exercise Not Found
- The script will automatically create new exercises
- You can edit exercise names later in Supabase dashboard
- Alternate names are supported (e.g., "DL" → "Deadlift")

### Duplicate Sessions
- The script skips sessions that already exist for a given date
- Safe to run multiple times

---

## After Import

1. **Verify Data**: Open Supabase dashboard → Table Editor
   - Check `workout_sessions` table
   - Check `session_exercises` table
   - Check `exercises` table

2. **View in App**:
   - Log in to the app
   - Navigate to History view
   - You should see all your imported workouts!

3. **Edit if Needed**:
   - You can edit exercises, sets, and notes in the app
   - Or directly in Supabase dashboard

---

## Excel Column Name Variations

The script handles these column name variations:

- `Date` or `date`
- `Exercise` or `exercise`
- `Set1`, `Set2` or `set1`, `set2`
- `Reps1`, `Reps2` or `reps1`, `reps2`
- `Weight1`, `Weight2` or `weight1`, `weight2`

**Case insensitive!**

---

## Need Help?

If you encounter issues:

1. Check the Excel file format
2. Verify Supabase credentials
3. Check console output for specific errors
4. Manually verify user exists in Supabase dashboard

---

**Ready to import your workout history?** 🏋️

```bash
npx ts-node scripts/import-workout-data.ts <your-excel-file.xlsx> <your-email@example.com>
```
