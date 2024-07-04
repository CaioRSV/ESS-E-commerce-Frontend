'use client';

import { motion } from "framer-motion"

import React from 'react'

export default function Transition({children} : {children: React.ReactNode}){
  return (
    <motion.div
      initial={{y: 10, opacity: 0.5}}
      animate={{y: 0, opacity: 1}}
      transition={{ease: 'easeInOut', duration: 0.55}}
    >
        {children}
    </motion.div>
  )
}