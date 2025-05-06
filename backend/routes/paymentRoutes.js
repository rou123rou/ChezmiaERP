const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  handlePaymentCallback,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware'); // Si vous voulez protéger l'initiation

router.post('/initiate', protect, initiatePayment);
router.post('/callback', handlePaymentCallback); // Cette route doit être accessible publiquement

module.exports = router;