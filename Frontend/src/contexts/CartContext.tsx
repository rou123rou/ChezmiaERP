import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext'; // Importez le contexte d'authentification

interface CartItem {
    id: string; // productId depuis le backend
    nom: string;
    prix: number;
    quantite: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: { id: string; nom: string; prix: number }) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    loadCart: () => Promise<void>; // Fonction pour charger le panier depuis le serveur
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { token } = useAuthContext(); // Récupérer le token d'authentification

    useEffect(() => {
        if (token) {
            loadCart(); // Charger le panier depuis le serveur lors de l'initialisation si l'utilisateur est connecté
        } else {
            setItems([]); // Vider le panier si l'utilisateur est déconnecté
        }
    }, [token]);

    const loadCart = async () => {
        if (token) {
            try {
                const response = await fetch('/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setItems(data.items || []); // Assurez-vous que la structure de la réponse correspond
                } else {
                    console.error('Erreur lors du chargement du panier:', response.status);
                    setItems([]);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du panier:', error);
                setItems([]);
            }
        } else {
            setItems([]);
        }
    };

    const addToCart = async (product: { id: string; nom: string; prix: number }) => {
        if (token) {
            try {
                const response = await fetch('/api/cart/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId: product.id, quantity: 1 }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setItems(data.items || []); // Mettre à jour le panier avec la réponse du serveur
                } else {
                    console.error('Erreur lors de l\'ajout au panier:', response.status);
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout au panier:', error);
            }
        } else {
            console.log('Utilisateur non connecté, impossible d\'ajouter au panier.');
        }
    };

    const removeFromCart = async (itemId: string) => {
        if (token) {
            try {
                const response = await fetch(`/api/cart/items/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setItems(data.items || []);
                } else {
                    console.error('Erreur lors de la suppression du panier:', response.status);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du panier:', error);
            }
        } else {
            console.log('Utilisateur non connecté, impossible de supprimer du panier.');
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        if (token) {
            try {
                const response = await fetch(`/api/cart/items/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ quantity }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setItems(data.items || []);
                } else {
                    console.error('Erreur lors de la mise à jour de la quantité:', response.status);
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour de la quantité:', error);
            }
        } else {
            console.log('Utilisateur non connecté, impossible de mettre à jour la quantité.');
        }
    };

    const clearCart = async () => {
        if (token) {
            try {
                const response = await fetch('/api/cart', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    setItems([]);
                } else {
                    console.error('Erreur lors de la suppression du panier:', response.status);
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du panier:', error);
            }
        } else {
            console.log('Utilisateur non connecté, impossible de vider le panier.');
        }
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
        loadCart,
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