'use client'

import { useState, useEffect } from 'react'; 

import Carrinho from './carrinho/page';

import Link from 'next/link';

import { FaRProject, FaShoppingCart, FaUser } from "react-icons/fa";


import { BiShoppingBag } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";


import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { Button } from "@/components/ui/button"

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import LoadingView from '@/components/loadingView';

import { Input } from '@/components/ui/input';

import { signIn, signOut, useSession } from "next-auth/react";

import { fetchMe } from '@/lib/api';

import axios from "@/lib/axios";
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';



interface AuthMe {
  sub?: string;
  id?: string;
  name?: string;
  email?: string;
  refreshToken?: string;
  recoveryPasswordToken?: string | null;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  mediaId?: number;
  role?: string;
  Media?: {
    id?: number;
    url?: string;
  };
}

export default function Home() {
  let { data: session } = useSession();

  const [objTest, setObjTest] = useState<object>({});

  console.log(session);

  const axiosAuth = useAxiosAuth();

  const handleFunc = async () => {
      const res = await axiosAuth.get("/api/auth/me");
      setObjTest(res);
  }

  const [email, setEmail] = useState<string>("admin@gmail.com");
  const [password, setPassword] = useState<string>("admin");
  const [userData, setUserData] = useState<AuthMe>({});

  const LogInCardComponent = (
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Só clicar ai por enqnt</CardDescription>
        </CardHeader>
        <CardContent className={`flex gap-3`}>
          <Input />

          <Input />
          
          {/* <Link href="/carrinho"> */}
            <Button onClick={()=>{handleSignIn()}}>Entrar</Button>
          {/* </Link> */}

        </CardContent>
      </Card>
  );

  const LoggedInCardComponent = (
    <Card>
      <CardContent className={`flex gap-3`}>
        <p>{`${JSON.stringify(userData.name)}`}</p>
        <p>{`${JSON.stringify(userData.email)}`}</p>

      </CardContent>
    </Card>    
  )

  const LogInComponent = !session?.user? LogInCardComponent : LoggedInCardComponent;

  useEffect(() => {
    if (session && session.user){
      const getInfo = async () => {
        const info = await axiosAuth.get("/api/auth/me")
        setUserData(info.data);
      }
      
      getInfo();
    }
  }, [session])


  const handleSignIn = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
  };

  return (
    <>
    <main className="min-h-screen w-full hide-scrollbar">
    <LoadingView></LoadingView>
      <div className="">

        <div className={`w-full flex fixed p-2 gap-1`}>


          <Dialog>
            <DialogTrigger className={`w-12 p-1 flex justify-center items-center \ bg-background rounded-full border`}>
              <FaUser size={16} className={``} />
            </DialogTrigger>
            <DialogContent className={`p-0 bg-transparent`}>

              {LogInComponent}

            </DialogContent>
          </Dialog>

          <Menubar className={`flex-auto`}>
            <MenubarMenu>
              <MenubarTrigger>Aba 1</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>

              <MenubarTrigger>Aba 2</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>New Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Share</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print</MenubarItem>
                </MenubarContent>

            </MenubarMenu>

          </Menubar>

          <Drawer>
            
            <DrawerTrigger className={`w-16 flex justify-center items-center \ bg-background rounded-[5px] border`}>
              <FaShoppingCart className={``} />
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
                      <div className={`flex-column`}>

                        <p className={`text-slate-600`}>Carrinho vazio</p>

                        <div className={`p-4 w-full flex justify-center items-center`}>
                          <BiShoppingBag size={26} className={`text-slate-600`} />
                        </div>

                      </div>
                      :

                      <div className={`flex-column`}>

                        <p className={`text-slate-600 w-full flex justify-center items-center`}>Você está desconectado</p>

                        <div className={`p-4 w-full flex justify-center items-center`}>

                        <Dialog>
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

        <div className={`w-full bg-slate-100 h-[120vh] flex justify-center items-center`}>
          

          <Button onClick={()=>{signOut()}}>
            DESLOGAR
          </Button>



          <button className={`min-w-16 bg-slate-500`} onClick={()=>{
            console.log(handleFunc())
          }}>

            {
              `${JSON.stringify(objTest)}`
            }
         
          </button>
        </div>

      </div>
    </main>

  </>
  );
}
