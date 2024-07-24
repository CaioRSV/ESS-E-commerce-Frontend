'use client' // Componente Cliente -> Manipulação de variáveis de estado


import { useSession } from "next-auth/react"

import { axiosAuth } from "@/lib/axios";

import { getServerSession } from "next-auth";




import { Input } from '@/components/ui/input';

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { IoMdArrowRoundForward } from "react-icons/io";
import { TbShoppingCartQuestion } from "react-icons/tb";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { FaRegTrashAlt } from "react-icons/fa";

import { useProductDataContext } from "../contexts/ProductData";


interface Product{
  cartId: number
  productId: number
  quantity: number
  userId: number
}

interface Cart{
  id?: number
  userId?: number
  locked?: boolean
  products: Product[]
}

interface DadosPedido{
  subtotal: number
  desconto: number
  frete: number
  total: number
}

function floatToMoney(number:number) {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Erro: Número inválido';
  }

  const numeroFormatado = number.toFixed(2);

  const [intPart, decimalPart] = numeroFormatado.split('.');

  const moneyFormat = intPart + '.' + decimalPart;
  return moneyFormat;
}


export default function Carrinho() {
  const {data:session, status} = useSession();

  // Caso não haja um sessão válida, redireciona para a Home
  if (!(status=="authenticated")){
    redirect("/");
  }
  //
  const [cart, setCart] = useState<Cart>();
  const [loading, setLoading] = useState<boolean>(false);

  const {productData, setProductData} = useProductDataContext();

  const updateDadosPedido = (cartData_temp:Cart) => {
    let newSubTotal = 0;

    cartData_temp.products.forEach(item => {
      newSubTotal += (productData.find(produto => produto.id===item.productId)?.price ?? 0)*item.quantity
    })

    if(newSubTotal>0){
      let desconto = newSubTotal/10;
      let frete = 25.0;
  
      setDadosPedido(prev => ({
        ...prev, subtotal: newSubTotal, total: newSubTotal - desconto + frete, desconto: desconto, frete: frete
      }))
  
      console.log(newSubTotal);
    }
    else{
      setDadosPedido(prev => ({
        ...prev, subtotal: 0, total: 0, desconto: 0, frete: 0
      }))
    }
  }

  const fetchCart = async () => {
    setLoading(true);
    const cart = await axiosAuth.get("/api/cart")

    for(const item of cart.data.products){
      if(!productData.some(itemExistente => itemExistente.id === item.productId)){
        const productInfo = await axiosAuth.get("/api/Product/"+item.productId);
        setProductData((prev) => [...prev, productInfo.data])
      }
    }

    setCart(cart.data);
    updateDadosPedido(cart.data);
    setLoading(false);
  }

  const fetchCartNoLoading = async () => {
    const cart = await axiosAuth.get("/api/cart")
    updateDadosPedido(cart.data);
    setCart(cart.data);
  }

  useEffect(() => {
    if (session && session.user){
      fetchCart();
    }
  }, [session])

  //

  const [dadosPedido, setDadosPedido] = useState<DadosPedido>({
    subtotal: 0,
    desconto: 0,
    frete: 0,
    total: 0
  })

  const [tempoEntrega, setTempoEntrega] = useState<string>();

  const changeQuantity = async (productId: number, quantity:number, addNumber: number) => {
    const res = await axiosAuth.put("/api/cart/update", {
      cartId: cart?.id,
      productId: productId,
      quantity: quantity+addNumber
    });

    
    if(res.status==200){
      fetchCartNoLoading();
    }
  }

  const removeFromCart = async (productId: number) => {
    const res = await axiosAuth.delete("/api/cart/remove", {
      data: {
        cartId: cart?.id,
        productId: productId,
      }
    });
    
    if(res.status==200){
      fetchCartNoLoading();
    }
  }
  
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
                <div className={`w-full min-h-32 bg-white rounded-xl border border-projGray p-4`} id="productContainer">
                  
                  {
                    loading
                      ?
                      <div className={`w-full h-48 flex justify-center items-center opacity-50`}>
                            <CgSpinnerTwoAlt size={25} className={`animate-spin`} />
                      </div>
                      :
                      cart && cart.products && cart.products.length>0
                        ?
                        
                          cart?.products.map(item => (
                            <div key={`${item.cartId}/${item.productId}`}>
                            <div className={`w-full h-[145px]  p-2 flex`}>
                              <img className={`rounded-md w-[145px] h-full bg-projGray`} src={`${
                                productData.find(product => product.id === item.productId)
                                ?.productMedia?.slice(-1)[0]?.media?.url ?? 'no_image'
                              }`} />
                              <div className={`ml-3 h-full w-full relative overflow-hidden`}>
                                <div className={`rounded-full w-fit absolute right-0 cursor-pointer`} onClick={()=>{removeFromCart(item.productId)}} id="removeButton">
                                  <FaRegTrashAlt size={20} className={`text-projRed`}/>
                                </div>
                                <p className={`font-abeezee text-[18px] italic`}>{`${productData.find(product => product.id === item.productId)?.name}`}</p>
                                
                                <p className={`font-abeezee text-[12px]`}>{`Descrição:`} <span className={`opacity-75`}>{`${productData.find(product => product.id === item.productId)?.description}`}</span> </p>
                                <p className={`font-abeezee text-[12px]`}>{`Tamanho:`} <span className={`opacity-75`}>{`${35}`}</span> </p>

                                <div className={`w-full h-[63px] flex items-end`}>
                                  <p className={`font-abeezee text-2xl italic flex-1`}>{`R$ ${floatToMoney(
                                    productData.find(product => product.id === item.productId)?.price ?? 1
                                  )}`}</p>
      
                                  <div className={`flex bg-projGray rounded-full w-40 pt-1 pb-1 justify-center items-center`}>
                                    <p className={`cursor-pointer font-abeezee text-3xl flex-1 flex justify-center items-center rounded-full`} onClick={()=>{changeQuantity(item.productId, item.quantity, -1)}}>-</p>
                                    <p className={`font-abeezee text-md flex-1 flex justify-center items-center rounded-full italic`}>{`${item.quantity}`}</p>
                                    <p className={`cursor-pointer font-abeezee text-3xl flex-1 flex justify-center items-center rounded-full`} onClick={()=>{changeQuantity(item.productId, item.quantity, 1)}}>+</p>
                                  </div>
      
                                </div>
                              </div>
                            </div>
      
                            <div className={`w-full p-2`}>
                              <div className={`w-full h-[1px] bg-projGray`}></div>
                            </div>
                            </div>                      
                          ))
                        :
                        <div className={`w-full h-48 flex justify-center items-center opacity-50`}>
                          <div className={`flex-column`}>
                            <TbShoppingCartQuestion size={21} className={`w-full flex justify-center items-center`} />
                            <p>O carrinho ainda está vazio</p>
                          </div>
                        </div>
                  }


                </div>
              </div>

              <div className={`h-full md:min-w-[350px] md:w-[45%]`}>
                <div className={`w-full min-h-32 bg-white rounded-xl border border-projGray p-4`}>
                  <p className={`font-abeezee text-xl italic`}>Seu pedido</p>

                  <div className={`w-full flex relative pt-2`}>
                    <p className={`opacity-80`}>{`Subtotal`}</p>

                    <p className={`absolute right-0`}>{`R$ ${floatToMoney(dadosPedido.subtotal)}`}</p>
                  </div>

                  <div className={`w-full flex relative pt-2`}>
                    <p className={`opacity-80`}>{`Desconto (20%)`}</p>

                    <p className={`absolute right-0 text-projRed`}>{`-R$ ${floatToMoney(dadosPedido.desconto)}`}</p>
                  </div>

                  <div className={`w-full flex relative pt-2`}>
                    <p className={`opacity-80`}>{`Frete`}</p>

                    <p className={`absolute right-0`}>{`R$ ${floatToMoney(dadosPedido.frete)}`}</p>
                  </div>

                  <div className={`w-full h-[1px] bg-projGray mt-3 mb-3`}/>
                
                  <div className={`w-full flex relative`}>
                    <p className={`text-lg font-[500]`}>{`Total`}</p>

                    <p className={`absolute right-0 text-lg font-[600]`}>{`R$ ${floatToMoney(dadosPedido.total)}`}</p>
                  </div>

                  <div className={`w-full pt-2 relative`}>
                    <p className={`text-md font-[450] w-full relative`}>{`Tempo de entrega`} <span className={`absolute right-0`}>{`${tempoEntrega?tempoEntrega:""}`}</span></p>
                    <div className={`w-full flex pt-2 gap-2`}>
                      <Input placeholder={`Digite seu CEP`} className={`bg-projGray rounded-full w-full font-abeezee`}/>
                      <div className={`font-abeezee italic text-sm h-[40px] cursor-pointer rounded-full bg-black text-white flex justify-center items-center pl-6 pr-6`} 
                      onClick={()=>{setTempoEntrega("? dias")}}>
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
