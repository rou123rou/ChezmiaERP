import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import EditProfileForm from '../pages/EditProfileForm';
import styles from './ProfilPage.module.css'; // Assurez-vous que le nom du fichier CSS est correct

function ProfilePage() {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { user } = useAuth();

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
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    };

    const handleSaveEdit = (updatedData: any) => {
        setProfileData(updatedData);
        setIsEditDialogOpen(false);
        // Ici, vous pouvez également re-fetch les données du profil si nécessaire
    };

    if (loading) {
        return <div className={styles.loading}>Chargement du profil...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>Mon Profil</h1>
                <div className={styles.profileCard}>
                    <div className={styles.profileInfo}>
                        <p><strong className={styles.label}>Nom:</strong> {profileData?.nom}</p>
                        <p><strong className={styles.label}>Prénom:</strong> {profileData?.prenom}</p>
                        <p><strong className={styles.label}>Email:</strong> {profileData?.email}</p>
                        {profileData?.telephone && <p><strong className={styles.label}>Téléphone:</strong> {profileData?.telephone}</p>}
                        {profileData?.adresse && <p><strong className={styles.label}>Adresse:</strong> {profileData?.adresse}</p>}
                    </div>
                    <button onClick={handleEditClick} className={styles.editButton}>
                        Modifier le Profil
                    </button>
                </div>
                {profileData?.isVIP && <div className={styles.vipBadge}>Client VIP</div>}
                {profileData?.estFidele && <div className={styles.fideleBadge}>Client Fidèle</div>}
                {profileData?.commandesPassees > 0 && <p className={styles.commandes}>Vous avez passé {profileData.commandesPassees} commandes.</p>}
                <div className={styles.recentActivitySection}>
                    <h2 className={styles.sectionTitle}>Vos Activités Récentes</h2>
                    <p className={styles.noActivity}>Ici seront affichés vos avis et recettes partagés.</p>
                    {/* Implémentation de l'affichage des activités de l'utilisateur ici */}
                </div>

                {isEditDialogOpen && (
                    <div className={styles.editDialogOverlay}>
                        <div className={styles.editDialog}>
                            <h2 className={styles.dialogTitle}>Modifier le Profil</h2>
                            <EditProfileForm
                                initialData={profileData}
                                onSave={handleSaveEdit}
                                onCancel={handleCloseEditDialog}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;