const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    createOrderFromCart,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Si vous avez un middleware d'authentification

router.route('/').get(getAllOrders).post(protect, createOrder); // Appliquer le middleware protect si nécessaire
router.put('/:id/status', protect, updateOrderStatus);
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder);
router.route('/from-cart').post(protect, createOrderFromCart);

module.exports = router;