"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [productData, setProductData] = useState<Product[]>([]);

  useEffect(() => {
    const getInfo = async () => {
      const info = await axiosAuth.get("/api/product");
      console.log(info.data);
      setProductData(info.data);
    };
    getInfo();
  }, [axiosAuth, session]);

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
    { id: "sale", title: "Queima de Estoque" },
    { id: "best-sellers", title: "Os mais vendidos" },
    { id: "casual", title: "Casual" },
    { id: "formal", title: "Formal" },
    { id: "performance", title: "Alta Performance" },
    { id: "designers", title: "Designers" },
  ];

  return (
    <main className="flex flex-col items-center p-8">

      <section className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Queima de Estoque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderProducts(productData.filter((product) => product.categoryId === "sale"))}
        </div>
      </section>

      <section className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Os mais vendidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderProducts(productData.filter((product) => product.categoryId === "best-sellers"))}
        </div>
      </section>

      <section className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Encontre seu Estilo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(2).map((category) => (
            <div key={category.id} className="border p-4 rounded-lg">
              <img
                src={`/${category.id}.jpg`}
                alt={category.title}
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-lg font-bold text-center">{category.title}</h3>
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
