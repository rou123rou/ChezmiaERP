const express = require('express');
const router = express.Router();
const {
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

router.route('/').get(getCartItems).delete(clearCart);
router.route('/items').post(addItemToCart);
router.route('/items/:productId').put(updateCartItemQuantity).delete(removeCartItem);

module.exports = router;