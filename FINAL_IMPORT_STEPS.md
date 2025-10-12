# Final Import Steps - Clean Data with Day Labels

## Problem
- Duplicate records in database from multiple imports
- "Day" column (Day 1, Day 2, Day 3) was not being used for category display

## Solution
Updated import script to use the "Day" column instead of "Category" for the workout split display.

## Import Steps (3 SQL Files)

### Step 1: Add Category Column (if not already done)
**File:** `add-category-column.sql`

Run this in Supabase SQL Editor:
```sql
ALTER TABLE public.workout_sessions
ADD COLUMN IF NOT EXISTS category TEXT;
```

### Step 2: Clean Up Duplicates
**File:** `cleanup-duplicates.sql`

This will delete all your existing workout sessions and exercises to start fresh:
```sql
-- Deletes all session_exercises and workout_sessions for harry.liu.ca@gmail.com
-- Safe to run - will be re-imported with clean data
```

### Step 3: Import Final Clean Data
**File:** `import-final.sql` (1,133 lines)

This contains:
- 22 workout sessions
- Day labels where available (Day 1, Day 2, Day 3)
- 42 exercises with complete set data
- Calculated volumes and reps

## What You'll See

### Sessions WITH Day Labels (12 sessions):
- **June 17** → "Day 2"
- **June 23** → "Day 1"
- **June 24** → "Day 2"
- **June 25** → "Day 3"
- **July 14** → "Day 1"
- **July 15** → "Day 2"
- **July 16** → "Day 3"
- **July 21** → "Day 1"
- **July 22** → "Day 2"
- **July 23** → "Day 3"
- **August 26** → "Day 1"
- **August 27** → "Day 2"
- **September 2** → "Day 1"
- **September 3** → "Day 2"

### Sessions WITHOUT Day Labels (10 sessions):
- June 3, 4, 5, 9, 10, 15, 16, 18 - No Day data in Excel

## Execution Order

```bash
# In Supabase SQL Editor:

1. Run: add-category-column.sql
   ✅ Adds category column

2. Run: cleanup-duplicates.sql
   ✅ Removes all duplicate data

3. Run: import-final.sql
   ✅ Imports clean data with Day labels
```

## After Import

Refresh your app at http://localhost:8081 and you'll see:

- ✅ No duplicates
- ✅ "Day 1", "Day 2", "Day 3" chips on workout cards
- ✅ Exercise counts showing correctly
- ✅ Total volume calculated properly
- ✅ All 42 exercises with set data

## Data Summary

| Date Range | Sessions | With Day Labels | Without Day Labels |
|------------|----------|-----------------|-------------------|
| June 2025  | 10       | 4               | 6                 |
| July 2025  | 8        | 6               | 2                 |
| Aug 2025   | 2        | 2               | 0                 |
| Sept 2025  | 2        | 2               | 0                 |
| **Total**  | **22**   | **14**          | **8**             |

---

**Ready?** Run the 3 SQL files in order!
