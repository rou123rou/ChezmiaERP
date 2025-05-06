import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';
import styles from './CartPage.module.css'; // Importez le fichier CSS module

function CartPage() {
    const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
    const currency = 'DT'; // Dinar Tunisien

    return (
        <div className={styles.container}>
            <div className={styles.cartContainer}>
                <h2 className={styles.title}>Votre Panier</h2>

                {items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.th}>
                                    <th className={styles.th} style={{ textAlign: 'left' }}>Produit</th>
                                    <th className={styles.th} style={{ textAlign: 'left' }}>Prix</th>
                                    <th className={styles.th} style={{ textAlign: 'left' }}>Quantité</th>
                                    <th className={styles.th} style={{ textAlign: 'left' }}>Total</th>
                                    <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className={styles.td}>
                                        <td className={styles.productName}>{item.nom}</td>
                                        <td className={styles.price}>{item.prix.toFixed(2)} {currency}</td>
                                        <td className={styles.td} style={{ display: 'flex', alignItems: 'center' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantite - 1))}
                                                className={styles.quantityButton}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantite}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className={styles.quantityInput}
                                            />
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantite + 1)}
                                                className={styles.quantityButton}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td className={styles.total}>{(item.prix * item.quantite).toFixed(2)} {currency}</td>
                                        <td className={styles.td} style={{ textAlign: 'right' }}>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className={styles.actionsButton}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.cartActions}>
                            <button
                                onClick={clearCart}
                                className={styles.clearCartButton}
                            >
                                Vider le panier
                            </button>
                            <div style={{ textAlign: 'right' }}>
                                <p className={styles.total} style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                    Total: {getTotalPrice().toFixed(2)} {currency}
                                </p>
                                <Link to="/checkout" style={{ display: 'inline-block' }}>
                                    <Button className={styles.checkoutButton}>Passer à la caisse</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className={styles.emptyCartText}>Votre panier est vide.</p>
                )}
            </div>
        </div>
    );
}

export default CartPage;