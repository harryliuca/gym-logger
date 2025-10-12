# Gym Logger Setup Checklist

## 1. Supabase Setup

### Create Project
- [ ] Go to https://supabase.com
- [ ] Create new project
- [ ] Note down project URL and anon key

### Run Database Migration
- [ ] Open Supabase SQL Editor
- [ ] Copy contents of `supabase-migration.sql`
- [ ] Run the SQL script
- [ ] Verify tables created: profiles, exercises, workout_sessions, session_exercises, user_exercise_stats

### Enable Authentication
- [ ] Go to Authentication → Providers
- [ ] Enable Email provider
- [ ] Configure email templates (optional)
- [ ] Disable email confirmations for testing (optional)

### Test RLS Policies
- [ ] Create a test user via Supabase Dashboard
- [ ] Verify profile auto-created in profiles table
- [ ] Test that user can only see their own data

## 2. OpenAI Setup

- [ ] Go to https://platform.openai.com
- [ ] Create API key
- [ ] Add billing information (Whisper API is ~$0.006/minute)
- [ ] Note down API key

## 3. Local Environment Setup

### Install Dependencies
```bash
cd gym-logger
npm install
```

### Configure Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Add Supabase URL
- [ ] Add Supabase anon key
- [ ] Add OpenAI API key

### Test Run
```bash
npm start
# Press 'w' for web browser
```

## 4. Import Existing Workout Data

- [ ] Prepare Excel file with workout history
- [ ] Create import script (see `import-workout-data.ts`)
- [ ] Run import script
- [ ] Verify data in Supabase dashboard

## 5. Testing

### Manual Testing
- [ ] Can sign up with email/password
- [ ] Can log in
- [ ] Can view dashboard
- [ ] Can create workout session
- [ ] Can add exercises manually
- [ ] Can view last 3 sessions
- [ ] Can view full history

### Voice Input Testing
- [ ] Can record voice
- [ ] Voice transcribed correctly
- [ ] Exercises parsed correctly
- [ ] "bar + 10" → 55 lb conversion works
- [ ] Can confirm and submit voice entries

### Automated Tests
```bash
npm test
```

## 6. Production Deployment (Future)

- [ ] Build web app: `npx expo export --platform web`
- [ ] Deploy to Vercel/Netlify
- [ ] Configure production environment variables
- [ ] Test production build
- [ ] Set up Supabase production project (separate from dev)

## Common Issues & Solutions

### Issue: "Supabase URL not found"
**Solution**: Make sure `.env` file exists and `EXPO_PUBLIC_` prefix is used

### Issue: "RLS policy blocking insert"
**Solution**: Check that user is authenticated and profile exists

### Issue: "Voice input not working"
**Solution**: Check OpenAI API key is valid and has billing enabled

### Issue: "Exercise name not matching"
**Solution**: Add alternate names to exercises table

## Next Steps After Setup

1. Import your existing workout data
2. Test voice input with real workout descriptions
3. Customize exercise list with your preferred exercises
4. Adjust default settings (weight unit, set count)
5. Start logging workouts!

---

**Last Updated**: 2025-10-09
