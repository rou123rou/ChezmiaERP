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
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Ici, vous ferez l'appel à votre API pour récupérer les produits
    // Pour l'instant, nous allons simuler des données
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Produit A', price: 25 },
        { id: 2, name: 'Produit B', price: 50 },
      ]);
      setLoading(false);
    }, 1000);
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