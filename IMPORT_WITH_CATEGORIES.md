# Import Workout Data with Categories - Final Steps

## Issue Found
Your Excel data has columns named `Reps_S1`, `Reps_S2`, `Reps_S3` (not `Reps1`, `Reps2`), which caused the initial import to skip all set data. Additionally, the workout categories (Push, Pull, Legs, etc.) were not being stored.

## What Was Fixed
1. ✅ Updated `scripts/excel-to-sql.ts` to read correct column names (`Reps_S1`, `Weight_S1`, etc.)
2. ✅ Added category extraction from Excel to store workout split (Push/Pull/Legs)
3. ✅ Updated database types to include `category` field
4. ✅ Updated UI to display categories as chips on workout cards

## Files to Import (in order)

### 1. Add Category Column to Database
**File:** `add-category-column.sql`

```sql
-- Run this first in Supabase SQL Editor
ALTER TABLE public.workout_sessions
ADD COLUMN IF NOT EXISTS category TEXT;
```

### 2. Import Workout Data with Categories
**File:** `import-with-categories.sql` (1,133 lines, 46 KB)

This file contains:
- 22 workout sessions with dates and categories
- 42 exercises with actual sets, reps, and weights
- Calculated total_reps and total_volume for each exercise

## Steps to Execute

1. **Open Supabase Dashboard** → SQL Editor

2. **Run Step 1** - Add category column:
   ```
   Copy contents of: add-category-column.sql
   → Paste and run in SQL Editor
   ```

3. **Run Step 2** - Import all workout data:
   ```
   Copy contents of: import-with-categories.sql
   → Paste and run in SQL Editor
   ```

4. **Refresh your app** at http://localhost:8081

## What You'll See After Import

### Dashboard Screen:
- Total workout count: 22 sessions
- Total volume: Calculated from all your lifts
- Last workout date
- Recent 3 sessions with exercise details

### History Screen:
- All 22 workout sessions grouped by month
- Each session card shows:
  - **Date** (e.g., "Wednesday, June 3, 2025")
  - **Category chip** (e.g., "Legs, Push" or "Pull")
  - **Exercise count** (exercises with rep data)
  - **Total sets** across all exercises
  - **Total volume** in lb
  - **Exercise list** with sets × reps for each

## Example of What Got Imported

### Session: June 18, 2025 (Push)
- **Tricep Extension**: 1 set × 20 reps @ 27.5 lb = 550 lb volume
- **Lunge (Bodyweight)**: 1 set × 20 reps @ 0 lb
- **Shoulder Raise (Dumbbell)**: 2 sets (15 reps @ 10 lb, 20 reps @ 10 lb) = 350 lb volume

## Data Coverage

- **Total rows from Excel**: 61
- **Rows with rep data**: 42 (69%)
- **Rows without reps**: 19 (31% - "Weight only" entries)
- **Unique workout dates**: 22
- **Categories found**: Legs, Pull, Push, Rest, and combinations

## Notes

- Sessions marked as "Rest" don't get a category displayed
- Some early workouts (June 3-5) have "Weight only" notes with no rep data
- These will show exercises but with 0 sets/reps
- Starting from June 18, most workouts have complete set data

---

**Ready to import?** Run the two SQL files in order and refresh your app!
