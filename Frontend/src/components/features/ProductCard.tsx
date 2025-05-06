// frontend/src/components/features/ProductCard.tsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import { Product } from '../../types/product'; // Assurez-vous que le chemin est correct ET IDENTIQUE à celui dans ProductList

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void; // Ajout de la prop onAddToCart
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext?.isAuthenticated;

    const handleAddToCartClick = () => {
        if (isAuthenticated) {
            onAddToCart(product); // Appelle la fonction passée depuis ProductList
            console.log(`Produit "${product.name}" ajouté au panier (ID: ${product._id})`);
        } else {
            alert('Vous devez être connecté pour ajouter un produit au panier.');
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <Link to={`/products/${product._id}`} className="hover:underline">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{product.name}</h3>
                </Link>
                {product.images && product.images.length > 0 && <img src={product.images[0]} alt={product.name} className="w-full h-auto object-cover mb-2" style={{ maxHeight: '200px' }} />}
                <p className="text-gray-600 text-sm mb-2">{product.description?.substring(0, 50)}...</p>
                <p className="text-gray-700 font-semibold">Prix: ${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Catégorie: {product.category.name}</p>
                <div className="mt-3">
                    {isAuthenticated ? (
                        <button
                            onClick={handleAddToCartClick} // Utilisation de la nouvelle fonction de gestion du clic
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Ajouter au panier
                        </button>
                    ) : (
                        <p className="text-center text-gray-500">Se connecter pour ajouter au panier</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;