# Public Profiles Feature Setup

## 1. Run Database Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `gym-logger` project
3. Go to **SQL Editor**
4. Click **New query**
5. Copy and paste the contents of `add-public-profiles.sql`
6. Click **Run** or press `Cmd/Ctrl + Enter`

## 2. Verify Migration

After running the migration, verify that:
- Your profile (harry.liu.ca@gmail.com) is marked as public
- The `is_public` and `public_username` columns exist

You can check with this query:
```sql
SELECT id, email, display_name, public_username, is_public
FROM public.profiles
WHERE email = 'harry.liu.ca@gmail.com';
```

## 3. Test Locally

1. Refresh http://localhost:8081
2. You should see a new "Browse Public Profiles" button on the dashboard
3. Click it to see your public profile listed
4. Click "View Workouts" to see all your workout data

## Features

### For New Users:
- When they sign up, they can browse public profiles
- They can see your workouts as inspiration
- They can see stats from any user who has marked their profile as public

### For Existing Users:
- Toggle "Make Profile Public" in settings (coming soon)
- Set a custom public username
- Share your progress with others

## Benefits

1. **New User Experience**: No empty state - they can see real workout data immediately
2. **Motivation**: Users can see what others are achieving
3. **Community**: Creates a sense of community and friendly competition
4. **Inspiration**: New users can see exercise variety and progressions

## Privacy

- **Opt-in only**: Profiles are private by default
- **Control**: Users can turn public sharing on/off anytime
- **No personal data**: Only workout stats are visible (email is shown but can be customized with public_username)
