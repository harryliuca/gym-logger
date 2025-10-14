import React, { createContext, useContext } from 'react';

export interface AppExperienceContextValue {
  guestViewingUserId: string | null;
  enterGuestView: (userId: string) => void;
  exitGuestView: () => void;
  requireAuth: () => void;
  forceAuth: boolean;
  clearForceAuth: () => void;
}

const defaultValue: AppExperienceContextValue = {
  guestViewingUserId: null,
  enterGuestView: () => {},
  exitGuestView: () => {},
  requireAuth: () => {},
  forceAuth: false,
  clearForceAuth: () => {},
};

const AppExperienceContext = createContext<AppExperienceContextValue | undefined>(undefined);

export function AppExperienceProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AppExperienceContextValue;
}) {
  return (
    <AppExperienceContext.Provider value={value}>
      {children}
    </AppExperienceContext.Provider>
  );
}

export function useAppExperience() {
  const context = useContext(AppExperienceContext);
  return context ?? defaultValue;
}

export { AppExperienceContext };
