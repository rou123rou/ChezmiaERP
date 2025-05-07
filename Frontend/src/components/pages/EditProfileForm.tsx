import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth'; // Importez le hook d'authentification
import styles from './EditProfileForm.module.css'; // Importez le fichier CSS module

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
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorText}>{error}</div>}
            <div className={styles.inputGroup}>
                <label htmlFor="nom" className={styles.label}>Nom:</label>
                <input
                    type="text"
                    id="nom"
                    className={styles.input}
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="prenom" className={styles.label}>Prénom:</label>
                <input
                    type="text"
                    id="prenom"
                    className={styles.input}
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email:</label>
                <input
                    type="email"
                    id="email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className={styles.buttonContainer}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelButton}
                    disabled={loading}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={loading}
                >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm;