import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCart, CartItem } from '../../contexts/CartContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa'; // Importez FaTrash
import styles from './Navigation.module.css';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
    const { isAuthenticated, logout, user } = useAuthContext();
    const { getTotalItems, items: cartItems, getTotalPrice, removeFromCart } = useCart(); // Récupérer removeFromCart
    const navigate = useNavigate();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const mobileNavRef = useRef<HTMLDivElement | null>(null);
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
    const miniCartRef = useRef<HTMLDivElement | null>(null);
    const cartLinkRef = useRef<HTMLSpanElement | null>(null);
    const currency = 'DT'; // Dinar Tunisien

    const closeMobileNav = () => {
        setIsMobileNavOpen(false);
    };

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideMobile = (event: MouseEvent) => {
            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node) && isMobileNavOpen) {
                closeMobileNav();
            }
        };

        if (isMobileView) {
            document.addEventListener('mousedown', handleClickOutsideMobile);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideMobile);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideMobile);
        };
    }, [isMobileView, isMobileNavOpen, mobileNavRef]);

    const toggleMiniCart = () => {
        setIsMiniCartOpen(!isMiniCartOpen);
    };

    useEffect(() => {
        const handleClickOutsideMiniCart = (event: MouseEvent) => {
            if (miniCartRef.current && !miniCartRef.current.contains(event.target as Node) && cartLinkRef.current && !cartLinkRef.current.contains(event.target as Node) && isMiniCartOpen) {
                setIsMiniCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideMiniCart);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideMiniCart);
        };
    }, [isMiniCartOpen]);

    const handleRemoveItem = (itemId: string) => {
        removeFromCart(itemId);
    };

    const MobileNav: React.FC = () => (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-md py-3 md:hidden`}>
            {/* ... Navigation mobile ... */}
        </nav>
    );

    const DesktopNav: React.FC = () => (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-md py-3 md:flex`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-gray-800">Mia</Link>
                <ul className="flex space-x-6 items-center">
                    <li><Link to="/" className="hover:text-blue-500">Accueil</Link></li>
                    <li><Link to="/products" className="hover:text-blue-500">Produits</Link></li>
                    <li><Link to="/a-propos" className="hover:text-blue-500">À propos</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
                    {isAuthenticated && (
                        <>
                            <Link to="/profil" className="hover:text-blue-500">Mon Profil</Link>
                            <button onClick={handleLogout} className="hover:text-red-500 focus:outline-none">Déconnexion</button>
                            {user?.nom && <span className="text-gray-700">Bonjour, {user.nom}</span>}
                            <div className="relative hover:text-blue-500 focus:outline-none">
                                <span
                                    ref={cartLinkRef}
                                    onClick={toggleMiniCart}
                                    className="cursor-pointer flex items-center"
                                >
                                    Panier ({getTotalItems()})
                                    <FaShoppingCart className="ml-1 h-5 w-5" />
                                    {getTotalItems() > 0 && (
                                        <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{getTotalItems()}</span>
                                    )}
                                </span>
                                {isMiniCartOpen && (
                                    <div
                                        ref={miniCartRef}
                                        className={styles.miniCart}
                                    >
                                        {cartItems.length > 0 ? (
                                            <>
                                                <ul className={styles.miniCartItems}>
                                                    {cartItems.slice(0, 3).map((item: CartItem) => (
                                                        <li key={item.id} className={styles.miniCartItem}>
                                                            
                                                            <div className={styles.miniCartItemDetails}>
                                                                <div className={styles.miniCartItemName}>{item.nom}</div>
                                                                <div className={styles.miniCartItemInfo}>
                                                                    <span className={styles.miniCartQuantity}>x{item.quantite}</span>
                                                                    <span className={styles.miniCartPrice}>{item.prix.toFixed(2)}{currency}</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                className={styles.removeItemButton}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </li>
                                                    ))}
                                                    {cartItems.length > 3 && (
                                                        <li className={styles.miniCartItem}>...et {cartItems.length - 3} autres</li>
                                                    )}
                                                </ul>
                                                <div className={styles.miniCartTotal}>
                                                    Total: {getTotalPrice().toFixed(2)} {currency}
                                                </div>
                                                <div className={styles.miniCartActions}>
                                                    <Link to="/cart" className={styles.miniCartButton}>Voir le panier</Link>
                                                    <Link to="/checkout" className={styles.miniCartButton}>Passer à la caisse</Link>
                                                </div>
                                            </>
                                        ) : (
                                            <p className={styles.miniCartEmpty}>Votre panier est vide.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="hover:text-blue-500">Se connecter</Link>
                            <Link to="/register" className="hover:text-blue-500">S'inscrire</Link>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );

    return (
        <>
            {isMobileView ? <MobileNav /> : <DesktopNav />}
        </>
    );
};

export default Navigation;