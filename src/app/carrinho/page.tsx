'use client' // Componente Cliente -> Manipulação de variáveis de estado

import { useState, useEffect } from 'react'; 

export default function Carrinho() {
  return (
    <div className={`w-screen h-screen`}>
      <div className="min-h-full w-full hide-scrollbar bg-background p-4">
        
        <div className={`rounded-md min-h-full w-full bg-green-800 border-2`}>
          <div className={`w-full bg-green-100`}>
            {`<-`}
          </div>
            
          <div className={`md:flex w-full h-full`}>
              <div className={`w-full h-full bg-red-800`}>
                a
              </div>

              <div className={`w-full bg-blue-800`}>
                b
              </div>

          </div>


        </div>
      </div>
    </div>
  );
}
