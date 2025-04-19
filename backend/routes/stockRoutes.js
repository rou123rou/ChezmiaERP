const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} = require('../controllers/stockController');

router.route('/').get(getAllStocks).post(createStock);
router.route('/:id').get(getStockById).put(updateStock).delete(deleteStock);

module.exports = router;