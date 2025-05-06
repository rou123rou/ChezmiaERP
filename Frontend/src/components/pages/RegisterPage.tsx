import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Importation correcte du hook useAuth
import FormField from '../common/FormField';
import Notification from '../common/Notification';
import { CSSProperties } from 'react';

function RegisterPage() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState(''); // Ajout du champ prénom
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null); // Renommé pour éviter la confusion avec l'erreur du hook
    const [loading, setLoading] = useState(false);
    const { signup, error: authError } = useAuth(); // Utilisez l'erreur du hook sous un autre nom
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning' | 'info'>('error');

    const primaryColor = '#AF5D24'; // Orange terreux
    const secondaryColor = '#F9FAFB'; // Blanc cassé
    const textColor = '#333'; // Noir pour le texte principal
    const montserratFont = 'Montserrat, sans-serif';
    const shadowColor = 'rgba(0, 0, 0, 0.1)';
    const errorColor = '#D32F2F';

    const containerStyle: CSSProperties = {
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

    const cardStyle: CSSProperties = {
        maxWidth: '30rem',
        width: '100%',
        backgroundColor: secondaryColor,
        boxShadow: `0 4px 8px ${shadowColor}`,
        borderRadius: '8px',
        padding: '2rem',
    };

    const titleStyle: CSSProperties = {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#2E7D32', // Vert plus foncé
        marginBottom: '1.5rem',
        textAlign: 'center',
        textShadow: `1px 1px 2px ${shadowColor}`,
    };

    const formStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    };

    const errorTextStyle: CSSProperties = {
        color: errorColor,
        fontSize: '0.9rem',
        fontStyle: 'italic',
        marginTop: '0.5rem',
        fontFamily: montserratFont,
    };

    const submitButtonStyle: CSSProperties = {
        backgroundColor: '#2E7D32', // Vert plus foncé
        color: secondaryColor,
        fontWeight: 'bold',
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        fontFamily: montserratFont,
    };

    const submitButtonHoverStyle: CSSProperties = {
        backgroundColor: '#1B5E20', // Vert encore plus foncé
    };

    const loginTextStyle: CSSProperties = {
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: textColor,
        fontFamily: montserratFont,
    };

    const loginLinkStyle: CSSProperties = {
        color: primaryColor,
        fontWeight: 'bold',
        textDecoration: 'underline',
        transition: 'color 0.2s ease-in-out',
    };

    const loginLinkHoverStyle: CSSProperties = {
        color: '#8C4B1A', // Assombrissement au survol
    };

    const handleSubmit = async (event: React.FormEvent) => {
        console.log('handleSubmit appelé'); // LOG AJOUTÉ
        event.preventDefault();
        if (password !== confirmPassword) {
            setLocalError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        setLocalError(null);
        console.log('Tentative d\'inscription avec les données :', { nom, prenom, email, password }); // LOG AJOUTÉ
        const success = await signup(nom, prenom, email, password); // Incluez le prénom
        setLoading(false);
        if (success) {
            setNotificationType('success');
            setNotificationMessage(
                'Votre compte a été créé avec succès. Veuillez vous connecter.'
            );
            setShowNotification(true);
            setTimeout(() => navigate('/login'), 3000);
        } else if (authError) {
            setNotificationType('error');
            setNotificationMessage(authError);
            setShowNotification(true);
        }
    };

    const handleCloseNotification = () => {
        setShowNotification(false);
        setNotificationMessage('');
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Créer un compte chez Mia</h2>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <FormField
                        label="Nom"
                        id="nom"
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Votre nom"
                        required
                    />
                    <FormField
                        label="Prénom"
                        id="prenom"
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        placeholder="Votre prénom"
                        required
                    />
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
                    <FormField
                        label="Confirmer le mot de passe"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmer votre mot de passe"
                        required
                    />

                    {localError && <p style={errorTextStyle}>{localError}</p>}

                    <button
                        type="submit"
                        style={submitButtonStyle}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, submitButtonHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, submitButtonStyle)}
                        disabled={loading}
                    >
                        {loading ? 'Création du compte...' : 'Créer un compte'}
                    </button>

                    <div style={loginTextStyle}>
                        <Link
                            to="/login"
                            style={loginLinkStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, loginLinkHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, loginLinkStyle)}
                        >
                            Se connecter
                        </Link>
                    </div>
                </form>

                {showNotification && (
                    <Notification
                        message={notificationMessage}
                        type={notificationType}
                        onClose={handleCloseNotification}
                        duration={notificationType === 'success' ? 3000 : 5000}
                    />
                )}
            </div>
        </div>
    );
}

export default RegisterPage;