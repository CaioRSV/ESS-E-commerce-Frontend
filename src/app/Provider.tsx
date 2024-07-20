'use client';

import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react'

import { ProviderUserData } from './contexts/UserData';
import { ProviderProductData } from './contexts/ProductData';

interface Props{
    children: ReactNode;
}

function Provider({ children } : Props) {
  return (
    <ProviderUserData>
    <ProviderProductData>
    <SessionProvider>{children}</SessionProvider>
    </ProviderProductData>
    </ProviderUserData>
  )
}

export default Provider