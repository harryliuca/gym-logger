import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/auth';
import { profileService } from '../services/workouts';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Check active session on mount
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.warn('Auth session lookup failed:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      });

    // Listen for auth changes
    let authListener: ReturnType<typeof authService.onAuthStateChange> | undefined;
    try {
      authListener = authService.onAuthStateChange((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          setLoading(false);
        }
      });
    } catch (error) {
      console.warn('Auth state listener failed to initialise:', error);
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: authUser } = await authService.signIn(email, password);
    if (authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email || '',
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    const { user: authUser } = await authService.signUp(email, password);
    if (authUser) {
      setUser({
        id: authUser.id,
        email: authUser.email || '',
      });

      try {
        await profileService.togglePublicProfile(true);
      } catch (error) {
        console.warn('Failed to set profile public by default:', error);
      }
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
