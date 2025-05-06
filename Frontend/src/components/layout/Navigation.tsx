import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Navigation.module.css'; // Importez le fichier CSS module

function Navigation() {
  const { isAuthenticated, logout, user, authChangeCounter } = useAuthContext();
  const { items, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);
  const [localUser, setLocalUser] = useState(user); // État local pour l'utilisateur
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const currency = 'DT'; // Dinar Tunisien

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated, authChangeCounter]);

  // Mettre à jour l'état local de l'utilisateur lorsque l'utilisateur du contexte change
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleLogout = useCallback(() => {
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
    <nav className={styles.navbar}>
      <div className={`container mx-auto px-4 flex items-center justify-between ${styles.navContainer}`}>
        {/* Logo ou titre à gauche */}
        <Link to="/" className={styles.logo}>Chez Mia</Link>

        {/* Menu principal (grand écran) */}
        <ul className={`hidden md:flex space-x-6 items-center ${styles.mainMenu}`}>
          <li><Link to="/" className={styles.navLink}>Accueil</Link></li>
          <li><Link to="/products" className={`${styles.navLink} ${styles.productsLink}`}> Produits</Link> </li>
          <li><Link to="/a-propos" className={styles.navLink}>À propos</Link></li>
          <li><Link to="/contact" className={styles.navLink}>Contact</Link></li> {/* Lien Contact ajouté */}
        </ul>

        {/* Actions à droite (grand écran) */}
        <div className={`hidden md:flex items-center space-x-4 ${styles.navActions}`}>
          {isAuthenticated && (
            <>
              <Link to="/profil" className={styles.navLink}>Mon Profil</Link>
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton} focus:outline-none`}>
                Déconnexion
              </button>
              {localUser && localUser.nom && (
                <span className={styles.userName}>Bonjour, {localUser.nom}</span>
              )}
              <button onClick={toggleCart} className={`relative focus:outline-none ${styles.cartButton}`}>
                Panier ({getTotalItems()})
                {items.length > 0 && (
                  <span className={styles.cartBadge}>{getTotalItems()}</span>
                )}
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className={styles.navLink}>Se connecter</Link>
              <Link to="/register" className={styles.navLink}>S'inscrire</Link>
            </>
          )}

          {/* Menu mobile button */}
          <button onClick={toggleMobileMenu} className="md:hidden focus:outline-none">
            <svg className={`h-6 w-6 text-gray-700 ${styles.hamburgerIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className={styles.mobileMenu}>
            <Link to="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
            <div className="relative w-full text-center">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className={`${styles.mobileNavLink} focus:outline-none w-full ${isProductsDropdownOpen ? styles.dropdownOpenMobile : ''}`}
              >
                Produits
              </button>
              {isProductsDropdownOpen && (
                <div className={styles.mobileDropdown}>
                  <Link to="/products?category=sucre" className={styles.mobileDropdownLink} onClick={() => setIsMobileMenuOpen(false)}>○ Sucré</Link>
                  <Link to="/products?category=sans-sucre" className={styles.mobileDropdownLink} onClick={() => setIsMobileMenuOpen(false)}>○ Sans Sucre</Link>
                </div>
              )}
            </div>
            <Link to="/a-propos" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>À propos</Link>
            <Link to="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link> {/* Lien Contact dans le menu mobile */}
            {isAuthenticated && (
              <>
                <Link to="/profil" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Mon Profil</Link>
                <button onClick={handleLogout} className={`${styles.mobileNavLink} ${styles.logoutButton} focus:outline-none`}>
                  Déconnexion
                </button>
                {localUser && localUser.nom && (
                  <span className={styles.mobileUserName}>Bonjour, {localUser.nom}</span>
                )}
                <button onClick={toggleCart} className={`relative focus:outline-none ${styles.mobileCartButton}`}>
                  Panier ({getTotalItems()})
                  {items.length > 0 && (
                    <span className={styles.cartBadge}>{getTotalItems()}</span>
                  )}
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Se connecter</Link>
                <Link to="/register" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>S'inscrire</Link>
              </>
            )}
          </div>
        )}

        {/* Panier déroulant (reste inchangé avec classes CSS) */}
        {isCartOpen && (
          <div className={styles.cartSidebar}>
            <div className={styles.cartHeader}>
              <h2 className={styles.cartTitle}>Votre Panier</h2>
              <button onClick={toggleCart} className={styles.cartCloseButton}>
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M18.27 16.27a1 1 0 01-1.41 1.41L12 13.41l-4.86 4.27a1 1 0 01-1.41-1.41L10.59 12 6.27 7.73a1 1 0 011.41-1.41L12 10.59l4.86-4.27a1 1 0 011.41 1.41L13.41 12l4.86 4.27z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className={styles.cartItems}>
              {items.length > 0 ? (
                <ul>
                  {items.map(item => (
                    <li key={item.id} className={styles.cartItem}>
                      <span className={styles.cartItemName}>{item.nom} ({item.quantite})</span>
                      <span className={styles.cartItemPrice}>{(item.prix * item.quantite).toFixed(2)} {currency}</span>
                      <button onClick={() => removeFromCart(item.id)} className={styles.cartRemoveButton}>
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
              <div className={styles.cartFooter}>
                <p className={styles.cartTotal}>Total: {getTotalPrice().toFixed(2)} {currency}</p>
                <Link to="/cart" onClick={toggleCart} className={styles.viewCartButton}>
                  Voir le panier complet
                </Link>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className={styles.checkoutButton}
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