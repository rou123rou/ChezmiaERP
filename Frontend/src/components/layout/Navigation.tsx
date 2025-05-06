import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

function Navigation() {
    const { isAuthenticated, logout, user, authChangeCounter } = useAuthContext();
    const { items, removeFromCart, getTotalPrice, getTotalItems } = useCart();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile
    const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
    const currency = 'DT'; // Dinar Tunisien
    console.log('Navigation RENDER - isAuthenticated from context:', isAuthenticated, 'user from context:', user, 'authChangeCounter:', authChangeCounter);

    useEffect(() => {
        console.log('Navigation useEffect (authChangeCounter changed) - isAuthenticated from context:', isAuthenticated);
        setIsLoggedIn(isAuthenticated);
    }, [isAuthenticated, authChangeCounter]);

    const handleLogout = useCallback(() => {
        console.log('Navigation - handleLogout called');
        logout();
        navigate('/login');
    }, [logout, navigate]);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
        setIsMobileMenuOpen(false); // Fermer le menu mobile si le panier s'ouvre
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsCartOpen(false); // Fermer le panier si le menu mobile s'ouvre
    };

    const openProductsDropdown = () => {
        if (dropdownTimeout.current) {
            clearTimeout(dropdownTimeout.current);
        }
        setIsProductsDropdownOpen(true);
    };

    const closeProductsDropdown = () => {
        dropdownTimeout.current = setTimeout(() => {
            setIsProductsDropdownOpen(false);
        }, 150); // Délai de 150ms avant de fermer
    };

    return (
        <nav className="bg-gradient-to-r from-orange-100 to-yellow-100 shadow-md py-3 fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo ou titre à gauche */}
                <Link to="/" className="text-xl font-bold text-gray-800">Mia</Link>

                {/* Menu principal (grand écran) */}
                <ul className="hidden md:flex space-x-6 items-center">
                    <li><Link to="/" className="hover:text-blue-500">Accueil</Link></li>
                    <li className="relative">
                        <button
                            onMouseEnter={openProductsDropdown}
                            onMouseLeave={closeProductsDropdown}
                            className="hover:text-blue-500 focus:outline-none"
                        >
                            Produits
                        </button>
                        {isProductsDropdownOpen && (
                            <div
                                onMouseEnter={openProductsDropdown}
                                onMouseLeave={closeProductsDropdown}
                                className="absolute left-0 mt-2 bg-white shadow-md rounded-md overflow-hidden"
                            >
                                <Link to="/products?category=sucre" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    ○ Sucré
                                </Link>
                                <Link to="/products?category=sans-sucre" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    ○ Sans Sucre
                                </Link>
                            </div>
                        )}
                    </li>
                    <li><Link to="/a-propos" className="hover:text-blue-500">À propos</Link></li>
                    <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li> {/* Lien Contact ajouté */}
                </ul>

                {/* Actions à droite (grand écran) */}
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated && (
                        <>
                            <Link to="/profil" className="hover:text-blue-500">Mon Profil</Link>
                            <button onClick={handleLogout} className="hover:text-red-500 focus:outline-none">
                                Déconnexion
                            </button>
                            {user && user.nom && (
                                <span className="text-gray-700">Bonjour, {user.nom}</span>
                            )}
                            <button onClick={toggleCart} className="relative hover:text-blue-500 focus:outline-none">
                                Panier ({getTotalItems()})
                                {items.length > 0 && (
                                    <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{getTotalItems()}</span>
                                )}
                            </button>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="hover:text-blue-500">Se connecter</Link>
                            <Link to="/register" className="hover:text-blue-500">S'inscrire</Link>
                        </>
                    )}

                    {/* Menu mobile button */}
                    <button onClick={toggleMobileMenu} className="md:hidden focus:outline-none">
                        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menu mobile (petit écran) */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-40 py-2 flex flex-col items-center">
                        <Link to="/" className="block py-2 hover:text-blue-500">Accueil</Link>
                        <div className="relative w-full text-center">
                            <button
                                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                                className="block py-2 hover:text-blue-500 focus:outline-none w-full"
                            >
                                Produits
                            </button>
                            {isProductsDropdownOpen && (
                                <div className="bg-gray-100 rounded-md overflow-hidden mt-1">
                                    <Link to="/products?category=sucre" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">○ Sucré</Link>
                                    
                                </div>
                            )}
                        </div>
                        <Link to="/a-propos" className="block py-2 hover:text-blue-500">À propos</Link>
                        <Link to="/contact" className="block py-2 hover:text-blue-500">Contact</Link> {/* Lien Contact dans le menu mobile */}
                        {isAuthenticated && (
                            <>
                                <Link to="/profil" className="block py-2 hover:text-blue-500">Mon Profil</Link>
                                <button onClick={handleLogout} className="block py-2 hover:text-red-500 focus:outline-none">
                                    Déconnexion
                                </button>
                                {user && user.nom && (
                                    <span className="block py-2 text-gray-700">Bonjour, {user.nom}</span>
                                )}
                                <button onClick={toggleCart} className="relative block py-2 hover:text-blue-500 focus:outline-none">
                                    Panier ({getTotalItems()})
                                    {items.length > 0 && (
                                        <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{getTotalItems()}</span>
                                    )}
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="block py-2 hover:text-blue-500">Se connecter</Link>
                                <Link to="/register" className="block py-2 hover:text-blue-500">S'inscrire</Link>
                            </>
                        )}
                    </div>
                )}

                {/* Panier déroulant (reste inchangé) */}
                {isCartOpen && (
                    <div className="fixed top-0 right-0 max-h-[400px] w-80 bg-white shadow-md z-50 transform translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold">Votre Panier</h2>
                            <button onClick={toggleCart} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M18.27 16.27a1 1 0 01-1.41 1.41L12 13.41l-4.86 4.27a1 1 0 01-1.41-1.41L10.59 12 6.27 7.73a1 1 0 011.41-1.41L12 10.59l4.86-4.27a1 1 0 011.41 1.41L13.41 12l4.86 4.27z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {items.length > 0 ? (
                                <ul>
                                    {items.map(item => (
                                        <li key={item.id} className="flex items-center py-2 border-b">
                                            <span className="flex-grow">{item.nom} ({item.quantite})</span>
                                            <span>{(item.prix * item.quantite).toFixed(2)} {currency}</span>
                                            <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700 focus:outline-none">
                                                Supprimer
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Votre panier est vide.</p>
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="p-4 border-t flex flex-col space-y-2">
                                <p className="font-semibold">Total: {getTotalPrice().toFixed(2)} {currency}</p>
                                <Link to="/cart" onClick={toggleCart} className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Voir le panier complet
                                </Link>
                                <Link
                                    to="/checkout"
                                    onClick={toggleCart}
                                    className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                                >
                                    Passer à la caisse
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navigation;