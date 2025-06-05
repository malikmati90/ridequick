'use client';

import { Session } from 'next-auth';
import { createContext, useContext } from 'react';

const SessionContext = createContext<Session | null>(null);

interface SessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}