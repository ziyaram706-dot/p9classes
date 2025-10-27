'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

export function AuthProvider({ children, session }: { children: React.ReactNode, session?: Session | null }) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}
