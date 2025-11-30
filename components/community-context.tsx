import React, { createContext, useContext, useMemo, useState } from 'react';

export type Profile = {
  name: string;
  gender: string;
  age: string;
  occupation: string;
  experience: string;
  bio: string;
};

type CommunityContextValue = {
  profile: Profile | null;
  updateProfile: (profile: Profile) => void;
};

const CommunityContext = createContext<CommunityContextValue | undefined>(undefined);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  const value = useMemo(
    () => ({
      profile,
      updateProfile: setProfile,
    }),
    [profile],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity() {
  const context = useContext(CommunityContext);

  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }

  return context;
}
