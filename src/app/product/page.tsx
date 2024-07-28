"use client";

import React from 'react'
import ProductPage from '@/app/admin/product/page'
import HomePage from '@/app/product/productCostumer'
import { useUserDataContext } from '../contexts/UserData'

const Page = () => {
  const { userData, setUserData } = useUserDataContext()
    console.log(userData?.role);  
return (
    <div>
            {userData?.role === 'ADMIN' ? (
                <ProductPage />
            ) : (
                <HomePage />
            ) }
        </div>
    )

}
export default Page

