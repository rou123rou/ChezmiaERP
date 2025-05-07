import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from './Navigation.module.css';

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
    const { isAuthenticated, logout, user } = useAuthContext();
    const { getTotalItems } = useCart();
    const navigate = useNavigate();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isDesktopNavVisible, setIsDesktopNavVisible] = useState(false);
    const desktopNavRef = useRef<HTMLDivElement | null>(null);
    const desktopTimeoutId = useRef<NodeJS.Timeout | null>(null);
    const mobileNavRef = useRef<HTMLDivElement | null>(null);

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    const closeMobileNav = () => {
        setIsMobileNavOpen(false);
    };

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    const handleDesktopMouseEnter = () => {
        setIsDesktopNavVisible(true);
        if (desktopTimeoutId.current) {
            clearTimeout(desktopTimeoutId.current);
        }
    };

    const handleDesktopMouseLeave = () => {
        desktopTimeoutId.current = setTimeout(() => {
            setIsDesktopNavVisible(false);
        }, 3000);
    };

    const handleDesktopNavMouseOver = () => {
        if (desktopTimeoutId.current) {
            clearTimeout(desktopTimeoutId.current);
        }
        setIsDesktopNavVisible(true);
    };

    const handleDesktopNavMouseOut = () => {
        desktopTimeoutId.current = setTimeout(() => {
            setIsDesktopNavVisible(false);
        }, 3000);
    };

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
        const handleClickOutsideDesktop = (event: MouseEvent) => {
            if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
                setIsDesktopNavVisible(false);
                if (desktopTimeoutId.current) {
                    clearTimeout(desktopTimeoutId.current);
                }
            }
        };

        if (!isMobileView) {
            document.addEventListener('mousedown', handleClickOutsideDesktop);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideDesktop);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideDesktop);
            if (desktopTimeoutId.current) {
                clearTimeout(desktopTimeoutId.current);
            }
        };
    }, [isMobileView, desktopNavRef]);

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

    const MobileNav: React.FC = () => (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-md py-3 md:hidden`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <button onClick={toggleMobileNav} className="text-xl font-bold text-gray-800 focus:outline-none">
                    {isMobileNavOpen ? <FaTimes /> : 'Mia'}
                </button>
                <div className="flex items-center">
                    {isAuthenticated && (
                        <Link to="/cart" className="relative hover:text-blue-500 focus:outline-none">
                            <FaShoppingCart className="h-6 w-6" />
                            {getTotalItems() > 0 && (
                                <span className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{getTotalItems()}</span>
                            )}
                        </Link>
                    )}
                    {!isAuthenticated && (
                        <Link to="/login" className="hover:text-blue-500">
                            <FaUser className="h-6 w-6" />
                        </Link>
                    )}
                </div>
            </div>

            <div
                ref={mobileNavRef}
                className={`${styles.mobileNavContainer} ${isMobileNavOpen ? styles.mobileNavContainerOpen : ''}`}
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="mb-8">
                        <Link to="/" onClick={closeMobileNav} className={styles.mobileNavLogo}>Mia</Link>
                    </div>
                    <nav className="flex-grow">
                        <Link to="/" onClick={closeMobileNav} className={styles.mobileNavItem}><FaBars className="inline mr-2" />Accueil</Link>
                        <Link to="/products" onClick={closeMobileNav} className={styles.mobileNavItem}><FaBars className="inline mr-2" />Produits</Link>
                        <Link to="/a-propos" onClick={closeMobileNav} className={styles.mobileNavItem}><FaBars className="inline mr-2" />À propos</Link>
                        <Link to="/contact" onClick={closeMobileNav} className={styles.mobileNavItem}><FaBars className="inline mr-2" />Contact</Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/profil" onClick={closeMobileNav} className={styles.mobileNavItem}><FaUser className="inline mr-2" />Mon Profil</Link>
                                <button onClick={handleLogout} className={styles.mobileNavLogoutButton}><FaSignOutAlt className="inline mr-2" />Déconnexion</button>
                                {user?.nom && <span className={styles.mobileNavUser}>Bonjour, {user.nom}</span>}
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <Link to="/login" onClick={closeMobileNav} className={styles.mobileNavItem}><FaUser className="inline mr-2" />Se connecter</Link>
                                <Link to="/register" onClick={closeMobileNav} className={styles.mobileNavItem}><FaUser className="inline mr-2" />S'inscrire</Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </nav>
    );

    const DesktopNav: React.FC = () => (
        <nav
            ref={desktopNavRef}
            className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-100 to-yellow-100 shadow-md py-3 transition-transform duration-300 md:flex hidden ${isDesktopNavVisible ? styles.desktopNavContainerVisible : styles.desktopNavContainer}`}
            onMouseEnter={handleDesktopMouseEnter}
            onMouseLeave={handleDesktopMouseLeave}
            onMouseOver={handleDesktopNavMouseOver}
            onMouseOut={handleDesktopNavMouseOut}
        >
            <div className={`container mx-auto px-4 ${styles.desktopNavInner}`}>
                <Link to="/" className={styles.desktopNavLogo}>Mia</Link>
                <ul className={styles.desktopNavLinks}>
                    <li><Link to="/" className={styles.desktopNavLink}>Accueil</Link></li>
                    <li><Link to="/products" className={styles.desktopNavLink}>Produits</Link></li>
                    <li><Link to="/a-propos" className={styles.desktopNavLink}>À propos</Link></li>
                    <li><Link to="/contact" className={styles.desktopNavLink}>Contact</Link></li>
                    {isAuthenticated && (
                        <div className={styles.desktopNavActions}>
                            <Link to="/profil" className={styles.desktopNavLink}>Mon Profil</Link>
                            <button onClick={handleLogout} className={styles.desktopNavLogoutButton}>Déconnexion</button>
                            {user?.nom && <span className={styles.desktopNavUser}>Bonjour, {user.nom}</span>}
                            <Link to="/cart" className={`${styles.desktopNavLink} relative`}>
                                Panier ({getTotalItems()})
                                {getTotalItems() > 0 && (
                                    <span className={styles.desktopNavCartBadge}>{getTotalItems()}</span>
                                )}
                            </Link>
                        </div>
                    )}
                    {!isAuthenticated && (
                        <div className={styles.desktopNavActions}>
                            <Link to="/login" className={styles.desktopNavLink}>Se connecter</Link>
                            <Link to="/register" className={styles.desktopNavLink}>S'inscrire</Link>
                        </div>
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