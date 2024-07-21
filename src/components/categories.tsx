import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from "@/lib/utils";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUserDataContext } from '@/app/contexts/UserData';

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
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryImage, setNewCategoryImage] = useState<string>('');
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);

  const axiosAuth = useAxiosAuth();
  const { userData } = useUserDataContext();

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

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryImage.trim()) return; // Ensure both fields are filled
    setCreatingCategory(true);
    try {
      const response = await axiosAuth.post("/api/categories", {
        name: newCategoryName,
        imageUrl: newCategoryImage
      });
      if (response.status !== 201) {
        throw new Error('Failed to create category');
      }
      const newCategory: Category = response.data;
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setNewCategoryName('');
      setNewCategoryImage('');
      setCreatingCategory(false);
      setDialogVisible(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setCreatingCategory(false);
    }
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
            {userData?.role === 'ADMIN' && (
              <button
                onClick={() => setDialogVisible(true)}
                className={cn(
                  "flex items-center justify-center p-2 mt-4 bg-green-500 text-white rounded",
                  "hover:bg-green-600"
                )}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
      {dialogVisible && (
        <div className={cn(
          "fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center",
          "z-20"
        )}>
          <div className={cn(
            "bg-white p-6 rounded shadow-md",
            "w-96"
          )}>
            <h2 className="text-lg font-bold mb-4">Create New Category</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              value={newCategoryImage}
              onChange={(e) => setNewCategoryImage(e.target.value)}
              placeholder="Image URL"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setDialogVisible(false)}
                className="mr-2 bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={creatingCategory}
                className={cn(
                  "bg-blue-500 text-white px-4 py-2 rounded",
                  creatingCategory && "bg-blue-300 cursor-not-allowed"
                )}
              >
                {creatingCategory ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesComponent;
