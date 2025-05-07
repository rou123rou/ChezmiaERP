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
    const navigate = useNavigate();
    const { user } = useAuth();
    const currency = 'DT'; // Dinar Tunisien

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setAdresseError(null);
        setVilleError(null);
        setCodePostalError(null);

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
            return;
        }

        if (items.length === 0) {
            alert('Votre panier est vide. Veuillez ajouter des articles avant de passer à la caisse.');
            isValid = false;
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
                    alert('Votre commande a été enregistrée avec succès !');
                    navigate('/');
                } else {
                    const errorData = await response.json();
                    console.error('Erreur lors de l\'enregistrement de la commande :', errorData);
                    alert('Erreur lors de l\'enregistrement de la commande.');
                }
            } catch (error: any) {
                console.error('Erreur réseau lors de l\'enregistrement de la commande :', error);
                alert('Erreur réseau lors de l\'enregistrement de la commande.');
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

                            <Button type="submit" className={styles.confirmButton}>Confirmer la commande</Button>
                        </form>
                    </div>
                ) : (
                    <p className={styles.emptyCartMessage}>Votre panier est vide. Veuillez ajouter des articles avant de passer à la caisse.</p>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;