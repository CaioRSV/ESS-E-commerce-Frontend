'use client';
import React from 'react'
import { useLoadingContext } from '@/contexts/LoadingProvider';

const LoadingView = () => {
    const {loading, setLoading} = useLoadingContext();
  if (!loading){
    return(
    <div className={`z-20 absolute w-full h-full bg-black opacity-50 overscroll-none`}>
        <p>DSAOIDSAOIODA</p>
    </div>
    );
  }
  else{
    <></>
  }
}

export default LoadingView