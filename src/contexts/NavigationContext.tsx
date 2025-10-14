import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Screen = 'dashboard' | 'history' | 'newWorkout' | 'editWorkout' | 'sessionDetail' | 'stats' | 'browsePublicProfiles' | 'publicProfile';

interface NavigationContextType {
  currentScreen: Screen;
  navigate: (screen: Screen, params?: any) => void;
  params: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialScreen?: Screen;
  initialParams?: any;
}

export function NavigationProvider({
  children,
  initialScreen = 'dashboard',
  initialParams = null,
}: NavigationProviderProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  const [params, setParams] = useState<any>(initialParams);

  useEffect(() => {
    setCurrentScreen(initialScreen);
  }, [initialScreen]);

  useEffect(() => {
    setParams(initialParams || null);
  }, [initialParams]);

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
