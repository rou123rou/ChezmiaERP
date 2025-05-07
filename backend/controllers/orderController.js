const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');
const Client = require('../models/clientModel');
const StockItem = require('../models/stockItem.model');

// @desc    Créer une nouvelle commande à partir du panier
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const cartItems = req.session.cart ? req.session.cart.items : [];
  const client = req.user._id; // L'ID de l'utilisateur connecté via le middleware protect

  if (!client) {
    res.status(401).json({ message: 'Utilisateur non authentifié.' });
    return;
  }

  if (cartItems.length === 0) {
    res.status(400).json({ message: 'Votre panier est vide.' });
    return;
  }

  let calculatedTotalAmount = 0;
  const populatedOrderItems = [];

  for (const cartItem of cartItems) {
    const stockItem = await StockItem.findById(cartItem.productId);
    if (!stockItem) {
      res.status(400).json({ message: `Article de stock non valide: ${cartItem.productId}` });
      return;
    }
    if (stockItem.quantity < cartItem.quantity) {
      res.status(400).json({ message: `Quantité insuffisante en stock pour: ${stockItem.name}` });
      return;
    }
    const unitPrice = stockItem.price;
    const itemTotal = unitPrice * cartItem.quantity;
    calculatedTotalAmount += itemTotal;
    populatedOrderItems.push({
      stockItem: stockItem._id,
      quantity: cartItem.quantity,
      unitPrice: unitPrice,
      itemTotal: itemTotal,
    });

    // Déduire la quantité du stock (idéalement dans une transaction)
    stockItem.quantity -= cartItem.quantity;
    await stockItem.save();
  }

  const order = await Order.create({
    client: client,
    orderItems: populatedOrderItems,
    totalAmount: calculatedTotalAmount,
    shippingAddress,
    paymentMethod,
  });

  if (order) {
    // Vider le panier après la commande
    req.session.cart = { items: [] };
    res.status(201).json(order);
  } else {
    res.status(400).json({ message: 'Erreur lors de la création de la commande' });
  }
});

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


const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
  
    if (order) {
      order.status = req.body.status || order.status; // Assurez-vous que 'status' est envoyé dans le body de la requête
  
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Commande non trouvée' });
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
    order.shippingAddress = req.body.shippingAddress || order.shippingAddress;
    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
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
  createOrder, // La fonction createOrder a été modifiée
  updateOrder,
  deleteOrder,
  createOrderFromCart: (req, res) => res.status(405).json({ message: 'Non implémenté' }), // Supprimer ou adapter si nécessaire
  updateOrderStatus,
};
