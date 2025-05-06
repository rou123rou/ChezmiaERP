import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth'; // Importez le hook d'authentification
import { CSSProperties } from 'react';

interface EditProfileFormProps {
    initialData: any; // À typer plus précisément
    onSave: (updatedData: any) => void;
    onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onSave, onCancel }) => {
    const [nom, setNom] = useState(initialData?.nom || '');
    const [prenom, setPrenom] = useState(initialData?.prenom || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Récupérez l'objet utilisateur (contenant le token)

    const primaryColor = '#AF5D24'; // Orange terreux
    const secondaryColor = '#F9FAFB'; // Blanc cassé
    const textColor = '#333'; // Noir pour le texte principal
    const montserratFont = 'Montserrat, sans-serif';
    const errorColor = '#D32F2F'; // Rouge pour l'erreur
    const shadowColor = 'rgba(0, 0, 0, 0.1)';
    const focusRingColor = '#64B5F6'; // Bleu clair pour l'effet de focus

    const formStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    };

    const inputGroupStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
    };

    const labelStyle: CSSProperties = {
        color: textColor,
        fontSize: '0.9rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        fontFamily: montserratFont,
    };

    const inputStyle: CSSProperties = {
        padding: '0.75rem',
        borderRadius: '5px',
        border: `1px solid #ccc`,
        boxShadow: `inset 0 1px 3px ${shadowColor}`,
        fontFamily: montserratFont,
        color: textColor,
    };

    const focusInputStyle: CSSProperties = {
        outline: 'none',
        borderColor: focusRingColor,
        boxShadow: `0 0 0 0.2rem rgba(100, 181, 246, 0.25)`,
    };

    const errorTextStyle: CSSProperties = {
        color: errorColor,
        marginBottom: '1rem',
        fontFamily: montserratFont,
    };

    const buttonContainerStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
    };

    const cancelButtonStyle: CSSProperties = {
        backgroundColor: '#E0E0E0',
        color: textColor,
        fontWeight: 'bold',
        padding: '0.75rem 1.25rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: montserratFont,
        transition: 'background-color 0.2s ease-in-out',
    };

    const cancelButtonHoverStyle: CSSProperties = {
        backgroundColor: '#BDBDBD',
    };

    const saveButtonStyle: CSSProperties = {
        backgroundColor: primaryColor,
        color: secondaryColor,
        fontWeight: 'bold',
        padding: '0.75rem 1.25rem',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: montserratFont,
        transition: 'background-color 0.2s ease-in-out',
    };

    const saveButtonHoverStyle: CSSProperties = {
        backgroundColor: '#8C4B1A',
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!user?.token) {
                setError('Non authentifié.');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT', // Ou 'PATCH' selon votre route backend
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ nom, prenom, email }),
            });

            if (response.ok) {
                const updatedProfileData = await response.json();
                onSave(updatedProfileData); // Appelez la fonction onSave pour mettre à jour l'état dans ProfilePage
            } else {
                const errorData = await response.json();
                setError(errorData?.message || `Erreur lors de la mise à jour du profil: ${response.status}`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            {error && <div style={errorTextStyle}>{error}</div>}
            <div style={inputGroupStyle}>
                <label htmlFor="nom" style={labelStyle}>Nom:</label>
                <input
                    type="text"
                    id="nom"
                    style={inputStyle}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusInputStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                />
            </div>
            <div style={inputGroupStyle}>
                <label htmlFor="prenom" style={labelStyle}>Prénom:</label>
                <input
                    type="text"
                    id="prenom"
                    style={inputStyle}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusInputStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                />
            </div>
            <div style={inputGroupStyle}>
                <label htmlFor="email" style={labelStyle}>Email:</label>
                <input
                    type="email"
                    id="email"
                    style={inputStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusInputStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                />
            </div>
            <div style={buttonContainerStyle}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={cancelButtonStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, cancelButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, cancelButtonStyle)}
                    disabled={loading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    style={saveButtonStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, saveButtonHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, saveButtonStyle)}
                    disabled={loading}
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm;