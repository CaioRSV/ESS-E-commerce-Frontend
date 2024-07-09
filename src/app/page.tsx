'use client' // Componente Cliente -> Manipulação de variáveis de estado

import { useState, useEffect } from 'react'; 

// Componentes 
import Carrinho from './carrinho/page';

// Componentes Externos
// shadcnui: https://ui.shadcn.com/docs
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

import { Input } from '@/components/ui/input';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

// Session Authorization (NextAuth + Axios)
import { signIn, signOut, useSession } from "next-auth/react";
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';

// Routing
import Link from 'next/link';

// React Icons
import { FaRProject, FaShoppingCart, FaUser } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { BiShoppingBag } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";

// ---
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
  // Auth Session

  let { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [userData, setUserData] = useState<AuthMe>({});


    // Sempre que a sessão for atualizada (incluindo em primeiro carregamento),
    // O programa dá fetch nos dados do usuário e mantém na variável de estado UserData
  useEffect(() => {
    if (session && session.user){
      const getInfo = async () => {
        const info = await axiosAuth.get("/api/auth/me")
        setUserData(info.data);
      }
      
      getInfo();
    }
  }, [session])

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [messageLogin, setMessageLogin] = useState<string>();

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

  console.log(session);

  //
  const [objTest, setObjTest] = useState<object>({}); // Para teste de visualização abaixo
  
    // Função pra visualizar os dados fetchados do usuário (Puramente demonstrativo, o userData atualiza sozinho com o useEffect)
  const handleFunc = () => {
      setObjTest(userData);
      console.log(userData);
  }

  // Utils aba de Login

  const [email, setEmail] = useState<string>("admin@gmail.com");
  const [password, setPassword] = useState<string>("admin");


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

      </CardContent>
    </Card>    
  )

        // Logica de definição de qual componente interno vai ser exibido na aba de login
        // Caso tenha tenha sessão e essa sessão tenha usuário, mostra info dele
        // Caso contrário, exibe componente de login
  const LogInComponent = session?(session.user?LoggedInCardComponent:LogInCardComponent):LogInCardComponent;

  //

  // Retornando componente completo da página
  return (
    <main className="min-h-screen w-full hide-scrollbar">
      <div className="">

        <div className={`w-full flex fixed p-2 gap-1`}>

          <Dialog onOpenChange={()=>{setMessageLogin("")}} >
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

        <div className={`w-full bg-slate-100 h-[120vh] flex justify-center items-center`}>


          <div>
            <p className={`text-md p-2`}>Clique no botão para exibir dados do usuário atual ( <span className={`bg-black text-green-700 p-2`}>{`/auth/me`}</span>)</p>
            
            <button className={`min-w-16 bg-slate-500`} onClick={()=>{
              console.log(handleFunc())
            }}>

              {
                `${JSON.stringify(objTest)}`
              }
          
            </button>
          </div>


        </div>

      </div>
    </main>
  );
}
