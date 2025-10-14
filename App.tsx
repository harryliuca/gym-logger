import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { NavigationProvider } from './src/contexts/NavigationContext';
import { AppExperienceProvider, useAppExperience } from './src/contexts/AppExperienceContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import HomeScreen from './src/screens/home/HomeScreen';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { user, loading } = useAuth();
  const {
    guestViewingUserId,
    forceAuth,
    clearForceAuth,
    exitGuestView,
  } = useAppExperience();

  React.useEffect(() => {
    if (user) {
      exitGuestView();
      clearForceAuth();

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('invite')) {
          params.delete('invite');
          const query = params.toString();
          const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
  }, [user, clearForceAuth, exitGuestView]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <HomeScreen />;
  }

  if (forceAuth) {
    return <LoginScreen />;
  }

  if (guestViewingUserId) {
    return <HomeScreen />;
  }

  return <LoginScreen />;
}

export default function App() {
  const initialGuestId = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('invite');
    }
    return null;
  }, []);

  const [guestViewingUserId, setGuestViewingUserId] = React.useState<string | null>(initialGuestId);
  const [forceAuth, setForceAuth] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const invitedUserId = params.get('invite');
    if (invitedUserId) {
      setGuestViewingUserId(invitedUserId);
      setForceAuth(false);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const invitedUserId = params.get('invite');
      setGuestViewingUserId(invitedUserId);
      if (!invitedUserId) {
        setForceAuth(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const enterGuestView = React.useCallback((userId: string) => {
    setGuestViewingUserId(userId);
    setForceAuth(false);
  }, []);

  const exitGuestView = React.useCallback(() => {
    setGuestViewingUserId(null);
  }, []);

  const clearForceAuth = React.useCallback(() => {
    setForceAuth(false);
  }, []);

  const requireAuth = React.useCallback(() => {
    setForceAuth(true);
    setGuestViewingUserId(null);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('invite')) {
        params.delete('invite');
        const query = params.toString();
        const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const appExperienceValue = React.useMemo(
    () => ({
      guestViewingUserId,
      enterGuestView,
      exitGuestView,
      requireAuth,
      forceAuth,
      clearForceAuth,
    }),
    [guestViewingUserId, enterGuestView, exitGuestView, requireAuth, forceAuth, clearForceAuth],
  );

  const navigationKey = guestViewingUserId ? `guest-${guestViewingUserId}` : 'authed';

  const initialNavigationParams = React.useMemo(() => {
    if (guestViewingUserId) {
      return { screen: 'dashboard' as const, params: { userId: guestViewingUserId } };
    }
    return { screen: 'dashboard' as const, params: null };
  }, [guestViewingUserId]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <AppExperienceProvider value={appExperienceValue}>
          <AuthProvider>
            <NavigationProvider
              key={navigationKey}
              initialScreen={initialNavigationParams.screen}
              initialParams={initialNavigationParams.params}
            >
              <StatusBar style="auto" />
              <AppContent />
            </NavigationProvider>
          </AuthProvider>
        </AppExperienceProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
