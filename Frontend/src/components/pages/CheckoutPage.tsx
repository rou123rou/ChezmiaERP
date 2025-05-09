import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './CheckoutPage.module.css'; // Importez le fichier CSS module

interface ShippingAddress {
    adresse: string;
    ville: string;
    codePostal: string;
}

function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCart();
    const [adresse, setAdresse] = useState('');
    const [ville, setVille] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [methodePaiement, setMethodePaiement] = useState('Paiement à la livraison'); // Valeur par défaut
    const [adresseError, setAdresseError] = useState<string | null>(null);
    const [villeError, setVilleError] = useState<string | null>(null);
    const [codePostalError, setCodePostalError] = useState<string | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<null | 'success' | 'error'>(null); // Ajout de l'état pour le pop-up
    const [isSubmitting, setIsSubmitting] = useState(false); // Ajout de l'état pour l'envoi en cours
    const navigate = useNavigate();
    const { user } = useAuth();
    const currency = 'DT'; // Dinar Tunisien

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setAdresseError(null);
        setVilleError(null);
        setCodePostalError(null);
        setIsSubmitting(true); // Indiquer que l'envoi est en cours
        setSubmissionStatus(null); // Réinitialiser le statut

        let isValid = true;
        let shippingAddress: ShippingAddress | null = null;

        if (methodePaiement === 'Paiement à la livraison') {
            if (!adresse.trim()) {
                setAdresseError('L\'adresse de livraison est requise.');
                isValid = false;
            }
            if (!ville.trim()) {
                setVilleError('La ville est requise.');
                isValid = false;
            }
            shippingAddress = { adresse, ville, codePostal };
        } else {
            console.log(`Redirection pour paiement par ${methodePaiement}`);
            alert(`Redirection pour paiement par ${methodePaiement} (non implémenté).`);
            clearCart();
            navigate('/');
            setIsSubmitting(false); // Réinitialiser l'état d'envoi
            return;
        }

        if (items.length === 0) {
            alert('Votre panier est vide. Veuillez ajouter des articles avant de passer à la caisse.');
            isValid = false;
            setIsSubmitting(false); // Réinitialiser l'état d'envoi
            return;
        }

        if (isValid && user?.token && user?._id) {
            try {
                const orderItems = items.map(item => ({
                    stockItem: item.id,
                    quantity: item.quantite,
                    unitPrice: item.prix,
                    itemTotal: item.quantite * item.prix,
                }));
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const response = await fetch(`${backendUrl}/api/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        client: user._id,
                        orderItems: orderItems,
                        shippingAddress: shippingAddress,
                        paymentMethod: methodePaiement,
                        totalAmount: getTotalPrice(),
                    }),
                });

                if (response.ok) {
                    console.log('Commande enregistrée avec succès !');
                    clearCart();
                    setSubmissionStatus('success'); // Afficher le pop-up de succès
                    // Pas de redirection immédiate ici, le pop-up s'affichera
                } else {
                    const errorData = await response.json();
                    console.error('Erreur lors de l\'enregistrement de la commande :', errorData);
                    setSubmissionStatus('error'); // Afficher le pop-up d'erreur
                }
            } catch (error: any) {
                console.error('Erreur réseau lors de l\'enregistrement de la commande :', error);
                setSubmissionStatus('error'); // Afficher le pop-up d'erreur
            } finally {
                setIsSubmitting(false); // Réinitialiser l'état d'envoi
            }
        }
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMethodePaiement(event.target.value);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'adresse') setAdresse(value);
        else if (name === 'ville') setVille(value);
        else if (name === 'codePostal') setCodePostal(value);
    };

    return (
        <div className={styles.checkoutContainer}>
            <div className={styles.checkoutFormWrapper}>
                <h2 className={styles.checkoutTitle}>Paiement</h2>

                {items.length > 0 ? (
                    <div>
                        <h3 className={styles.orderSummaryTitle}>Récapitulatif de la commande</h3>
                        <ul className={styles.orderSummaryList}>
                            {items.map(item => (
                                <li key={item.id} className={styles.orderSummaryItem}>
                                    <span>{item.nom} - {item.quantite} x {item.prix.toFixed(2)} {currency}</span>
                                    <span>{(item.quantite * item.prix).toFixed(2)} {currency}</span>
                                </li>
                            ))}
                        </ul>
                        <p className={styles.totalAmount}>Total: {getTotalPrice().toFixed(2)} {currency}</p>

                        <h3 className={styles.deliveryInfoTitle}>Informations de livraison</h3>
                        <form onSubmit={handleSubmit}>
                            {methodePaiement === 'Paiement à la livraison' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="adresse" className={styles.label}>
                                            Adresse de livraison
                                        </label>
                                        <input
                                            type="text"
                                            id="adresse"
                                            name="adresse"
                                            value={adresse}
                                            onChange={handleInputChange}
                                            className={`${styles.input} ${adresseError ? styles.inputError : ''}`}
                                            placeholder="Votre adresse"
                                            required
                                        />
                                        {adresseError && <p className={styles.errorMessage}>{adresseError}</p>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="ville" className={styles.label}>
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            id="ville"
                                            name="ville"
                                            value={ville}
                                            onChange={handleInputChange}
                                            className={`${styles.input} ${villeError ? styles.inputError : ''}`}
                                            placeholder="Votre ville"
                                            required
                                        />
                                        {villeError && <p className={styles.errorMessage}>{villeError}</p>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="codePostal" className={styles.label}>
                                            Code Postal (facultatif)
                                        </label>
                                        <input
                                            type="text"
                                            id="codePostal"
                                            name="codePostal"
                                            value={codePostal}
                                            onChange={handleInputChange}
                                            className={`${styles.input} ${codePostalError ? styles.inputError : ''}`}
                                            placeholder="Votre code postal"
                                        />
                                        {codePostalError && <p className={styles.errorMessage}>{codePostalError}</p>}
                                    </div>
                                </>
                            )}

                            <div className={styles.formGroup}>
                                <label htmlFor="methodePaiement" className={styles.label}>
                                    Méthode de paiement
                                </label>
                                <select
                                    id="methodePaiement"
                                    name="methodePaiement"
                                    value={methodePaiement}
                                    onChange={handlePaymentMethodChange}
                                    className={styles.select}
                                >
                                    <option>Carte de crédit</option>
                                    <option>PayPal</option>
                                    <option>Paiement à la livraison</option>
                                </select>
                            </div>

                            <Button type="submit" className={styles.confirmButton} disabled={isSubmitting}>
                                {isSubmitting ? 'Envoi en cours...' : 'Confirmer la commande'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <p className={styles.emptyCartMessage}>Votre panier est vide. Veuillez ajouter des articles avant de passer à la caisse.</p>
                )}
            </div>

            {submissionStatus && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            {submissionStatus === 'success' ? 'Commande Enregistrée !' : 'Erreur'}
                        </h2>
                        <p className={styles.modalMessage}>
                            {submissionStatus === 'success'
                                ? 'Votre commande a été enregistrée avec succès. Vous recevrez une confirmation par email.'
                                : 'Une erreur est survenue lors de l\'enregistrement de votre commande. Veuillez réessayer.'}
                        </p>
                        <button onClick={() => {
                            setSubmissionStatus(null);
                            if (submissionStatus === 'success') {
                                navigate('/'); // Rediriger vers l'accueil après succès
                            }
                        }} className={styles.modalButton}>Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;