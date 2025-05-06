const asyncHandler = require('express-async-handler');
const StockItem = require('../models/stockItem.model');

// @desc    Ajouter un article au panier
// @route   POST /api/cart/items
// @access  Public
const addItemToCart = asyncHandler(async (req, res) => {
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
    image: product.images[0] || null, // Prendre la première image si disponible
  };

  // Initialiser le panier s'il n'existe pas
  if (!req.session.cart) {
    req.session.cart = { items: [] };
  }

  // Vérifier si l'article existe déjà dans le panier
  const existingItemIndex = req.session.cart.items.findIndex(
    (item) => item.productId === itemToAdd.productId
  );

  if (existingItemIndex > -1) {
    req.session.cart.items[existingItemIndex].quantity += itemToAdd.quantity;
  } else {
    req.session.cart.items.push(itemToAdd);
  }

  res.status(200).json(req.session.cart);
});

// @desc    Récupérer le contenu du panier
// @route   GET /api/cart
// @access  Public
const getCartItems = asyncHandler(async (req, res) => {
  res.status(200).json(req.session.cart || { items: [] });
});

// @desc    Mettre à jour la quantité d'un article dans le panier
// @route   PUT /api/cart/items/:productId
// @access  Public
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!req.session.cart || !req.session.cart.items) {
    res.status(404).json({ message: 'Panier non trouvé' });
    return;
  }

  const itemIndex = req.session.cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex > -1) {
    if (quantity > 0) {
      req.session.cart.items[itemIndex].quantity = parseInt(quantity);
    } else {
      // Supprimer l'article si la quantité est nulle ou négative
      req.session.cart.items.splice(itemIndex, 1);
    }
    res.status(200).json(req.session.cart);
  } else {
    res.status(404).json({ message: 'Article non trouvé dans le panier' });
  }
});

// @desc    Supprimer un article du panier
// @route   DELETE /api/cart/items/:productId
// @access  Public
const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!req.session.cart || !req.session.cart.items) {
    res.status(404).json({ message: 'Panier non trouvé' });
    return;
  }

  const initialLength = req.session.cart.items.length;
  req.session.cart.items = req.session.cart.items.filter(
    (item) => item.productId !== productId
  );

  if (req.session.cart.items.length < initialLength) {
    res.status(200).json(req.session.cart);
  } else {
    res.status(404).json({ message: 'Article non trouvé dans le panier' });
  }
});

// @desc    Vider le panier
// @route   DELETE /api/cart
// @access  Public
const clearCart = asyncHandler(async (req, res) => {
  req.session.cart = { items: [] };
  res.status(200).json({ message: 'Panier vidé avec succès' });
});

module.exports = {
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};