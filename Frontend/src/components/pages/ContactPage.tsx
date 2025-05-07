import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ContactPage.module.css'; // Importez le fichier CSS dédié

function ContactPage() {
    const primaryColor = '#AF5D24';
    const accentColor = '#1976D2';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState<null | 'success' | 'error'>(null); // Correction de type ici

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus(null);

        try {
            // Simuler un envoi de formulaire (remplacez par votre logique d'API réelle)
            console.log('Formulaire soumis:', formData);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler un délai d'envoi

            // Simuler une réponse réussie
            setSubmissionStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Réinitialiser le formulaire

            // Pour simuler une erreur, décommenter la ligne suivante et commenter les précédentes
            // throw new Error('Erreur lors de l\'envoi');

        } catch (error: any) {
            console.error('Erreur lors de l\'envoi du message:', error);
            setSubmissionStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Barre de navigation */}
            <nav className={styles.navigation}>
                <div className={styles.navBrand}>
                    <Link to="/" style={{ color: primaryColor, fontWeight: 'bold', fontSize: '1.5rem' }}>Mia</Link>
                </div>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link to="/" className={styles.navLink}>Accueil</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/products" className={styles.navLink}>Produits</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/recettes" className={styles.navLink}>Recettes</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/a-propos" className={styles.navLink}>À Propos</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/contact" className={styles.navLink} style={{ color: accentColor }}>Contact</Link>
                    </li>
                </ul>
            </nav>

            {/* Section d'en-tête */}
            <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Contactez-nous</h1>
                <p className={styles.heroSubtitle}>Nous sommes là pour répondre à toutes vos questions et demandes.</p>
            </section>

            {/* Section de formulaire et informations */}
            <section className={styles.contactSection}>
                <div className={styles.contactForm}>
                    <h2 className={styles.sectionTitle}>Envoyez-nous un message</h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Nom:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={styles.input}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="subject" className={styles.label}>Sujet:</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                className={styles.input}
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.label}>Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                className={styles.textarea}
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        </button>
                    </form>
                </div>

                <div className={styles.contactInfo}>
                    <h2 className={styles.sectionTitle}>Informations de contact</h2>
                    <p>N'hésitez pas à nous contacter par les moyens suivants :</p>
                    <ul className={styles.infoList}>
                        <li className={styles.infoItem}>
                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h14a2 2 0 012 2v4h-2M5 7h2m9-2h2m-9 9h2m-2-9h2m4 4h-2M6 9a2 2 0 01-2 2v7a2 2 0 012 2h10a2 2 0 012-2v-7a2 2 0 01-2-2H5z" />
                            </svg>
                            ☎️ Téléphone: +216 55 341 527
                        </li>
                        <li className={styles.infoItem}>
                            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            📩 Email: contact.chezmia@gmail.com
                        </li>
                        {/* Vous pouvez ajouter d'autres informations */}
                    </ul>
                </div>
            </section>

            {submissionStatus && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            {submissionStatus === 'success' ? 'Message Envoyé !' : 'Erreur'}
                        </h2>
                        <p className={styles.modalMessage}>
                            {submissionStatus === 'success'
                                ? 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
                                : 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'}
                        </p>
                        <button onClick={() => setSubmissionStatus(null)} className={styles.modalButton}>Fermer</button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <p>&copy; 2025 Mia. Tous droits réservés.</p>
                    <ul className={styles.footerLinks}>
                        <li><Link to="/conditions-generales">Conditions Générales</Link></li>
                        <li><Link to="/politique-de-confidentialite">Politique de Confidentialité</Link></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}

export default ContactPage;