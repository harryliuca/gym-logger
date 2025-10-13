import Constants from 'expo-constants';

export const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
// Note: OPENAI_API_KEY should NEVER be exposed to frontend
// It's only used in Netlify functions (backend)

// App configuration
export const APP_CONFIG = {
  defaultWeightUnit: 'lb' as 'lb' | 'kg',
  defaultSetCount: 3,
  barWeight: 45, // Standard Olympic barbell weight in lbs
  voiceLanguage: 'en-US',
} as const;
