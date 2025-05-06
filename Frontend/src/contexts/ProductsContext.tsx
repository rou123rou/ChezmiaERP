import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ProductsContextType {
  products: any[]; // Remplacez 'any' par le type de vos produits
  loading: boolean;
  error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://streamia-erp-backend.onrender.com/api/products'); // Utilisez l'URL de votre backend Render
        if (!response.ok) {
          throw new Error(`Erreur de récupération des produits: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur lors de la récupération des produits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts doit être utilisé à l\'intérieur d\'un ProductsProvider');
  }
  return context;
};