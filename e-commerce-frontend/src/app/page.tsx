'use client'

import { useState, useEffect } from 'react'; 

import Link from 'next/link';

import { FaRProject, FaShoppingCart } from "react-icons/fa";

import { BiShoppingBag } from "react-icons/bi";

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
  return (
    <main className="min-h-screen w-full">
      <div className="">

        <div className={`w-full flex fixed p-2 gap-1`}>
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
                <DrawerDescription>Nome do usuário.</DrawerDescription>
              </DrawerHeader>

              <div className={`w-full h-full`}>
                <div className={`w-full h-full flex justify-center items-center`}>
                  <div className={`flex-column`}>

                    <p className={`text-slate-600`}>Carrinho vazio</p>

                    <div className={`p-4 w-full flex justify-center items-center`}>
                      <BiShoppingBag size={26} className={`text-slate-600`} />
                    </div>
          
                  </div>
                </div>
              </div>


              <DrawerFooter>
                <Button>Fazer pedido</Button>
                <DrawerClose>
                  <Button variant="outline" className={`w-full`}>Voltar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

        </div>

        <div className={`w-full bg-slate-100 h-[120vh] flex justify-center items-center`}>
          

          <Dialog>
            <DialogTrigger>

            <p>{`->`}</p>

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
