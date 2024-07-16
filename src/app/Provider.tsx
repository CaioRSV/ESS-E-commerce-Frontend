'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react'

import { ProviderUserData } from './contexts/UserData';

interface Props{
    children: ReactNode;
}

function Provider({ children } : Props) {
  return (
    <ProviderUserData>
    <SessionProvider>{children}</SessionProvider>
    </ProviderUserData>
  )
}

export default Provider