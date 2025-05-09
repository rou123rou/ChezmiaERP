import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface CartItem {
    id: string;
    nom: string;
    prix: number;
    quantite: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: { id: string; nom: string; prix: number }) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: { id: string; nom: string; prix: number }) => {
        const existingItemIndex = items.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            const updatedItems = items.map(item =>
                item.id === product.id ? { ...item, quantite: item.quantite + 1 } : item
            );
            setItems(updatedItems);
        } else {
            setItems([...items, { ...product, quantite: 1 }]);
        }
    };

    const removeFromCart = (itemId: string) => {
        setItems(items.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity > 0) {
            const updatedItems = items.map(item =>
                item.id === itemId ? { ...item, quantite: quantity } : item
            );
            setItems(updatedItems);
        } else {
            removeFromCart(itemId);
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantite, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.prix * item.quantite, 0);
    };

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
    }
    return context;
};