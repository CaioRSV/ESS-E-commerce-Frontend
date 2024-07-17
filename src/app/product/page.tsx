"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Form } from 'react-hook-form';
import axios from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
}

export default function ProductPage() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { register, handleSubmit, formState:{errors} } = useForm<Product>();

  const handleConfirmYes: SubmitHandler<Product> = async (data: { price: any; stock: any; }) => {
    console.log(data);
    const priceAsFloat = parseFloat(String(data.price));

    if (isNaN(priceAsFloat)) {
      console.error("Invalid price value:", data.price);
      return;
    }
    const stockAsFloat = parseFloat(String(data.stock));
    if (isNaN(stockAsFloat)) {
      console.error("Invalid stock value:", data.stock);
      return;
    }
    const newData = { ...data, price: priceAsFloat, stock: stockAsFloat};
  
    try {
      await axios.post("/api/Product", newData);
      console.log("Informações enviadas com sucesso!");
      alert("Item cadastrado com sucesso!");
      window.location.reload();

    } catch (error) {
      console.error("Erro ao enviar informações para o backend:", error);
    }
  };
 
  useEffect(() => {
    const getInfo = async () => {
      const info = await axiosAuth.get("/api/Product");
      console.log(info.data);
      setProductData(info.data);
    };
    getInfo();
  }, [axiosAuth, session]);

  const categories = ["Tênis", "Botas", "Rasteiras"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Adicionar Itens</h1>
          <button className="bg-black text-white px-4 py-2 rounded">ADM</button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-8 w-full">
          {selectedProduct ? (
            <div>
              <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
              <p>Imagem: {selectedProduct.imageUrl}</p>
              <p>Preço: R${selectedProduct.price?.toFixed(2)}</p>
              <p>Estoque: {selectedProduct.stock}</p>
              <p>Categoria: {selectedProduct.categoryId}</p>
              <p>Descrição: {selectedProduct.description}</p>
              <button
                className="mt-4 bg-black text-white px-4 py-2 rounded"
                onClick={() => setSelectedProduct(null)}
              >
                Editar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleConfirmYes)}>
              <div>
                <label>Nome da peça</label>
                <input{...register("name", {required: true})}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Nome da peça"
                />
              </div>
              <div>
                <label>Imagem da peça</label>
                <input{...register("imageUrl", {required: true})}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Imagem da peça"
                />
              </div>
              <div>
                <label>Preço</label>
                <input{...register("price", {required: true})}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Preço"
                />
              </div>
              <div>
                <label>Estoque</label>
                <input{...register("stock", {required: true})}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Estoque"
                />
              </div>
              <div>
                <label>Categoria</label>
                <input{...register("categoryId", {required: true})}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Categoria"
                />
              </div>
              <div>
                <label>Descrição</label>
                <textarea
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Descrição"
                />
              </div>
              <button className="bg-black text-white px-4 py-2 rounded" type="submit">
                Salvar
              </button>
            </form>
          )}
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {productData
                .filter((product) => product.categoryId === category)
                .map((product) => (
                  <div
                    key={product.id}
                    className="border p-4 rounded-lg"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-32 h-32 object-cover mb-4"
                    />
                    <p>{product.name}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
