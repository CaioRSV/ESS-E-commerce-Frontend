'use client'

import { useState, useEffect } from 'react'; 

import Link from 'next/link';

import { FaRProject, FaShoppingCart } from "react-icons/fa";

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

import { Input } from '@/components/ui/input';

export default function Home() {
  const [cartbar, setCartbar] = useState<boolean>(false);

  return (
    <main className="min-h-screen w-full">
      <div className={`flex`} onClick={()=>{setCartbar(false)}}>
        <div className={`h-screen bg-red-800 absolute right-0 transition-all
          ${cartbar?`w-24`:`w-0`}
        `}>

          <button onClick={()=>{setCartbar(false)}}>Fechar</button>
          
        </div>
      </div>
      <div className="p-4">

        <div className={`w-full flex`}>
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

          <Button onClick={()=>{setCartbar(true)}}>
            <FaShoppingCart/>
          </Button>

        </div>

        <div className={`w-full bg-slate-100 h-screen flex justify-center items-center`}>
          

          <Dialog>
            <DialogTrigger>

            <p>{`->`}</p>

            <p>{`${cartbar}`}</p>

            </DialogTrigger>
            <DialogContent className={`p-0 bg-transparent`}>

              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Só clicar ai por enqnt</CardDescription>
                </CardHeader>
                <CardContent className={`flex gap-3`}>
                  <Input />

                  <Input />

                  <Link href="/carrinho">
                    <Button>Entrar</Button>
                  </Link>

                </CardContent>
              </Card>

            </DialogContent>
          </Dialog>


        </div>

      </div>
    </main>
  );
}
