"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "@/lib/axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  category: any;
}

interface Category {
  id: number;
  name: string;
  mediaId: number;
  createdAt: string;
  deletedAt?: any;
  updatedAt?: any;
  Media?: Media;
}

interface Media {
  id: number;
  url: string;
}

export default function ProductPage() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 
  const [errorDialogVisible, setErrorDialogVisible] = useState<boolean>(false); 

  const { register, handleSubmit, formState: { errors } } = useForm<Product>();

  const handleConfirmYes: SubmitHandler<Product> = async (data) => {
    const priceAsFloat = parseFloat(String(data.price));
    const stockAsFloat = parseFloat(String(data.stock));
    if (isNaN(priceAsFloat) || isNaN(stockAsFloat)) {
      console.error("Invalid price or stock value:", data.price, data.stock);
      return;
    }
    const newData = { ...data, price: priceAsFloat, stock: stockAsFloat };
  
    try {
      await axiosAuth.post("/api/product", newData);
      alert("Item cadastrado com sucesso!");
      window.location.reload();
    } catch (refreshError) {
      console.error("Erro ao enviar informações para o backend:", refreshError);
      alert(refreshError);
    }
  };

  const handleConfirmPatch: SubmitHandler<Product> = async (data) => {
    const priceAsFloat = parseFloat(String(data.price));
    const stockAsFloat = parseFloat(String(data.stock));
    if (isNaN(priceAsFloat) || isNaN(stockAsFloat)) {
      console.error("Invalid price or stock value:", data.price, data.stock);
      return;
    }
    const newData = { ...data, price: priceAsFloat, stock: stockAsFloat };

    try {
      await axiosAuth.patch(`/api/product/${selectedProduct?.id}`, newData);
      alert("Alterações salvas com sucesso!");
      window.location.reload();
    } catch (refreshError) {
      console.error("Erro ao enviar informações para o backend:", refreshError);
      alert(refreshError);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      await axiosAuth.delete(`/api/product/${selectedProduct.id}`);
      alert("Produto deletado com sucesso!");
      window.location.reload();
    } catch (deleteError) {
      console.error("Erro ao deletar o produto:", deleteError);
      alert(deleteError);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.status !== 200) {
          throw new Error('Falha ao buscar categorias');
        }
        const data: Category[] = response.data;
        setCategories(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro desconhecido');
        }
        setLoading(false);
        setErrorDialogVisible(true);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (session && session.user) {
      const getInfo = async () => {
        const info = await axiosAuth.get("/api/product");
        if (info.data) {
          setProductData(info.data.data);
        }
      };
      getInfo();
    }
  }, [axiosAuth, session]);

  //const categories = ["Tênis", "Botas", "Rasteiras"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Adicionar Itens</h1>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-8 w-full">
          {selectedProduct ? (
            <div>
              <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
              <form onSubmit={handleSubmit(handleConfirmPatch , handleConfirmDelete)}>
              <div>
                <label>Nome da peça</label>
                <input
                  {...register("name", { required: false })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder={selectedProduct.name}
                />
              </div>
              <div>
                <label>Imagem da peça</label>
                <input
                  {...register("imageUrl", { required: false })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder= {selectedProduct.imageUrl}
                />
              </div>
              <div>
                <label>Preço</label>
                <input
                  {...register("price", { required: false })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder={selectedProduct.price?.toFixed(2)}
                />
              </div>
              <div>
                <label>Estoque</label>
                <input
                  {...register("stock", { required: false })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder={String(selectedProduct.stock)}
                />
              </div>
              <div>
                <label>Categoria</label>
                <select               
                  {...register("categoryId", { required: false })}
                  className="w-full border rounded p-2 mb-4"
                  defaultValue={selectedProduct?.categoryId} //implementar defaultvalue barra de rolagem
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Descrição</label>
                <textarea
                  {...register("description", { required: false })}
                  className="w-full border rounded p-2 mb-4"
                  placeholder={selectedProduct.description}
                />
              </div>
            </form>
              <div className="flex space-x-4">
                <button
                  className="mt-4 bg-black text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleSubmit(handleConfirmPatch);
                  }}
                >
                  Salvar alterações
                </button>
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleSubmit(handleConfirmDelete);
                  }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleConfirmYes)}>
              <div>
                <label>Nome da peça</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Nome da peça"
                />
              </div>
              <div>
                <label>Imagem da peça</label>
                <input
                  {...register("imageUrl", { required: true })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Imagem da peça"
                />
              </div>
              <div>
                <label>Preço</label>
                <input
                  {...register("price", { required: true })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Preço"
                />
              </div>
              <div>
                <label>Estoque</label>
                <input
                  {...register("stock", { required: true })}
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Estoque"
                />
              </div>
              <div>
                <label>Categoria</label>
                <select
                  {...register("categoryId", { required: true })}
                  className="w-full border rounded p-2 mb-4"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Descrição</label>
                <textarea
                  {...register("description", { required: true })}
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

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Todos os Produtos</h2>
          <div className="flex space-x-4 overflow-x-auto">
            {productData.map((product) => (
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
                <p><strong>{product.name}</strong></p>
                <p>R${product.price}</p>
                <p>Estoque: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
