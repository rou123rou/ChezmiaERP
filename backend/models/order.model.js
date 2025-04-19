// backend/models/order.model.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Le client de la commande est obligatoire'],
      ref: 'Client',
    },
    orderItems: [
      {
        stockItem: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'L\'article de stock de la commande est obligatoire'],
          ref: 'StockItem',
        },
        quantity: {
          type: Number,
          required: [true, 'La quantité commandée est obligatoire'],
          min: [1, 'La quantité doit être au moins 1'],
        },
        unitPrice: { // Ajout du prix unitaire au niveau de la commande
          type: Number,
          required: true,
        },
        itemTotal: { // Ajout du total de l'article au niveau de la commande
          type: Number,
          required: true,
        },
        // Vous pouvez ajouter d'autres détails spécifiques à l'article commandé ici si nécessaire
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    // Vous pouvez ajouter d'autres informations pertinentes pour la commande
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;