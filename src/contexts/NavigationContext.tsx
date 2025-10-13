import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Screen = 'dashboard' | 'history' | 'newWorkout' | 'editWorkout' | 'sessionDetail' | 'stats' | 'browsePublicProfiles' | 'publicProfile';

interface NavigationContextType {
  currentScreen: Screen;
  navigate: (screen: Screen, params?: any) => void;
  params: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [params, setParams] = useState<any>(null);

  const navigate = (screen: Screen, screenParams?: any) => {
    setCurrentScreen(screen);
    setParams(screenParams || null);
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, params }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
