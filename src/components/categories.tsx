import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
}

const CategoriesComponent: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoriesClick = () => {
    router.push('/categorias');
  };

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/products?category-id=${categoryId}`);
  };

  return (
    <div className={cn("relative w-full")}
         onMouseEnter={() => setHover(true)}
         onMouseLeave={() => setHover(false)}>
      <button
        className={cn(
          "bg-white px-4 py-2 text-black flex items-center justify-center w-full rounded",
          "hover:bg-gray-100"
        )}
        onClick={handleCategoriesClick}
      >
        CATEGORIAS
      </button>
      {hover && (
        <div className={cn(
          "absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg",
          "z-10"
        )}>
          <ul className="list-none p-0 m-0">
            {categories.map(category => (
              <li key={category.id} className="w-full">
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full text-left bg-transparent hover:bg-gray-100 cursor-pointer rounded p-4"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoriesComponent;
