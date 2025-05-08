const express = require('express');
const router = express.Router();
const {
    addItemToCart,
    getCartItems,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware'); // Assurez-vous que le chemin vers votre middleware est correct

router.route('/').get(protect, getCartItems).delete(protect, clearCart);
router.route('/items').post(protect, addItemToCart);
router.route('/items/:productId').put(protect, updateCartItemQuantity).delete(protect, removeCartItem);

module.exports = router;