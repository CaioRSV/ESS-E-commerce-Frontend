"use client";
import React from 'react'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface AuthMe {
    sub?: string;
    id?: string;
    name?: string;
    email?: string;
    refreshToken?: string;
    recoveryPasswordToken?: string | null;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    mediaId?: number;
    role?: string;
    Media?: {
      id?: number;
      url?: string;
    };
  }

interface UserDataValues {
    userData : AuthMe,
    setUserData : React.Dispatch<React.SetStateAction<AuthMe>>
}

const initValues : UserDataValues = { //placeholder stuff
    userData : {}, 
    setUserData : () => {}
};

const contextUserData = createContext<UserDataValues>(initValues); //placeholder stuff

export const useUserDataContext = () => {
    const context = useContext(contextUserData);
    return context
};

interface ProviderProps {
    children: ReactNode;
}


export const ProviderUserData: React.FC<ProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<AuthMe>({});
    return (
        <contextUserData.Provider value={{ userData, setUserData }}>
            {children}
        </contextUserData.Provider>
    );
};