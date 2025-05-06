// frontend/src/components/pages/ProductDetail.tsx

import  { useEffect, useState, useContext } from 'react';

import { useParams, Link, useNavigate } from 'react-router-dom';

import { useCart } from '../../contexts/CartContext';



import AuthContext from '../../contexts/AuthContext';

import { CSSProperties } from 'react';



// Importez vos images directement (ajustez les chemins si nécessaire)

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



    const primaryColor = '#AF5D24'; // Orange terreux

    const secondaryColor = '#F9FAFB'; // Blanc cassé

    const headingColor = '#000'; // Noir gras pour les titres

    const textColor = '#333'; // Noir pour le texte principal

    const montserratFont = 'Montserrat, sans-serif';

    const shadowColor = 'rgba(0, 0, 0, 0.2)'; // Ombre plus prononcée

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



    const containerStyle: CSSProperties = {

        backgroundColor: secondaryColor,

        paddingTop: '4rem',

        paddingBottom: '4rem',

        fontFamily: montserratFont,

        color: textColor,

    };



    const wrapperStyle: CSSProperties = {

        maxWidth: '70rem', // Augmenter la largeur maximale

        margin: '0 auto',

        paddingLeft: '2rem',

        paddingRight: '2rem',

    };



    const productCardStyle: CSSProperties = {

        backgroundColor: secondaryColor,

        boxShadow: `0 8px 16px ${shadowColor}`, // Ombre plus forte pour l'effet 3D

        borderRadius: '12px', // Bords plus arrondis

        overflow: 'hidden',

        display: 'flex', // Utiliser Flexbox pour l'organisation

        marginBottom: '2rem', // Espacement sous la carte principale

    };



    const imageWrapperStyle: CSSProperties = {

        flex: '0 0 50%', // L'image prend la moitié de la largeur

        aspectRatio: '1 / 1', // Ratio carré pour l'image

        backgroundColor: '#f0f0f0',

        display: 'flex',

        alignItems: 'center',

        justifyContent: 'center',

        padding: '1rem',

    };



    const imageStyle: CSSProperties = {

        maxWidth: '100%',

        maxHeight: '100%',

        objectFit: 'contain', // Ajuster pour afficher toute l'image

    };



    const detailsStyle: CSSProperties = {

        flex: '1 1 50%', // Les détails prennent l'autre moitié

        padding: '2rem',

        display: 'flex',

        flexDirection: 'column',

        justifyContent: 'space-between',

    };



    const titleStyle: CSSProperties = {

        fontSize: '3rem', // Titre plus grand

        fontWeight: 'bold',

        color: primaryColor,

        marginBottom: '1.5rem',

        fontFamily: montserratFont,

        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',

    };



    const priceCategoryStyle: CSSProperties = {

        marginBottom: '1.5rem',

    };



    const priceStyle: CSSProperties = {

        color: '#777',

        fontSize: '1.5rem',

        fontFamily: montserratFont,

        fontWeight: 'bold',

    };



    const categoryStyle: CSSProperties = {

        color: '#999',

        fontSize: '1.1rem',

        fontStyle: 'italic',

        fontFamily: montserratFont,

    };



    const descriptionContainerStyle: CSSProperties = {

        backgroundColor: secondaryColor,

        boxShadow: `0 4px 8px ${shadowColor}`,

        borderRadius: '12px',

        padding: '2rem',

        marginBottom: '2rem',

    };



    const descriptionTitleStyle: CSSProperties = {

        fontSize: '1.8rem',

        fontWeight: 'bold',

        color: headingColor,

        marginBottom: '1rem',

        fontFamily: montserratFont,

    };



    const descriptionStyle: CSSProperties = {

        color: textColor,

        lineHeight: '1.7',

        fontFamily: montserratFont,

        whiteSpace: 'pre-line',

    };



    const addToCartButtonStyle: CSSProperties = {

        padding: '1rem 2rem',

        fontWeight: 'bold',

        borderRadius: '8px',

        color: secondaryColor,

        backgroundColor: isAuthenticated ? primaryColor : '#ccc',

        cursor: isAuthenticated ? 'pointer' : 'not-allowed',

        border: 'none',

        transition: 'background-color 0.2s ease-in-out',

        fontFamily: montserratFont,

        fontSize: '1.2rem',

    };



    const addToCartButtonHoverStyle: CSSProperties = {

        backgroundColor: '#8C4B1A',

    };



    const authNoteStyle: CSSProperties = {

        marginTop: '1rem',

        fontSize: '0.9rem',

        color: '#777',

        fontFamily: montserratFont,

        textAlign: 'center',

    };



    const authLinkStyle: CSSProperties = {

        color: primaryColor,

        fontWeight: 'bold',

        textDecoration: 'underline',

    };



    const backLinkStyle: CSSProperties = {

        marginTop: '2rem',

        display: 'block',

        color: primaryColor,

        fontWeight: 'bold',

textDecoration: 'underline',

        fontFamily: montserratFont,

        textAlign: 'center',

    };



    if (loading) {

        return <div className="container mx-auto mt-8 text-center" style={{ fontFamily: montserratFont }}>Chargement des détails du produit...</div>;

    }



    if (error) {

        return <div className="container mx-auto mt-8 text-red-500 text-center" style={{ fontFamily: montserratFont }}>{error}</div>;

    }



    if (!product) {

        return <div className="container mx-auto mt-8 text-gray-600 text-center" style={{ fontFamily: montserratFont }}>Produit non trouvé.</div>;

    }



    return (

        <div style={containerStyle}>

            <div style={wrapperStyle}>

                <div style={productCardStyle}>

                    <div style={imageWrapperStyle}>

                        <img

                            src={getImagePath(product.name)}

                            alt={product.name}

                            style={imageStyle}

                        />

                    </div>

                    <div style={detailsStyle}>

                        <h2 style={titleStyle}>{product.name}</h2>

                        <div style={priceCategoryStyle}>

                            <p style={priceStyle}>Prix: {product.price?.toFixed(2)} {currency}</p>

                            <p style={categoryStyle}>Catégorie: {product.category.name}</p>

                        </div>

                        <button

                            onClick={handleAddToCart}

                            style={isAuthenticated ? addToCartButtonStyle : { ...addToCartButtonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' }}

                            onMouseEnter={(e) => isAuthenticated && Object.assign(e.currentTarget.style, addToCartButtonHoverStyle)}

                            onMouseLeave={(e) => isAuthenticated && Object.assign(e.currentTarget.style, addToCartButtonStyle)}

                            disabled={!isAuthenticated || loading || !product}

                        >

                            {isAuthenticated ? 'Ajouter au panier' : 'Se connecter pour ajouter au panier'}

                        </button>

                        {!isAuthenticated && (

                            <p style={authNoteStyle}>

                                <Link to="/login" state={{ from: `/products/${id}` }} style={authLinkStyle}>

                                    Se connecter

                                </Link> ou <Link to="/register" style={authLinkStyle}>s'inscrire</Link> pour ajouter des articles au panier.

                            </p>

                        )}

                    </div>

                </div>



                <div style={descriptionContainerStyle}>

                    <h3 style={descriptionTitleStyle}>Description du produit</h3>

                    {product.description && <p style={descriptionStyle}>{product.description}</p>}

                </div>



                <Link to="/products" style={backLinkStyle}>Retour à la liste des produits</Link>

            </div>

        </div>

    );

}



export default ProductDetail;