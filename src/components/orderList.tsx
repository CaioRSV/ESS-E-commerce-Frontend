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
const OrderList = () => {
    const {userData, setUserData} = useUserDataContext();

    const [fetched, setFetched] = useState<string>("");

    const axiosAuth = useAxiosAuth();

    const getOrderList = async () => {
        const data = await axiosAuth.get(`/api/user/orders?targetEmail=${userData.email}`)

        console.log('-')
        console.log(data.data);
        if(data.status==200){
            setFetched(JSON.stringify(data.data));
        }
    }

  return (
    <>
    <Dialog>
        <DialogTrigger onClick={()=>{getOrderList()}}>
            <Button>OrderList</Button>
        </DialogTrigger>
        <DialogContent className={``}>
        <div className={`size-[460px]`}>
            <p style={{ wordBreak: 'break-word' }} >{fetched}</p>  
        </div>
        </DialogContent>
    </Dialog>
  </>
  )
}

export default OrderList