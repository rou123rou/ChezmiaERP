import React, { useState, CSSProperties, createContext, useEffect, useContext, ReactNode } from 'react';
import { Product } from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Importez vos images directement
import sanssucre300 from '../../assets/imgProduit/sanssucre300.png';
import pistache from '../../assets/imgProduit/pistache.png';
import noisettes from '../../assets/imgProduit/noisettes.png';
import noix from '../../assets/imgProduit/noix.png';
import amande from '../../assets/imgProduit/amande.png';
import crunchynoisettes from '../../assets/imgProduit/crunchynoisettes.png';
import crunchypistache from '../../assets/imgProduit/crunchypistache.png';
import tartiner from '../../assets/imgProduit/tartiner.png';
import kgss from '../../assets/imgProduit/1kgss.png';
import kgfruitsec from '../../assets/imgProduit/1kgfruitsec.jpg';
import placeholder from '../../assets/imgProduit/Logo Chez Mia PNG.ico';

interface ProductsContextType {
    products: Product[] | null;
    loading: boolean;
    error: string | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
    children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const backendUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : process.env.REACT_APP_BACKEND_URL || 'https://chezmiaerpbackend.onrender.com/api';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${backendUrl}/products/`);
                if (!response.ok) {
                    throw new Error(`Erreur de récupération des produits: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data.products || []);
            } catch (err: any) {
                setError(err.message);
                console.error('Erreur lors de la récupération des produits:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [backendUrl]);

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
    return context!;
};

function ProductList() {
    const { products, loading, error } = useProducts();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [notification, setNotification] = useState<string | null>(null);

    const primaryColor = '#AF5D24';
    const secondaryColor = '#F9FAFB';

    const textColor = '#333';
    const montserratFont = 'Montserrat, sans-serif';
    const shadowColor = 'rgba(0, 0, 0, 0.1)';
    const currency = 'DT';

    const handleAddToCart = (product: Product) => {
        if (isAuthenticated) {
            addToCart({ id: product._id, nom: product.name, prix: product.price });
            setNotification(`"${product.name}" ajouté au panier !`);
            setTimeout(() => setNotification(null), 1500);
            console.log(`Produit "${product.name}" ajouté au panier.`);
        } else {
            navigate('/login', { state: { from: '/products' } });
        }
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: primaryColor,
        marginBottom: '2rem',
        textAlign: 'center' as 'center',
        fontFamily: montserratFont,
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
    };

    const productCardStyle = {
        backgroundColor: secondaryColor,
        boxShadow: `0 4px 8px ${shadowColor}`,
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        cursor: 'pointer',
    };

    const productCardHoverStyle = {
        transform: 'scale(1.02)',
        boxShadow: `0 6px 12px ${shadowColor}`,
    };

    const productNameStyle = {
        fontSize: '1.25rem',
        fontWeight: 'semibold',
        color: textColor,
        marginBottom: '0.5rem',
        transition: 'color 0.2s ease-in-out',
        fontFamily: montserratFont,
    };

    const productPriceStyle = {
        color: '#777',
        marginBottom: '0.5rem',
        fontFamily: montserratFont,
    };

    const addToCartButtonStyle = {
        width: '100%',
        backgroundColor: primaryColor,
        color: secondaryColor,
        fontWeight: 'bold',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        fontFamily: montserratFont,
    };

    const notificationStyle: CSSProperties = {
        position: 'fixed' as 'fixed',
        bottom: '1rem',
        right: '1rem',
        backgroundColor: '#4CAF50',
        color: secondaryColor,
        padding: '0.75rem 1.25rem',
        borderRadius: '6px',
        boxShadow: `0 2px 4px ${shadowColor}`,
        zIndex: 50,
        fontFamily: montserratFont,
    };

    const getImagePath = (productName: string) => {
        switch (productName) {
            case 'Chamia Sans sucre': return sanssucre300;
            case 'Eclat pistache': return pistache;
            case 'Eclat noisettes': return noisettes;
            case 'Eclat Noix': return noix;
            case 'Eclat Amande': return amande;
            case 'Chamia crunchy noisettes': return crunchynoisettes;
            case 'Chamia crunchy pistaches': return crunchypistache;
            case 'Chamia à tartiner (Choco blanc)': return tartiner;
            case 'Chamia sans sucre 1KG': return kgss;
            case '1Kg Chamia sucré ( fruits sec)': return kgfruitsec;
            default: return placeholder;
        }
    };

    if (loading) {
        return <div className="container mx-auto mt-8 text-center" style={{ fontFamily: montserratFont }}>Chargement des produits...</div>;
    }

    if (error) {
        return <div className="container mx-auto mt-8 text-red-500 text-center" style={{ fontFamily: montserratFont }}>Erreur lors du chargement des produits: {error}</div>;
    }

    return (
        <div className="py-12" style={{ backgroundColor: secondaryColor }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 style={titleStyle}>Nos Délicieuses Chamias</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products && products.map((product) => (
                        <div
                            key={product._id}
                            className="shadow-md rounded-lg overflow-hidden transition duration-300 cursor-pointer"
                            style={productCardStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, productCardHoverStyle)}
                            onMouseLeave={(e) => {
                                Object.assign(e.currentTarget.style, productCardStyle);
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                            onClick={() => navigate(`/products/${product._id}`)}
                        >
                            <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                                <img
                                    src={getImagePath(product.name)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 style={productNameStyle} className="hover:text-indigo-600 transition duration-200">{product.name}</h3>
                                <p style={productPriceStyle}>Prix: {product.price?.toFixed(2)} {currency}</p>
                                <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} style={addToCartButtonStyle}>Ajouter au panier</button>
                            </div>
                        </div>
                    ))}
                </div>
                {!products || products.length === 0 && (<p className="text-gray-600 mt-6 text-center" style={{ fontFamily: montserratFont }}>Aucun produit trouvé pour le moment.</p>)}
            </div>
            {notification && (<div style={notificationStyle}>{notification}</div>)}
        </div>
    );
}

export default ProductList;