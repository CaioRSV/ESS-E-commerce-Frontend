'use client';

import React, { ReactNode, useState, createContext, useContext } from 'react'

interface LoadingBool { // Definindo corpo do contexto, apenas com a variável loading
    loading : boolean,
    setLoading : React.Dispatch<React.SetStateAction<boolean>>
}

const startState : LoadingBool = { // Instância inicial com loading em valor falso
    loading: false,
    setLoading: () => {}
};

const loadingContext = createContext<LoadingBool>(startState); // Setando contexto com valor inicial

export const useLoadingContext = () => {
    const context = useContext(loadingContext);
    return context
};

interface ProviderProps {
    children: ReactNode;
}


export const LoadingProvider: React.FC<ProviderProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    return (
        <loadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </loadingContext.Provider>
    );
};