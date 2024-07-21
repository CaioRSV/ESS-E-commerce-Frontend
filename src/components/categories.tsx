import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { cn } from "@/lib/utils";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryImage, setNewCategoryImage] = useState<string>('');
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

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

  const handleEditCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryImage.trim() || !editingCategory) return; // Ensure both fields are filled
    setCreatingCategory(true);

    // Construct the updated Media object
    const updatedMedia: Media = {
      id: editingCategory.Media?.id || 0, // Use existing id or a placeholder value
      url: newCategoryImage
    };

    // Optimistically update the UI
    const updatedCategory: Category = {
      ...editingCategory,
      name: newCategoryName,
      Media: updatedMedia
    };

    setCategories(prevCategories =>
      prevCategories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
    );

    try {
      await axiosAuth.put(`/api/categories/`, {
        id: editingCategory.id,
        name: newCategoryName,
        imageUrl: newCategoryImage,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      // Rollback UI change
      setCategories(prevCategories =>
        prevCategories.map(cat => cat.id === editingCategory.id ? editingCategory : cat)
      );
    } finally {
      setNewCategoryName('');
      setNewCategoryImage('');
      setCreatingCategory(false);
      setEditDialogVisible(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async () => {
    if (deletingCategoryId === null) return; // Ensure there's a category to delete
    try {
      const response = await axiosAuth.delete(`/api/categories/${deletingCategoryId}`);
      if (response.status !== 200) {
        throw new Error('Failed to delete category');
      }
      setCategories(prevCategories =>
        prevCategories.filter(cat => cat.id !== deletingCategoryId)
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setDeleteDialogVisible(false);
      setDeletingCategoryId(null);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryImage(category.Media?.url || '');
    setEditDialogVisible(true);
  };

  const openDeleteDialog = (categoryId: number) => {
    setDeletingCategoryId(categoryId);
    setDeleteDialogVisible(true);
  };

  if (loading) return <div>CATEGORIAS</div>;
  if (error) return <div>CATEGORIAS</div>;

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
              <div key={category.id} className={cn("flex items-center mb-2", "w-full", "relative")}>
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
                {userData?.role === 'ADMIN' && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-1">
                    <button
                      onClick={() => openEditDialog(category)}
                      className="p-1 text-gray-600 hover:text-gray-900"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(category.id)}
                      className="p-1 text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
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
            <h2 className="text-lg font-bold mb-4">Criar Categoria</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da Categoria"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              value={newCategoryImage}
              onChange={(e) => setNewCategoryImage(e.target.value)}
              placeholder="URL da Imagem"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setDialogVisible(false)}
                className="mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCategory}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={creatingCategory}
              >
                {creatingCategory ? 'Creating...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {editDialogVisible && editingCategory && (
        <div className={cn(
          "fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center",
          "z-20"
        )}>
          <div className={cn(
            "bg-white p-6 rounded shadow-md",
            "w-96"
          )}>
            <h2 className="text-lg font-bold mb-4">Editar Categoria</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da Categoria"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="text"
              value={newCategoryImage}
              onChange={(e) => setNewCategoryImage(e.target.value)}
              placeholder="URL da Imagem"
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setEditDialogVisible(false)}
                className="mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditCategory}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={creatingCategory}
              >
                {creatingCategory ? 'Saving...' : 'Editar'}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteDialogVisible && (
        <div className={cn(
          "fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center",
          "z-20"
        )}>
          <div className={cn(
            "bg-white p-6 rounded shadow-md",
            "w-96"
          )}>
            <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
            <p>Tem certeza de que deseja excluir esta categoria?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDeleteDialogVisible(false)}
                className="mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCategory}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesComponent;
