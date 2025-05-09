import React, { useState, useEffect } from 'react';
import styles from './EditProfileForm.module.css'; // Conservez vos styles de formulaire

interface EditProfileFormProps {
    initialData: any; // Les données du client connecté
    onSave: (updatedData: any) => void;
    onCancel: () => void;
    token: string | null | undefined; // Pour l'authentification
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onSave, onCancel, token }) => {
    const [nom, setNom] = useState(initialData?.nom || '');
    const [prenom, setPrenom] = useState(initialData?.prenom || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [telephone, setTelephone] = useState(initialData?.telephone || '');
    const [adresse, setAdresse] = useState(initialData?.adresse || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mise à jour de l'état local lorsque initialData change (pour les modifications externes)
    useEffect(() => {
        setNom(initialData?.nom || '');
        setPrenom(initialData?.prenom || '');
        setEmail(initialData?.email || '');
        setTelephone(initialData?.telephone || '');
        setAdresse(initialData?.adresse || '');
    }, [initialData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                setError('Non authentifié.');
                setLoading(false);
                return;
            }

            const response = await fetch('https://chezmiaerpbackend.onrender.com/api/profile', { // Correction de l'endpoint
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ nom, prenom, email, telephone, adresse }),
            });

            if (response.ok) {
                const updatedProfileData = await response.json();
                onSave(updatedProfileData);
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
                <input type="text" id="nom" className={styles.input} value={nom} onChange={(e) => setNom(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="prenom" className={styles.label}>Prénom:</label>
                <input type="text" id="prenom" className={styles.input} value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email:</label>
                <input type="email" id="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="telephone" className={styles.label}>Téléphone:</label>
                <input type="tel" id="telephone" className={styles.input} value={telephone} onChange={(e) => setTelephone(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="adresse" className={styles.label}>Adresse:</label>
                <input type="text" id="adresse" className={styles.input} value={adresse} onChange={(e) => setAdresse(e.target.value)} />
            </div>
            <div className={styles.buttonContainer}>
                <button type="button" onClick={onCancel} className={styles.cancelButton} disabled={loading}>
                    Annuler
                </button>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm;