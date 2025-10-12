# Workout Templates Feature Setup

## Overview

This feature allows users to:
1. Choose from pre-defined workout splits (Push/Pull/Legs, Upper/Lower, Full Body)
2. Use your personal Day 1/2/3 templates
3. Quick-start workouts with suggested exercises and set/rep ranges

## Database Migration - IMPORTANT ORDER

**You must run these SQL files IN ORDER in the Supabase SQL Editor:**

### Step 1: Ensure exercises exist
If your exercises table is empty, run `import-final.sql` first to populate all exercises from your historical workout data.

### Step 2: Create template tables
Run `create-workout-templates.sql` - This creates:
- `workout_templates` table - stores template definitions
- `template_exercises` table - links exercises to templates with suggested sets/reps
- Empty templates for Harry's Day 1/2/3
- Pre-populated templates for common splits (PPL, Upper/Lower, Full Body)

### Step 3: Populate Harry's templates
Run `populate-harry-templates.sql` - This populates your Day 1/2/3 templates with your actual exercises based on workout history analysis.

## Templates Included

### Harry's Custom Split (based on actual workout history)
- **Harry's Day 1** - Chest Press, Adductor Machine, Shoulder Raise, Lat Pulldown, Push Plate Machine
- **Harry's Day 2** - Deadlift, Chest Press, Leg Press/Extension, Shoulder Press, Pull-up, Leg Curl
- **Harry's Day 3** - Squat, Leg Curl, Leg Extension

### Push/Pull/Legs (PPL) - Most Popular
- **Push Day**: Bench Press, Overhead Press, Dips, Tricep Extensions
- **Pull Day**: Deadlift, Barbell Row, Pull-ups, Lat Pulldown, Bicep Curls
- **Legs Day**: Squat, Leg Press, Leg Curl, Calf Raises

### Upper/Lower Split
- **Upper Body**: All upper body exercises
- **Lower Body**: Squat, Deadlift, Leg Press, Leg Curl, Calf Raises

### Full Body
- **Full Body**: Squat, Bench Press, Barbell Row, Overhead Press, Deadlift

## How It Works

When starting a new workout:
1. User selects a template from the list
2. Form pre-loads with all exercises from that template
3. Suggested sets and rep ranges are shown (e.g., "3 sets of 8-12 reps")
4. User can adjust weights, reps, add/remove sets
5. Save workout as normal

## Benefits

- **Faster workout logging**: No need to remember exercise order
- **Consistency**: Follow proven workout programs
- **Beginner-friendly**: New users get structured programs
- **Flexible**: Can still customize on-the-fly

## Next Steps

After running the SQL migration, the UI will need to be updated to show template selection in the New Workout screen.
