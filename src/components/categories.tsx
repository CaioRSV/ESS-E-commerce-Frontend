import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { cn } from "@/lib/utils"

interface Media {
  id: number;
  url: string;
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

const CategoriesComponent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.status !== 200) {
          throw new Error('Failed to fetch categories');
        }
        const data: Category[] = response.data;
        setCategories(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Ensure the dependency array is empty

  const toggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={cn("w-full")}>
      <div className="relative">
        <button
          className={cn(
            "bg-white px-4 py-2 text-black flex items-center justify-center w-full rounded",
            "hover:bg-gray-100"
          )}
          onClick={toggleDropdown}
        >
          CATEGORIAS
        </button>
        {dropdownVisible && (
          <div className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-gray-100 shadow-md p-4 z-10",
            "flex flex-col"
          )}>
            {categories.map((category) => (
              <div key={category.id} className={cn("flex flex-col items-center")}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    "flex flex-col items-center p-2",
                    activeCategory === category.id && "border-2 border-black"
                  )}
                >
                  {category.Media?.url && (
                    <img src={category.Media.url} alt={category.name} className="w-12 h-12 object-cover mb-2" />
                  )}
                  <span>{category.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>  
  );
};

export default CategoriesComponent;
