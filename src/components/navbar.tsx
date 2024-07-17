'use client';

import React, {useState, useEffect} from 'react'
import Link from 'next/link';

// Session Authorization (NextAuth + Axios)
import { signIn, signOut, useSession } from "next-auth/react";
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

//
import { useUserDataContext } from '@/app/contexts/UserData';
//

import { FaRegUserCircle } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { BiShoppingBag } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import { CgSpinner } from "react-icons/cg";
import { CgSpinnerTwoAlt } from "react-icons/cg";


import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

//
import OrderList from './orderList';


const Navbar = () => {

  // Auth Session

  let { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  
  const {userData, setUserData} = useUserDataContext();

  // Carrinho fetch

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

  const [cart, setCart] = useState<Cart>();
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  const getCarrinho = () => {
    if (session && session.user){
      const getInfo = async () => {
        setCartLoading(true);
        const info = await axiosAuth.get("/api/cart")
        setCart(info.data);
        setCartLoading(false);
      }
      
      getInfo();
    }
  }


  //
  
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [messageLogin, setMessageLogin] = useState<string>();

  const [email, setEmail] = useState<string>("admin@gmail.com");
  const [password, setPassword] = useState<string>("admin");

  useEffect(() => {
    if (session && session.user){
      const getInfo = async () => {
        const info = await axiosAuth.get("/api/auth/me")
        setUserData(info.data);

        const cart = await axiosAuth.get("/api/cart")
        setCart(cart.data);
      }
      
      getInfo();
    }
  }, [session])


  // Função de Login
  const handleSignIn = async () => {
    setLoadingLogin(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if(result?.ok){
      setMessageLogin("authorized");
    }
    else{
      if(result?.error){
        setMessageLogin(result.error);
      }
    }

    setLoadingLogin(false);

  };
    // Função de logout (só caso não tenha sessão ativa)
  const handleSignOut = async () => {
    if(!(session == null)){
      signOut();
    }
  } 

  //

      // Componentes internos modularizados para permitir eles darem pop up de diversos locais
      const LogInCardComponent = (
        <Card>
          {
            loadingLogin
            ?
            <div className={`w-full h-[150px] flex justify-center items-center`}>    
                <CgSpinner size={30} className={`animate-spin`} />     
            </div>
            :
            <>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription className={`${!messageLogin?(messageLogin=="authorized"?"text-green-700":""):"text-red-800"}`}>
                  {
                    !messageLogin
                      ?
                      `Insira abaixo seu e-mail e senha`
                      :
                      messageLogin=="authorized"
                        ?
                        `Login realizado com sucesso`
                        :
                        `Erro: ${messageLogin}. Tente novamente.`
                  }
                </CardDescription>
            </CardHeader>
            <CardContent className={`flex gap-3`}>
                <Input placeholder={`E-mail`} />
                <Input placeholder={`Senha`} />
                  <Button onClick={()=>{handleSignIn()}}>Entrar</Button>
            </CardContent>
            </>
          }
        </Card>
    );

    // Componentes internos modularizados para permitir eles darem pop up de diversos locais
  const LoggedInCardComponent = (
    <Card>
      <CardContent className={`flex gap-3`}>
        <p>{`${
            JSON.stringify(userData.name)
              ?
              JSON.stringify(userData.name)
              :
              `Carregando...`
        }`}</p>

        <p>{`${
          JSON.stringify(userData.email)
            ?
            JSON.stringify(userData.email)
            :
            ``
        }`}</p>

        <Button onClick={()=>{handleSignOut()}}>
          DESLOGAR
        </Button>

        <OrderList/>

      </CardContent>
    </Card>    
  )

        // Logica de definição de qual componente interno vai ser exibido na aba de login
        // Caso tenha tenha sessão e essa sessão tenha usuário, mostra info dele
        // Caso contrário, exibe componente de login
  const LogInComponent = session?(session.user?LoggedInCardComponent:LogInCardComponent):LogInCardComponent;


  //

  return (
    <div className={`w-full h-fit p-2 sticky top-0 z-50 bg-white`}>
        <div className={`bg-white rounded-md h-12 sticky flex ml-[30px] mr-[30px] gap-3`}>
            <div className={`p-4 flex justify-center items-center`}>
              <p className={`font-abel text-[25px]`}>SAPATOS.COM</p>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <div className={`font-abeezee text-[14px]`}>CATEGORIAS</div>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <div className={`font-abeezee text-[14px] text-projRed`}>OFERTAS</div>
            </div>

            <div className={`p-4 flex justify-center items-center cursor-pointer`}>
              <div className={`font-abeezee text-[14px]`}>MARCAS</div>
            </div>

            <div className={`p-4 flex justify-center items-center flex-1`}>
              <div className={`font-abeezee text-[14px] rounded-full bg-projGray flex-1 flex`}>
                <div className={`min-h-full min-w-[50px] flex items-center justify-center`}>
                  <FaMagnifyingGlass size={20} className={`text-black opacity-40`}/>
                </div>
                <Input placeholder="Pesquise" className={`font-abeezee bg-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0`}/>
              </div>
            </div>

            
            <Dialog onOpenChange={()=>{setMessageLogin("")}} >
              <DialogTrigger>
                <div className={`p-4 flex justify-center items-center cursor-pointer`}>
                  <FaRegUserCircle size={20}/>
                </div>
              </DialogTrigger>
              <DialogContent className={`p-0 bg-transparent`}>

                {LogInComponent}   

              </DialogContent>
            </Dialog>
            
            <Drawer>
              
              <DrawerTrigger onClick={()=>{getCarrinho()}}>
                <div className={`p-4 flex justify-center items-center cursor-pointer`}>
                  <FiShoppingCart size={20}/>
                </div>
              </DrawerTrigger>

              <DrawerContent className={`min-w-[300px]`}>
                <DrawerHeader>
                  <DrawerTitle>Carrinho</DrawerTitle>
                  <DrawerDescription>{userData.name?userData.name:""}</DrawerDescription>
                </DrawerHeader>

                <div className={`w-full h-full`}>
                  <div className={`w-full h-full flex justify-center items-center`}>

                    {
                      userData.email
                        ?
                        <>
                          {
                            cart?.products && cart.products.length>0
                              ?
                                cart.products.map(item => (
                                  <div className={`m-2 w-full h-[80px] rounded-md border border-slate-300 flex`} key={`${item.cartId}/${item.productId}`} >
                                    <img className={`m-2 bg-projGray border border-slate-300 rounded-md h-[80%]`} src="https://images.vexels.com/content/156298/preview/rubber-shoes-silhouette-9c69af.png"></img>
                                    <div className={`h-full p-2 flex-column justify-center`}>
                                      <p className={`font-abeezee`}>{`Id Prod: ${item.productId}`}</p>
                                      <p className={`font-abeezee`}>{`Quantidade: ${item.quantity}`}</p>
                                    </div>
                                  </div>
                                  
                                ))
                              :
                              <div>
                                <p className={`text-slate-600 flex-column`}>Carrinho vazio</p>
                                <div className={`p-4 w-full flex justify-center items-center`}>
                                  <BiShoppingBag size={26} className={`text-slate-600`} />
                                </div>
                              </div>
                          }
                        </>
                        :

                        cartLoading
                          ?
                          <CgSpinnerTwoAlt size={20} className={`animate-spin opacity-50`} />
                          :
                          <div className={`flex-column`}>

                            <p className={`text-slate-600 w-full flex justify-center items-center`}>Você está desconectado</p>

                            <div className={`p-4 w-full flex justify-center items-center`}>

                            <Dialog onOpenChange={()=>{setMessageLogin("")}}>
                              <DialogTrigger>
                                <IoIosLogIn size={50} className={`text-slate-900`} />
                              </DialogTrigger>
                              <DialogContent className={`p-0 bg-transparent`}>

                                {LogInComponent}

                              </DialogContent>
                            </Dialog>

                            </div>

                            <p className={`text-slate-600`}>Clique no ícone acima para entrar</p>

                        </div>

                    }

                  </div>
                </div>


                <DrawerFooter>
                    {
                      userData.email
                        ?
                        <Link href="/carrinho" className={`w-full`}>
                          <Button className={`w-full`}>Ir para o carrinho</Button>
                        </Link>
                        :
                        <Button disabled={true}>Ir para o carrinho</Button>
                    }
                  <DrawerClose>
                    <p className={`w-full border rounded-md p-[6px] text-sm`}>Voltar</p>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

        </div>
    </div>
  )
}

export default Navbar