'use client';
import React, {useState, useEffect} from 'react'

import { useUserDataContext } from '@/app/contexts/UserData';

import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

import { Button } from './ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

interface Order{
    id: number
    code: string
    price: number
    userId: number
    estimatedDelivery?: string
    status: string
    develiryAddressld?:string
    createdAt?: string
    updatedAt?: string
}

const OrderList = () => {
    const {userData, setUserData} = useUserDataContext();

    const [fetched, setFetched] = useState<Order[]>();

    const axiosAuth = useAxiosAuth();

    const getOrderList = async () => {
        const data = await axiosAuth.get(`/api/user/orders?targetEmail=${userData.email}`)

        console.log('-')
        console.log(data.data);
        if(data.status==200){
            setFetched(data.data);
        }
    }

  return (
    <>
    <Dialog>
        <DialogTrigger onClick={()=>{getOrderList()}}>
            <Button className='w-full'>Lista de pedidos</Button>
        </DialogTrigger>
        <DialogContent className={``}>
        <div className={`size-[460px] overflow-y-scroll p-3`}>
            {
                fetched && fetched.length>0
                    ?
                    fetched.map(item => (
                        <>
                        <div className={`w-full flex justify-center items-center bg-projGray rounded-lg p-4`}>
                            <div>
                                <p>{`Order ID: `+item.id}</p>
                                <p>{`Code: `+item.code}</p>
                                <p>{`Price: `+item.price}</p>
                                <p>{`User ID: `+item.userId}</p>
                                <p>{`Delivery Date: `+item.estimatedDelivery?item.estimatedDelivery:"unknown"}</p>
                                <p>{`Status: `+item.status}</p>
                            </div>
                        </div>
                        </>
                    ))
                    :
                    <div className={`w-full flex justify-center items-center bg-projGray rounded-lg p-4`}>
                            <p>Nenhum pedido encontrado</p>
                    </div>
            }
        </div>
        </DialogContent>
    </Dialog>
  </>
  )
}

export default OrderList