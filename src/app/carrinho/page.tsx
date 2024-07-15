'use client' // Componente Cliente -> Manipulação de variáveis de estado


import { useSession } from "next-auth/react"

import { getServerSession } from "next-auth";


import { Input } from '@/components/ui/input';

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { IoMdArrowRoundForward } from "react-icons/io";


export default function Carrinho() {
  const {data:session, status} = useSession();

  // Caso não haja um sessão válida, redireciona para a Home
  if (!(status=="authenticated")){
    redirect("/");
  }
  //
  
  return (
    <div className={`w-screen h-screen`}>
      <div className="min-h-full w-full hide-scrollbar bg-background pb-4 pl-10 pr-10">
        
        <div className={`w-full h-[1px] bg-projGray overflow-hidden rounded-full`}/> 
        
        <div className={`flex gap-2 pt-5 pb-2`}>
          <Link href="/">
          <p className={`font-abeezee opacity-75`}>Home</p>
          </Link>
          <p className={`font-abeezee opacity-75`}>{`>`}</p>
          <p className={`font-abeezee ml-1`}>Carrinho</p> 

        </div>

        <p className={`font-abel text-[30px] pt-2 pb-2`}>Seu carrinho</p>

        <div className={`min-h-full w-full`}>         
          <div className={`md:flex w-full h-full`}>
              <div className={`w-full h-full mr-4`}>
                <div className={`w-full min-h-32 bg-white rounded-xl border border-projGray p-4`}>
                  
                  <div className={`w-full h-[145px] p-2 flex`}>
                    <img className={`rounded-md h-full bg-projGray`} src="https://images.vexels.com/content/156298/preview/rubber-shoes-silhouette-9c69af.png" />
                    <div className={`ml-3 h-full w-full relative overflow-hidden`}>
                      <p className={`font-abeezee text-[18px] italic`}>{`Nome`}</p>
                      <p className={`font-abeezee text-[12px]`}>{`Tamanho:`} <span className={`opacity-75`}>{`99`}</span> </p>
                      <p className={`font-abeezee text-[12px]`}>{`Cor:`} <span className={`opacity-75`}>{`seila`}</span> </p>

                      <div className={`w-full h-[63px] flex items-end`}>
                        <p className={`font-abeezee text-2xl italic flex-1`}>{`R$ 98,98`}</p>

                        <div className={`flex bg-projGray rounded-full w-40 pt-1 pb-1 justify-center items-center`}>
                          <p className={`cursor-pointer font-abeezee text-3xl flex-1 flex justify-center items-center rounded-full`}>-</p>
                          <p className={`font-abeezee text-md flex-1 flex justify-center items-center rounded-full italic`}>1</p>
                          <p className={`cursor-pointer font-abeezee text-3xl flex-1 flex justify-center items-center rounded-full`}>+</p>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className={`w-full p-2`}>
                    <div className={`w-full h-[1px] bg-projGray`}></div>
                  </div>


                  {/*  */}
                  {
                    [1,2,3].map(item => (
                      <>
                                          <div className={`w-full h-[145px] p-2 flex`}>
                    <img className={`rounded-md h-full bg-projGray`} src="https://images.vexels.com/content/156298/preview/rubber-shoes-silhouette-9c69af.png" />
                    <div className={`ml-3 h-full w-full relative`}>
                      <p className={`font-abeezee text-[18px] italic`}>{`Nome`}</p>
                      <p className={`font-abeezee text-[12px]`}>{`Tamanho:`} <span className={`opacity-75`}>{`99`}</span> </p>
                      <p className={`font-abeezee text-[12px]`}>{`Cor:`} <span className={`opacity-75`}>{`seila`}</span> </p>

                      <div className={`w-full h-[63px] flex items-end`}>
                        <p className={`font-abeezee text-2xl italic flex-1`}>{`R$ 98,98`}</p>

                        <div className={`flex bg-projGray rounded-full w-40 pt-1 pb-1 justify-center items-center`}>
                          <p className={`cursor-pointer font-abeezee text-3xl flex-1 flex justify-center items-center rounded-full`}>-</p>
                          <p className={`font-abeezee text-md flex-1 flex justify-center items-center rounded-full italic`}>1</p>
                          <p className={`cursor-pointer font-abeezee text-3xl flex-1 flex justify-center items-center rounded-full`}>+</p>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className={`w-full p-2`}>
                    <div className={`w-full h-[1px] bg-projGray`}></div>
                  </div>
                      </>
                    ))
                  }

                  {/*  */}

                </div>
              </div>

              <div className={`h-full md:min-w-[350px] md:w-[45%]`}>
                <div className={`w-full min-h-32 bg-white rounded-xl border border-projGray p-4`}>
                  <p className={`font-abeezee text-xl italic`}>Seu pedido</p>

                  <div className={`w-full flex relative pt-2`}>
                    <p className={`opacity-80`}>{`Subtotal`}</p>

                    <p className={`absolute right-0`}>{`R$ 0,00`}</p>
                  </div>

                  <div className={`w-full flex relative pt-2`}>
                    <p className={`opacity-80`}>{`Desconto (20%)`}</p>

                    <p className={`absolute right-0 text-projRed`}>{`-R$ 0,00`}</p>
                  </div>

                  <div className={`w-full flex relative pt-2`}>
                    <p className={`opacity-80`}>{`Frete`}</p>

                    <p className={`absolute right-0`}>{`R$ 0,00`}</p>
                  </div>

                  <div className={`w-full h-[1px] bg-projGray mt-3 mb-3`}/>
                
                  <div className={`w-full flex relative`}>
                    <p className={`text-lg font-[500]`}>{`Total`}</p>

                    <p className={`absolute right-0 text-lg font-[600]`}>{`R$ 0,00`}</p>
                  </div>

                  <div className={`w-full pt-2`}>
                    <p className={`text-md font-[450]`}>{`Tempo de entrega`}</p>
                    <div className={`w-full flex pt-2 gap-2`}>
                      <Input placeholder={`Digite seu CEP`} className={`bg-projGray rounded-full w-full font-abeezee`}/>
                      <div className={`font-abeezee italic text-sm h-[40px] cursor-pointer rounded-full bg-black text-white flex justify-center items-center pl-6 pr-6`} onClick={()=>{}}>
                        Calcular
                      </div>
                    </div>
                  </div>

                  <div className={`cursor-pointer w-full bg-black text-white rounded-full p-4 flex gap-2 justify-center items-center mt-3`}
                  onClick={()=>{console.log(session)}}
                  >
                    <p className={`font-abeezee italic`}>Finalizar Compra</p>
                    <IoMdArrowRoundForward size={20} />
                  </div>

                </div>
              </div>

          </div>


        </div>

      </div>
    </div>
  );
}
