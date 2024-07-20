"use client";
import React from 'react'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Media {
    id: number
    url: string
}

interface Category {
    id: number,
    name: string
    mediaId: number
    createdAt: string
    deletedAt?: any
    updatedAt?: any
    Media?: Media
}

interface ProductMedia {
    id: number
    productId: number
    mediaId: number
    media: Media
}

interface Product {
    id: number
    name: string
    description: string
    price: number
    stock: number
    createdAt: string
    updatedAt?: string
    deletedAt?: any
    categoryId: number
    category?: Category
    productMedia?: ProductMedia[]
}
interface ProductDataValues {
    productData : Product[],
    setProductData : React.Dispatch<React.SetStateAction<Product[]>>
}

const initValues : ProductDataValues = {
    productData : [], 
    setProductData : () => {}
};

const contextProductData = createContext<ProductDataValues>(initValues);

export const useProductDataContext = () => {
    const context = useContext(contextProductData);
    return context
};

interface ProviderProps {
    children: ReactNode;
}

export const ProviderProductData: React.FC<ProviderProps> = ({ children }) => {
    const [productData, setProductData] = useState<Product[]>([]);
    return (
        <contextProductData.Provider value={{ productData, setProductData }}>
            {children}
        </contextProductData.Provider>
    );
};