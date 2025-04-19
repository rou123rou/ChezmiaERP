// backend/controllers/orderController.js
const Order = require('../models/order.model');
const Client = require('../models/clientModel');
const StockItem = require('../models/stockItem.model');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer toutes les commandes
// @route   GET /api/orders
// @access  Private (à définir selon vos besoins)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('client', 'nom prenom email') // Inclure les détails du client
    .populate('orderItems.stockItem', 'name price'); // Inclure les détails des articles
  res.status(200).json(orders);
});

// @desc    Récupérer une commande par ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('client', 'nom prenom email')
    .populate('orderItems.stockItem', 'name price');

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'Commande non trouvée' });
  }
});

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { client, orderItems } = req.body;

  // Vérifier si le client existe
  const existingClient = await Client.findById(client);
  if (!existingClient) {
    res.status(400).json({ message: 'Client non valide' });
    return;
  }

  let totalAmount = 0;
  const populatedOrderItems = [];

  for (const item of orderItems) {
    const stockItem = await StockItem.findById(item.stockItem);
    if (!stockItem) {
      res.status(400).json({ message: `Article de stock non valide: ${item.stockItem}` });
      return;
    }
    if (stockItem.quantity < item.quantity) {
      res.status(400).json({ message: `Quantité insuffisante en stock pour: ${stockItem.name}` });
      return;
    }
    const unitPrice = stockItem.price;
    const itemTotal = unitPrice * item.quantity;
    totalAmount += itemTotal;
    populatedOrderItems.push({
      stockItem: stockItem._id,
      quantity: item.quantity,
      unitPrice: unitPrice, // Ajouter le prix unitaire à la commande
      itemTotal: itemTotal, // Ajouter le total de l'article à la commande
    });

    // Déduire la quantité du stock (idéalement dans une transaction)
    stockItem.quantity -= item.quantity;
    await stockItem.save();
  }

  const order = await Order.create({
    client,
    orderItems: populatedOrderItems,
    totalAmount,
  });

  if (order) {
    res.status(201).json(order);
  } else {
    res.status(400).json({ message: 'Erreur lors de la création de la commande' });
  }
});

// @desc    Mettre à jour une commande
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Vous pouvez choisir les champs à mettre à jour ici
    order.status = req.body.status || order.status;
    // Attention : La mise à jour des orderItems et du client peut nécessiter une logique plus complexe
    // impliquant la gestion du stock.

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Commande non trouvée' });
  }
});

// @desc    Supprimer une commande
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Commande non trouvée');
  }

  // Ici, vous pourriez envisager de réintégrer les quantités au stock si la commande est annulée
  // ou supprimée avant l'expédition.

  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Commande supprimée avec succès' });
});

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};