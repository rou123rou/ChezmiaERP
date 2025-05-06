const StockItem = require('../models/stockItem.model');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer tous les produits pour le site e-commerce
// @route   GET /api/products
// @access  Public
const getProductsForShop = asyncHandler(async (req, res) => {
  const { category, keyword, pageNumber = 1, pageSize = 10 } = req.query;

  const query = {};
  if (category) {
    query.category = category;
  }
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }

  const count = await StockItem.countDocuments(query);
  const products = await StockItem.find(query)
    .populate('category', 'name')
    .skip((pageNumber - 1) * pageSize)
    .limit(parseInt(pageSize));

  res.status(200).json({
    products,
    page: parseInt(pageNumber),
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Récupérer un produit par ID pour le site e-commerce
// @route   GET /api/products/:id
// @access  Public
const getProductByIdForShop = asyncHandler(async (req, res) => {
  const product = await StockItem.findById(req.params.id).populate('category', 'name');

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
});

module.exports = {
  getProductsForShop,
  getProductByIdForShop,
};