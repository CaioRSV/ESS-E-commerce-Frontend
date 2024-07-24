"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Product {
  id?: number;
  name?: string;
  description: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
  stock?: number;
  salePrice?: number;
}

export default function HomePage() {
  const param = useSearchParams();
  const searchParam = param.get("search");
  const categoriaParam = param.get("categoria");
  const marcaParam = param.get("marca");
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [productData, setProductData] = useState<Product[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoriaFilter, setCategoriaFilter] = useState<string>();
  const [searchFilter, setSearchFilter] = useState<string>();

  useEffect(() => {
    let tempSearch = param.get("search");
    let tempCategoria = param.get("categoria");
    if (searchParam && searchParam?.length > 0){
      setSearchFilter(searchParam);
    }
    if (categoriaParam && categoriaParam?.length > 0){
      setCategoriaFilter(categoriaParam);
    }
    if (marcaParam && marcaParam?.length > 0){  
      setSearchFilter(marcaParam);
    }
    if (session && session.user) {
      const getInfo = async () => {
        const generalProduct = await axiosAuth.get("/api/product");
        setProductData(generalProduct.data.data);
        const info = await axiosAuth.get(`/api/product?${tempSearch?`search=${tempSearch}`:''}
        ${tempCategoria?`${tempSearch?'&':''}categoryId=${tempCategoria}`:''}
          `)
        if (info.data){
          console.log(info.data);
        }
        setProductList(info.data.data);
      //setProductData(info.data);
    };
    getInfo();
  }
  }, [session]);

  const changeFilter = async(searchP:string) => {
    const getInfo = async () => {
      const info = await axiosAuth.get(`/api/product?${searchP?`search=${searchP}`:''}
        `)
      if (info.data){
        console.log(info.data);
      }
      setProductList(info.data.data);
    }
    getInfo();
  }

  const renderProducts = (products: Product[]) => {
    return products.map((product) => (
      <div key={product.id} className="border p-4 rounded-lg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-40 object-cover mb-4"
        />
        <h3 className="text-lg font-bold">{product.name}</h3>
        {product.salePrice ? (
          <p>
            <span className="line-through text-gray-500">
              R${product.price?.toFixed(2)}
            </span>{" "}
            <span className="text-red-500">R${product.salePrice.toFixed(2)}</span>
          </p>
        ) : (
          <p>R${product.price?.toFixed(2)}</p>
        )}
      </div>
    ));
  };

  const categories = [
    { id: "sale", title: "Para você" },
    { id: "best-sellers", title: "Os mais vendidos" },
    { id: "casual", title: "Casual" },
    { id: "formal", title: "Formal" },
    { id: "performance", title: "Alta Performance" },
    { id: "designers", title: "Designers" },
  ];

  return (
    <main className="flex flex-col items-center p-8">

      <section className="w-full max-w-7xl mb-12">
        <h2 onClick = {()=> {console.log(productList)}} className="text-2xl font-bold mb-4">Para você
          <p onClick = {() => {setSearchFilter('Produto A'); changeFilter('Produto A') }}>
            produto A
          </p>
        {productList.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover mb-4"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            {product.salePrice ? (
              <p>
                <span className="line-through text-gray-500">
                  R${product.price}
                </span>{" "}
                <span className="text-red-500">R${product.salePrice.toFixed(2)}</span>
              </p>
            ) : (
              <p>R${product.price?.toFixed(2)}</p>
            )}
          </div>
        ))}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderProducts(productData.filter((product) => product.categoryId === "sale"))}
        </div>
      </section>


      <section className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Encontre seu Estilo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productData.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover mb-4"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            {product.salePrice ? (
              <p>
                <span className="line-through text-gray-500">
                  R${product.price}
                </span>{" "}
                <span className="text-red-500">R${product.salePrice.toFixed(2)}</span>
              </p>
            ) : (
              <p>R${product.price?.toFixed(2)}</p>
            )}
          </div>
        ))}
        </div>
      </section>

      <footer className="w-full max-w-7xl mt-12 border-t pt-8">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-bold">SAPATOS.COM</h3>
            <p>© 2024 Todos os direitos reservados</p>
          </div>
          <div>
            <a href="#" className="block">A EMPRESA</a>
            <a href="#" className="block">POLÍTICA DE PRIVACIDADE</a>
            <a href="#" className="block">CONTATO</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
