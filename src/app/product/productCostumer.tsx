"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 
  const [errorDialogVisible, setErrorDialogVisible] = useState<boolean>(false); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.status !== 200) {
          throw new Error('Falha ao buscar categorias');
        }
        const data: Category[] = response.data;
        setCategories(data);
        const categoryMap = data.reduce((map, category) => {
          map[category.name] = String(category.id);
          return map;
        }, {} as { [key: string]: string });
        setCategoryMap(categoryMap);
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

  const getRandomProducts = (products: Product[]) => {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.ceil(products.length / 3));
  };

  return (
    <main className="flex flex-col items-center p-8">

      <section className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Para você!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderProducts(getRandomProducts(productData))}
        </div>
      </section>

      <section className="w-full max-w-7xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-bold">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {renderProducts(productData.filter((product) => String(category.id) === categoryMap[category.name]))}
                
              </div>
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
