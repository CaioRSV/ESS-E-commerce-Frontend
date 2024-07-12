import React from 'react'

import { FaShoppingCart, FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className={`w-full h-fit p-2 sticky top-0 z-50 bg-white`}>
        <div className={`bg-white border-2 rounded-md h-12 sticky flex ml-[30px] mr-[30px] gap-3`}>
            <div className={`p-4 flex justify-center items-center`}>
              <p className={`text-abel text-[20px]`}>SAPATOS.COM</p>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <div className={`text-abeezee text-[14px]`}>CATEGORIAS</div>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <div className={`text-abeezee text-[14px] text-projRed`}>OFERTAS</div>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <div className={`text-abeezee text-[14px]`}>MARCAS</div>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer flex-1`}>
              <div className={`text-abeezee text-[14px] p-2 rounded-full bg-projGray flex-1`}>Buscar</div>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <FaUser size={20}/>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <FaShoppingCart size={20}/>
            </div>

        </div>
    </div>
  )
}

export default Navbar