// frontend/src/hooks/useFetchProducts.tsx
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../src/contexts/AuthContext';
// Assurez-vous que ce chemin est correct pour votre interface Product
import { Product } from '../../src/types/product';

interface UseFetchProductsResult {
    products: Product[] | null;
    loading: boolean;
    error: string | null;
}

const useFetchProducts = (url: string): UseFetchProductsResult => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers: HeadersInit = {};
                if (user?.token) {
                    headers['Authorization'] = `Bearer ${user.token}`;
                }

                const response = await fetch(url, { headers });
                if (!response.ok) {
                    const message = `Erreur HTTP: ${response.status}`;
                    throw new Error(message);
                }
                const data = await response.json();
                setProducts(data); // La réponse de /api/stocks est directement le tableau
            } catch (err: any) {
                setError(err.message || 'Une erreur est survenue lors de la récupération des produits.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, user?.token]);

    return { products, loading, error };
};

export default useFetchProducts;