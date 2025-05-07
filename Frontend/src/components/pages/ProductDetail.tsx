// frontend/src/components/pages/ProductDetail.tsx
import  { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import AuthContext from '../../contexts/AuthContext';
import styles from './ProductDetail.module.css'; // Importez le fichier CSS module
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

interface Product {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    images: string[];
    category: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
    description?: string;
}

// Simulating fetching product details based on the list data structure
const fetchProductDetails = (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const descriptions = {
                'Chamia Sans sucre': 'Qualité 100% bio. Sans sucre ajouté ni remplacé, 100% naturel. Ingrédients de base : lait en poudre, sésame, huile de sésame.',
                'Eclat pistache': 'Qualité 100% bio. Ingrédients de base : lait en poudre, sésame, huile de sésame, pistaches croquantes.',
                'Eclat noisettes': 'Qualité 100% bio. Ingrédients de base : lait en poudre, sésame, huile de sésame, noisettes gourmandes.',
                'Eclat Noix': 'Qualité 100% bio. Ingrédients de base : lait en poudre, sésame, huile de sésame, noix riches.',
                'Eclat Amande': 'Qualité 100% bio. Des éclats d\'amandes pour encore plus de croquant. Découvrez notre Chamia artisanale, riche, onctueuse et 100% plaisir ! Ingrédients de base : lait en poudre, sésame, huile de sésame, amandes.',
                'Chamia crunchy noisettes': 'Qualité 100% bio. Chamia croustillante avec des pépites croustillantes à l\'intérieur et une couche de beurre de noisette au-dessus. Ingrédients de base : lait en poudre, sésame, huile de sésame, noisettes.',
                'Chamia crunchy pistaches': 'Qualité 100% bio. Le mariage parfait entre la tradition et l’audace : notre Chamia Crunchy Pistache est une explosion de saveurs à chaque cuillère. Contient des pépites croustillantes à l\'intérieur et une couche de beurre de pistache au-dessus. Ingrédients de base : lait en poudre, sésame, huile de sésame, pistaches.',
                'Chamia à tartiner (Choco blanc)': 'Qualité 100% bio. 💬 À tartiner, à cuisiner ou à savourer à la cuillère… notre Chamia fondante s’adapte à toutes vos envies, même sans sucre ajouté. Ingrédients de base : lait en poudre, sésame, huile de sésame, chocolat blanc.',
                'Chamia sans sucre 1KG': 'Qualité 100% bio. Chamia sans sucre en format familial 1KG. Ingrédients de base : lait en poudre, sésame, huile de sésame.',
                '1Kg Chamia sucré ( fruits sec)': 'Qualité 100% bio. 1Kg de Chamia sucrée contenant un mélange de fruits secs (amandes, noix, noisettes et pistaches) à l\'intérieur. Ingrédients de base : lait en poudre, sésame, huile de sésame, amandes, noix, noisettes, pistaches.',
            };
            const produitsDetails: Product[] = [
                { _id: '6807fffe53c76bcf88f97f9d', name: 'Chamia Sans sucre', quantity: 5, price: 20, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Chamia Sans sucre'] },
                { _id: '6808000a53c76bcf88f97fa1', name: 'Eclat pistache', quantity: 9, price: 19.5, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Eclat pistache'] },
                { _id: '6808002953c76bcf88f97fa5', name: 'Eclat noisettes', quantity: 10, price: 15.5, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Eclat noisettes'] },
                { _id: '6808003453c76bcf88f97fa9', name: 'Eclat Noix', quantity: 10, price: 17.5, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Eclat Noix'] },
                { _id: '6808004753c76bcf88f97fad', name: 'Eclat Amande', quantity: 10, price: 15, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Eclat Amande'] },
                { _id: '6808005853c76bcf88f97fb1', name: 'Chamia crunchy noisettes', quantity: 10, price: 17, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Chamia crunchy noisettes'] },
                { _id: '6808007353c76bcf88f97fb5', name: 'Chamia crunchy pistaches', quantity: 10, price: 19, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Chamia crunchy pistaches'] },
                { _id: '6808008d53c76bcf88f97fb9', name: 'Chamia à tartiner (Choco blanc)', quantity: 10, price: 15, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Chamia à tartiner (Choco blanc)'] },
                { _id: '680800a753c76bcf88f97fbd', name: 'Chamia sans sucre 1KG', quantity: 10, price: 50, images: [], category: { _id: '6807ef07842d7fb71c639f84', name: 'SANS SUCRE' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['Chamia sans sucre 1KG'] },
                { _id: '680800ba53c76bcf88f97fc1', name: '1Kg Chamia sucré ( fruits sec)', quantity: 10, price: 45, images: [], category: { _id: '6807ef1c842d7fb71c639f88', name: 'Sucré' }, createdAt: '', updatedAt: '', __v: 0, description: descriptions['1Kg Chamia sucré ( fruits sec)'] },
            ];
            const foundProduct = produitsDetails.find(produit => produit._id === id);
            resolve(foundProduct);
        }, 500);
    });
};

function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext?.isAuthenticated;
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const currency = 'DT'; // Dinar Tunisien

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchProductDetails(id)
                .then(data => {
                    setProduct(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Erreur lors du chargement des détails du produit.');
                    setLoading(false);
                    console.error(err);
                });
        }
    }, [id]);

    const handleAddToCart = () => {
        if (isAuthenticated && product) {
            addToCart({ id: product._id, nom: product.name, prix: product.price });
            navigate('/cart');
        } else {
            navigate('/login', { state: { from: `/products/${id}` } });
        }
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
        return <div className={styles.loadingContainer}>Chargement des détails du produit...</div>;
    }
    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }
    if (!product) {
        return <div className={styles.notFoundContainer}>Produit non trouvé.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                        <img
                            src={getImagePath(product.name)}
                            alt={product.name}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.details}>
                        <h2 className={styles.title}>{product.name}</h2>
                        <div className={styles.priceCategory}>
                            <p className={styles.price}>Prix: {product.price?.toFixed(2)} {currency}</p>
                            <p className={styles.category}>Catégorie: {product.category.name}</p>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={isAuthenticated ? styles.addToCartButton : styles.addToCartButtonDisabled}
                            disabled={!isAuthenticated || loading || !product}
                        >
                            {isAuthenticated ? 'Ajouter au panier' : 'Se connecter pour ajouter au panier'}
                        </button>
                        {!isAuthenticated && (
                            <p className={styles.authNote}>
                                <Link to="/login" state={{ from: `/products/${id}` }} className={styles.authLink}>
                                    Se connecter
                                </Link> ou <Link to="/register" className={styles.authLink}>s'inscrire</Link> pour ajouter des articles au panier.
                            </p>
                        )}
                    </div>
                </div>
                <div className={styles.descriptionContainer}>
                    <h3 className={styles.descriptionTitle}>Description du produit</h3>
                    {product.description && <p className={styles.description}>{product.description}</p>}
                </div>
                <Link to="/products" className={styles.backLink}>Retour à la liste des produits</Link>
            </div>
        </div>
    );
}

export default ProductDetail;