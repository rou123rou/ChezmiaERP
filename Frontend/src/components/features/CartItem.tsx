import React from 'react';

interface CartItemProps {
  item: {
    id: string;
    nom: string;
    prix: number;
    quantite: number;
  };
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <tr className="border-b">
      <td className="py-4 px-6">{item.nom}</td>
      <td className="py-4 px-6">{item.prix.toFixed(2)} €</td>
      <td className="py-4 px-6">
        <input
          type="number"
          min="1"
          value={item.quantite}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
          className="w-20 border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </td>
      <td className="py-4 px-6">{(item.prix * item.quantite).toFixed(2)} €</td>
      <td className="py-4 px-6">
        <button
          onClick={() => removeFromCart(item.id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
