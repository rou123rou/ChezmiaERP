const mongoose = require('mongoose');

const stockItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'La quantité en stock est obligatoire'],
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    price: { type: Number, min: 0 },
  },
  {
    timestamps: true, // Ajoute automatiquement les champs createdAt et updatedAt
  }
);

const StockItem = mongoose.model('StockItem', stockItemSchema);

module.exports = StockItem;