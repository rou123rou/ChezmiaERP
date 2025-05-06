import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Utilisez votre hook useAuth

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
    const { user } = useAuth(); // Utilisez votre hook useAuth
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

        if (isValid && user?.token && user?._id) { // Utilisez user._id si c'est ainsi que votre ID client est stocké
            try {
                const orderItems = items.map(item => ({
                    stockItem: item.id, // Assurez-vous que item.id correspond à l'ID du produit (StockItem)
                    quantity: item.quantite,
                    unitPrice: item.prix, // Assurez-vous que item.prix est disponible dans votre contexte de panier
                    itemTotal: item.quantite * item.prix, // Calculer le total de l'article
                }));

                const response = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`, // Envoyer le token d'authentification
                    },
                    body: JSON.stringify({
                        client: user._id, // Utilisez user._id
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
                    navigate('/'); // Rediriger après la commande
                    // Vous pouvez également rediriger vers une page de confirmation de commande
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
        <div className="bg-gray-100 py-10">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Paiement</h2>

                {items.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Récapitulatif de la commande</h3>
                        <ul className="mb-4">
                            {items.map(item => (
                                <li key={item.id} className="py-2 border-b">
                                    {item.nom} - {item.quantite} x {item.prix.toFixed(2)} {currency} = {(item.quantite * item.prix).toFixed(2)} {currency}
                                </li>
                            ))}
                        </ul>
                        <p className="text-lg font-semibold text-gray-700 mb-4">Total: {getTotalPrice().toFixed(2)} {currency}</p>

                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Informations de livraison</h3>
                        <form onSubmit={handleSubmit}>
                            {methodePaiement === 'Paiement à la livraison' && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="adresse" className="block text-gray-700 text-sm font-bold mb-2">
                                            Adresse de livraison
                                        </label>
                                        <input
                                            type="text"
                                            id="adresse"
                                            name="adresse"
                                            value={adresse}
                                            onChange={handleInputChange}
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${adresseError ? 'border-red-500' : ''}`}
                                            placeholder="Votre adresse"
                                            required
                                        />
                                        {adresseError && <p className="text-red-500 text-xs italic">{adresseError}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="ville" className="block text-gray-700 text-sm font-bold mb-2">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            id="ville"
                                            name="ville"
                                            value={ville}
                                            onChange={handleInputChange}
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${villeError ? 'border-red-500' : ''}`}
                                            placeholder="Votre ville"
                                            required
                                        />
                                        {villeError && <p className="text-red-500 text-xs italic">{villeError}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="codePostal" className="block text-gray-700 text-sm font-bold mb-2">
                                            Code Postal (facultatif)
                                        </label>
                                        <input
                                            type="text"
                                            id="codePostal"
                                            name="codePostal"
                                            value={codePostal}
                                            onChange={handleInputChange}
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${codePostalError ? 'border-red-500' : ''}`}
                                            placeholder="Votre code postal"
                                        />
                                        {codePostalError && <p className="text-red-500 text-xs italic">{codePostalError}</p>}
                                    </div>
                                </>
                            )}

                            <div className="mb-4">
                                <label htmlFor="methodePaiement" className="block text-gray-700 text-sm font-bold mb-2">
                                    Méthode de paiement
                                </label>
                                <select
                                    id="methodePaiement"
                                    name="methodePaiement"
                                    value={methodePaiement}
                                    onChange={handlePaymentMethodChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option>Carte de crédit</option>
                                    <option>PayPal</option>
                                    <option>Paiement à la livraison</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 rounded focus:outline-none focus-shadow-outline">Confirmer la commande</Button>
                        </form>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">Votre panier est vide. Veuillez ajouter des articles avant de passer à la caisse.</p>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;