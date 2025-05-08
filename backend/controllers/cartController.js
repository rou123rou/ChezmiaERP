const asyncHandler = require('express-async-handler');
const StockItem = require('../models/stockItem.model');

// @desc    Récupérer le contenu du panier de l'utilisateur connecté
// @route   GET /api/cart
// @access  Private (nécessite l'authentification)
const getCartItems = asyncHandler(async (req, res) => {
    if (req.session.user && req.session.user._id) {
        if (!req.session.cart) {
            req.session.cart = {};
        }
        if (!req.session.cart[req.session.user._id]) {
            req.session.cart[req.session.user._id] = { items: [] };
        }
        res.status(200).json(req.session.cart[req.session.user._id]);
    } else {
        // L'utilisateur n'est pas connecté, renvoyer un panier vide
        res.status(200).json({ items: [] });
    }
});

// @desc    Ajouter un article au panier de l'utilisateur connecté
// @route   POST /api/cart/items
// @access  Private (nécessite l'authentification)
const addItemToCart = asyncHandler(async (req, res) => {
    if (req.session.user && req.session.user._id) {
        const { productId, quantity = 1 } = req.body;
        const product = await StockItem.findById(productId);

        if (!product) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }

        if (quantity <= 0) {
            res.status(400).json({ message: 'La quantité doit être supérieure à zéro' });
            return;
        }

        const itemToAdd = {
            productId: product._id.toString(),
            name: product.name,
            price: product.price,
            quantity: parseInt(quantity),
            image: product.images[0] || null,
        };

        if (!req.session.cart) {
            req.session.cart = {};
        }
        if (!req.session.cart[req.session.user._id]) {
            req.session.cart[req.session.user._id] = { items: [] };
        }

        const existingItemIndex = req.session.cart[req.session.user._id].items.findIndex(
            (item) => item.productId === itemToAdd.productId
        );

        if (existingItemIndex > -1) {
            req.session.cart[req.session.user._id].items[existingItemIndex].quantity += itemToAdd.quantity;
        } else {
            req.session.cart[req.session.user._id].items.push(itemToAdd);
        }

        res.status(200).json(req.session.cart[req.session.user._id]);
    } else {
        res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
    }
});

// @desc    Mettre à jour la quantité d'un article dans le panier de l'utilisateur connecté
// @route   PUT /api/cart/items/:productId
// @access  Private (nécessite l'authentification)
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    if (req.session.user && req.session.user._id) {
        const { quantity } = req.body;
        const { productId } = req.params;

        if (!req.session.cart || !req.session.cart[req.session.user._id] || !req.session.cart[req.session.user._id].items) {
            res.status(404).json({ message: 'Panier non trouvé' });
            return;
        }

        const itemIndex = req.session.cart[req.session.user._id].items.findIndex(
            (item) => item.productId === productId
        );

        if (itemIndex > -1) {
            if (quantity > 0) {
                req.session.cart[req.session.user._id].items[itemIndex].quantity = parseInt(quantity);
            } else {
                req.session.cart[req.session.user._id].items.splice(itemIndex, 1);
            }
            res.status(200).json(req.session.cart[req.session.user._id]);
        } else {
            res.status(404).json({ message: 'Article non trouvé dans le panier' });
        }
    } else {
        res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
    }
});

// @desc    Supprimer un article du panier de l'utilisateur connecté
// @route   DELETE /api/cart/items/:productId
// @access  Private (nécessite l'authentification)
const removeCartItem = asyncHandler(async (req, res) => {
    if (req.session.user && req.session.user._id) {
        const { productId } = req.params;

        if (!req.session.cart || !req.session.cart[req.session.user._id] || !req.session.cart[req.session.user._id].items) {
            res.status(404).json({ message: 'Panier non trouvé' });
            return;
        }

        const initialLength = req.session.cart[req.session.user._id].items.length;
        req.session.cart[req.session.user._id].items = req.session.cart[req.session.user._id].items.filter(
            (item) => item.productId !== productId
        );

        if (req.session.cart[req.session.user._id].items.length < initialLength) {
            res.status(200).json(req.session.cart[req.session.user._id]);
        } else {
            res.status(404).json({ message: 'Article non trouvé dans le panier' });
        }
    } else {
        res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
    }
});

// @desc    Vider le panier de l'utilisateur connecté
// @route   DELETE /api/cart
// @access  Private (nécessite l'authentification)
const clearCart = asyncHandler(async (req, res) => {
    if (req.session.user && req.session.user._id) {
        req.session.cart[req.session.user._id] = { items: [] };
        res.status(200).json({ message: 'Panier vidé avec succès' });
    } else {
        res.status(401).json({ message: 'Non autorisé. Veuillez vous connecter.' });
    }
});

module.exports = {
    addItemToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
};