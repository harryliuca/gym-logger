# Gym Logger 🏋️

A voice-first workout tracking web app built with React Native Web, featuring effortless exercise logging through natural speech input powered by OpenAI.

**Status**: Initial Setup - Project Structure Created ✅

---

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- OpenAI API key

### Installation

```bash
cd gym-logger
npm install
```

### Configuration

Create `.env` file in root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

1. Create Supabase project
2. Run `/supabase-migration.sql` in SQL editor
3. Enable email auth in Supabase dashboard

### Run

```bash
npm start
# Press 'w' for web browser
```

---

## Features

### ✅ Planned (MVP)
- Voice input for workout logging (OpenAI Whisper + GPT-4)
- Quick manual form entry
- Smart exercise name matching
- Auto-calculation: "bar + 10" → 55 lb
- View last 3 workout sessions
- Full workout history
- Email/password authentication
- Settings (weight units, defaults)

### 🔜 Future
- Excel export
- Progress analytics
- Workout templates
- Exercise category insights

---

## Tech Stack

- **Frontend**: React Native + Expo (Web)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Language**: TypeScript
- **UI**: React Native Paper
- **State**: React Query (@tanstack/react-query)
- **Voice**: OpenAI Whisper API + GPT-4
- **Testing**: Jest + React Native Testing Library

---

## Project Structure

```
gym-logger/
├── src/
│   ├── screens/         # UI screens
│   │   ├── auth/        # Login/signup
│   │   ├── home/        # Dashboard
│   │   ├── workout/     # Logging screens
│   │   └── history/     # History views
│   ├── services/        # API & business logic
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   └── constants/       # Config
├── supabase-migration.sql   # Database schema
├── package.json
└── README.md
```

---

## Database Schema

### Tables

1. **profiles** - User profiles and settings
2. **exercises** - Master exercise list with alternate names
3. **workout_sessions** - Daily workout sessions
4. **session_exercises** - Individual exercises per session
5. **user_exercise_stats** - Quick stats for comparison

### Key Features

- Row Level Security (RLS) enabled
- Automatic profile creation on signup
- JSONB storage for flexible set data
- Generated columns for totals
- Trigger-based timestamp updates

---

## Voice Input Flow

1. User taps mic button
2. Records audio → sends to OpenAI Whisper API
3. Whisper transcribes to text
4. GPT-4 parses into structured JSON:
   ```json
   {
     "exercises": [
       {
         "exerciseName": "Deadlift",
         "sets": [
           {"reps": 15, "weight": 55, "unit": "lb"}
         ]
       }
     ]
   }
   ```
5. Display parsed data for user confirmation
6. Submit to Supabase

---

## Development Workflow

### 1. Start Development Server
```bash
npm start
# Press 'w' for web
```

### 2. Run Tests
```bash
npm test
```

### 3. Build for Production
```bash
npx expo export --platform web
```

---

## Next Steps

### Immediate Priority
1. ✅ Project structure created
2. ✅ Database schema designed
3. ⏳ Authentication setup
4. ⏳ Import existing workout data
5. ⏳ Voice input implementation
6. ⏳ Core UI components

### Short Term
1. Manual form entry
2. Session review & confirmation
3. Last 3 sessions display
4. Full history view

### Long Term
1. Analytics dashboard
2. Export functionality
3. Workout templates
4. Mobile app optimization

---

## Similar Projects

This project uses the same tech stack as **poker-tutor**:
- React Native + Expo
- Supabase backend
- TypeScript
- React Query for state management
- Jest for testing

---

## Contributing

This is a personal project for workout tracking.

---

## License

Private - All Rights Reserved

---

**Last Updated**: 2025-10-09
**Version**: 0.1.0 (Initial Setup)
