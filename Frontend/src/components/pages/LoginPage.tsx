// components/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '../common/Button';
import FormField from '../common/FormField';
import Notification from '../common/Notification';
import styles from './LoginPage.module.css'; // Importez le fichier CSS module

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, loading, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('error');

    const primaryColor = '#AF5D24'; // Orange terreux
    const secondaryColor = '#F9FAFB'; // Blanc cassé
    const textColor = '#333'; // Noir pour le texte principal
    const montserratFont = 'Montserrat, sans-serif';
    const shadowColor = 'rgba(0, 0, 0, 0.1)';
    
  

    const containerStyle: React.CSSProperties = {
        backgroundColor: secondaryColor,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        fontFamily: montserratFont,
    };

    const cardStyle: React.CSSProperties = {
        maxWidth: '30rem',
        width: '100%',
        backgroundColor: secondaryColor,
        boxShadow: `0 4px 8px ${shadowColor}`,
        borderRadius: '8px',
        padding: '2rem',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: primaryColor,
        marginBottom: '1.5rem',
        textAlign: 'center',
        textShadow: `1px 1px 2px ${shadowColor}`,
    };

    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    };

   

   

    const createAccountTextStyle: React.CSSProperties = {
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: textColor,
    };

    const createAccountLinkStyle: React.CSSProperties = {
        color: primaryColor,
        fontWeight: 'bold',
        textDecoration: 'underline',
        transition: 'color 0.2s ease-in-out',
    };

    const createAccountLinkHoverStyle: React.CSSProperties = {
        color: '#8C4B1A', // Assombrissement au survol
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
        setNotificationMessage('');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const success = await login(email, password);
        if (error) {
            setNotificationMessage(error);
            setShowNotification(true);
            setNotificationType('error');
            console.log('LoginPage - handleSubmit - Login failed:', error);
        }
        if (success) {
            // La navigation se fera dans l'useEffect après la mise à jour de isAuthenticated
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Se connecter à Mia</h2>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <FormField
                        label="Adresse e-mail"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre adresse e-mail"
                        required
                    />
                    <FormField
                        label="Mot de passe"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe"
                        required
                    />

                    <Button
                        type="submit"
                        className={styles.submitButton} // Utilisez la classe CSS
                        disabled={loading}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>

                    <div style={createAccountTextStyle}>
                        <Link
                            to="/register"
                            style={createAccountLinkStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, createAccountLinkHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, createAccountLinkStyle)}
                        >
                            Créer un compte
                        </Link>
                    </div>
                </form>

                {showNotification && (
                    <Notification
                        message={notificationMessage}
                        type={notificationType}
                        onClose={handleCloseNotification}
                        duration={5000}
                    />
                )}
            </div>
        </div>
    );
}

export default LoginPage;