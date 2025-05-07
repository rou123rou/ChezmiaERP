const Order = require('../models/order.model');
const Client = require('../models/clientModel');
const StockItem = require('../models/stockItem.model');
const asyncHandler = require('express-async-handler');

// @desc    Créer une nouvelle commande depuis le dashboard ou le site e-commerce
// @route   POST /api/orders
// @access  Private (pour le dashboard) / Public (pour le site, avec authentification)
const createOrder = asyncHandler(async (req, res) => {
    const { client, orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    // Vérifier si le client existe
    const existingClient = await Client.findById(client);
    if (!existingClient) {
        res.status(400).json({ message: 'Client non valide' });
        return;
    }

    let calculatedTotalAmount = 0;
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
        calculatedTotalAmount += itemTotal;
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

    // Vérifier si le totalAmount envoyé correspond au total calculé (sécurité)
    if (totalAmount !== calculatedTotalAmount) {
        res.status(400).json({ message: 'Le montant total de la commande ne correspond pas.' });
        return;
    }

    const order = await Order.create({
        client,
        orderItems: populatedOrderItems,
        totalAmount: calculatedTotalAmount,
        shippingAddress, // Enregistrer les informations de livraison
        paymentMethod, // Enregistrer la méthode de paiement
    });

    if (order) {
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

// @desc    Créer une commande à partir du panier du client
// @route   POST /api/orders/from-cart
// @access  Private (nécessite l'authentification du client)
const createOrderFromCart = asyncHandler(async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
        return;
    }

    if (!req.session.cart || !req.session.cart.items || req.session.cart.items.length === 0) {
        res.status(400).json({ message: 'Le panier est vide.' });
        return;
    }

    const client = req.session.user._id;
    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of req.session.cart.items) {
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
        totalAmount += itemTotal;
        orderItems.push({
            stockItem: stockItem._id,
            quantity: cartItem.quantity,
            unitPrice: unitPrice,
            itemTotal: itemTotal,
        });

        stockItem.quantity -= cartItem.quantity;
        await stockItem.save();
    }

    const order = await Order.create({
        client,
        orderItems,
        totalAmount,
    });

    if (order) {
        // Vider le panier après la commande
        req.session.cart = { items: [] };
        res.status(201).json(order);
    } else {
        res.status(400).json({ message: 'Erreur lors de la création de la commande' });
    }
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const { status } = req.body;

        if (status && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            order.status = status;
            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        } else {
            res.status(400).json({ message: 'Statut de commande invalide' });
        }
    } else {
        res.status(404).json({ message: 'Commande non trouvée' });
    }
});


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    createOrderFromCart,
    updateOrderStatus,
};