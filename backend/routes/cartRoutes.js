const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');

router.route('/').get(protect,getCartItems).delete(clearCart);
router.route('/items').post(protect,addItemToCart);
router.route('/items/:productId').put(protect,updateCartItemQuantity).delete(protect,removeCartItem);

module.exports = router;