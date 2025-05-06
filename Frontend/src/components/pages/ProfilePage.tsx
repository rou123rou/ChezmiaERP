import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import EditProfileForm from '../pages/EditProfileForm'; // Importez le formulaire d'édition
import { Link } from 'react-router-dom';

function ProfilePage() {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false); // Contrôle l'affichage du formulaire d'édition
    const [isSharing, setIsSharing] = useState(false); // Contrôle l'affichage de la zone de partage d'avis
    const [avisText, setAvisText] = useState('');
    const { user } = useAuth(); // Correction ici

    const primaryColor = '#AF5D24'; // Orange terreux
    const secondaryColor = '#F9FAFB'; // Blanc cassé
    const accentColor = '#558B2F'; // Vert olive foncé (pour l'accent)
    const textColor = '#333'; // Noir (pour le texte principal)
    const headingColor = '#000'; // Noir gras pour les titres
    const montserratFont = 'Montserrat, sans-serif';

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user?.token) {
                    setError('Non authentifié.');
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData?.message || `Erreur lors de la récupération du profil: ${response.status}`);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.token]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = (updatedData: any) => {
        console.log('Données mises à jour:', updatedData);
        setProfileData({ ...profileData, ...updatedData }); // Mettre à jour l'état local
        setIsEditing(false);
        // Ici, vous appellerez votre API pour enregistrer les modifications
    };

    const handleShareClick = () => {
        setIsSharing(true);
    };

    const handleCancelShare = () => {
        setIsSharing(false);
        setAvisText('');
    };

    const handlePostAvis = () => {
        // Ici, vous appellerez votre API pour enregistrer l'avis de l'utilisateur
        console.log('Avis à partager:', avisText);
        setIsSharing(false);
        setAvisText('');
        // Après le partage réussi, vous pourriez refetch les avis de l'utilisateur
    };

    const sectionTitleStyle = {
        color: headingColor,
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
        fontFamily: montserratFont,
        borderBottom: `2px solid ${primaryColor}`,
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
    };

    const buttonStyle = {
        backgroundColor: primaryColor,
        color: secondaryColor,
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
        fontFamily: montserratFont,
    };

    const buttonHoverStyle = {
        backgroundColor: '#8C4B1A', // Assombrissement au survol
    };

    const accentButtonStyle = {
        ...buttonStyle,
        backgroundColor: accentColor,
    };

    const accentButtonHoverStyle = {
        backgroundColor: '#41691E', // Assombrissement au survol de l'accent
    };

    const cardStyle = {
        backgroundColor: secondaryColor,
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    };

    return (
        <div className="py-8" style={{ backgroundColor: secondaryColor, fontFamily: montserratFont, color: textColor }}>
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
                {/* Section Profil Principal */}
                <div className="rounded-lg p-6" style={{ ...cardStyle }}>
                    <h2 style={{ ...sectionTitleStyle }}>Profil Principal</h2>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 style={{ color: headingColor, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)', fontFamily: montserratFont }}>{profileData?.prenom} {profileData?.nom}</h3>
                            <p className="text-gray-600">{profileData?.email}</p>
                        </div>
                        <div>
                            {!isEditing ? (
                                <button
                                    onClick={handleEditClick}
                                    className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                    style={accentButtonStyle}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, accentButtonHoverStyle)}
                                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, accentButtonStyle)}
                                >
                                    Modifier le Profil
                                </button>
                            ) : (
                                <EditProfileForm
                                    initialData={profileData}
                                    onSave={handleSaveEdit}
                                    onCancel={handleCancelEdit}
                                />
                            )}
                            <Link to="/avis/mes-avis" className="text-indigo-500 hover:text-indigo-700">Voir mes avis</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {profileData?.isVIP && (
                            <span className="inline-flex items-center bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full px-2 py-1">Client VIP</span>
                        )}
                        {profileData?.estFidele && (
                            <span className="inline-flex items-center bg-green-200 text-green-800 text-xs font-bold rounded-full px-2 py-1">Client Fidèle</span>
                        )}
                        {profileData?.commandesPassees > 0 && (
                            <p className="text-gray-600">Commandes passées: {profileData.commandesPassees}</p>
                        )}
                    </div>
                </div>

                {/* Section Partager un Avis/Recette */}
                <div className="rounded-lg p-6" style={{ ...cardStyle }}>
                    <h2 style={{ ...sectionTitleStyle }}>Partager votre expérience ou recette</h2>
                    {!isSharing ? (
                        <button
                            onClick={handleShareClick}
                            className="w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            style={buttonStyle}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
                            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
                        >
                            Partager quelque chose...
                        </button>
                    ) : (
                        <div>
                            <textarea
                                value={avisText}
                                onChange={(e) => setAvisText(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline mb-2"
                                rows={4}
                                placeholder="Partagez votre expérience ou une recette avec nos chamias..."
                                style={{ fontFamily: montserratFont }}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleCancelShare}
                                    className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    style={{ backgroundColor: '#E0E0E0', color: textColor }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BDBDBD')}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E0E0E0')}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handlePostAvis}
                                    className="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    style={buttonStyle}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
                                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
                                >
                                    Publier sur mon mur
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section Activités Récentes */}
                <div className="rounded-lg p-6" style={{ ...cardStyle }}>
                    <h2 style={{ ...sectionTitleStyle }}>Vos Activités Récentes</h2>
                    <p className="text-gray-500" style={{ fontFamily: montserratFont }}>Ici seront affichés vos avis et recettes partagés.</p>
                    {/* Implémentation de l'affichage des activités de l'utilisateur ici */}
                </div>

                {/* Future Section : Mes Recettes Partagées (si vous souhaitez l'ajouter) */}
                {/* <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 style={{ ...sectionTitleStyle }}>Mes Recettes Partagées</h2>
                    <p className="text-gray-500" style={{ fontFamily: montserratFont }}>Ici seront affichées les recettes que vous avez partagées.</p>
                    {/* Implémentation de l'affichage des recettes ici }
                </div> */}
            </div>
        </div>
    );
}

export default ProfilePage;