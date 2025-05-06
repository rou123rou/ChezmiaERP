import React, { createContext, useState, useContext } from 'react';

interface AppContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isCartOpen: boolean; // Ajoutez l'état du panier au contexte
  toggleCart: () => void; // Ajoutez la fonction de basculement du panier
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // Initialisez l'état du panier

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsCartOpen(false); // Fermez le panier lors de l'ouverture de la sidebar
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsSidebarOpen(false); // Fermez la sidebar lors de l'ouverture du panier
  };

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, isCartOpen, toggleCart }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};