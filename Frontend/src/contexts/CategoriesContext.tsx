import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface CategoriesContextType {
  categories: string[];
  loading: boolean;
  error: string | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Ici, vous ferez l'appel à votre API pour récupérer les catégories
    // Pour l'instant, nous allons simuler des données
    setTimeout(() => {
      setCategories(['Électronique', 'Vêtements', 'Livres']);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories doit être utilisé à l\'intérieur d\'un CategoriesProvider');
  }
  return context;
};