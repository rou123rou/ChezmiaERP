import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import ProductList from './components/pages/ProductList';
import ProductDetail from './components/pages/ProductDetail';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import AboutPage from './components/pages/AboutPage'; // Importez le composant AboutPage
import Layout from './components/layout/Layout';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import PrivateRoute from './components/auth/PrivateRoute';
import ContactPage from './components/pages/ContactPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <ProductsProvider>
                        <CategoriesProvider>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/products" element={<ProductList />} />
                                    <Route path="/products/:id" element={<ProductDetail />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/profil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                                    <Route path="/a-propos" element={<AboutPage />} /> 
                                    <Route path="/contact" element={<ContactPage />} />
                                    {/* Ajoutez cette route */}
                                </Routes>
                            </Layout>
                        </CategoriesProvider>
                    </ProductsProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;