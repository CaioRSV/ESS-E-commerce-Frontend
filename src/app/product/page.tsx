"use client";

import React from 'react'
import ProductPage from '@/app/product/productAdmin'
import HomePage from '@/app/product/productCostumer'
import { useUserDataContext } from '../contexts/UserData'

const Page = () => {
  const { userData, setUserData } = useUserDataContext()
    console.log(userData?.role);  
//     return (
//     <div>
//         {
//             userData?.role === 'ADMIN' ?
//              <ProductPage /> : <HomePage />
//         }
//     </div>
//   )
return (
    <div>
            {userData?.role === 'ADMIN' ? (
                <ProductPage />
            ) : userData?.role === 'CUSTOMER' ? (
                <HomePage />
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ border: '1px solid black', borderRadius: '10px', padding: '20px' }}>
                <h1><strong>Por favor, faça login</strong></h1>
                </div>
        </div>
            )}
        </div>
    )

}
export default Page

