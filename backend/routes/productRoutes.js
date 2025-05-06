const express = require('express');
const router = express.Router();
const {
  getProductsForShop,
  getProductByIdForShop,
} = require('../controllers/productController');

router.get('/', getProductsForShop);
router.route('/:id').get(getProductByIdForShop);

module.exports = router;