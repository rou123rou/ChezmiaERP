// backend/controllers/stockController.js
const StockItem = require('../models/stockItem.model');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer tous les stocks avec la valeur totale
// @route   GET /api/stocks
// @access  Public (pour l'instant)
const getAllStocks = asyncHandler(async (req, res) => {
  const stocks = await StockItem.find({}).select('-__v').populate('category', 'name'); // Inclure le nom de la catégorie
  const stocksWithValue = stocks.map(stock => ({
    ...stock.toObject(),
    totalValue: stock.price * stock.quantity,
  }));
  res.status(200).json(stocksWithValue);
});

// @desc    Récupérer un stock par ID avec la valeur totale
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = asyncHandler(async (req, res) => {
  const stock = await StockItem.findById(req.params.id).select('-__v').populate('category', 'name'); // Inclure le nom de la catégorie

  if (stock) {
    const stockWithValue = {
      ...stock.toObject(),
      totalValue: stock.price * stock.quantity,
    };
    res.status(200).json(stockWithValue);
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
});

// @desc    Créer un nouveau stock
// @route   POST /api/stocks
// @access  Public
const createStock = asyncHandler(async (req, res) => {
  const { name, quantity, description, price, category } = req.body; // Inclure category

  if (!name || quantity === undefined || price === undefined || !category) { // Vérifier si category est présent
    res.status(400).json({ message: 'Le nom, la quantité, le prix et la catégorie sont obligatoires' }); // Mettre à jour le message
    return;
  }

  const stock = await StockItem.create({
    name,
    quantity,
    description,
    price,
    category, // Inclure category lors de la création
  });

  if (stock) {
    res.status(201).json({
      _id: stock._id,
      name: stock.name,
      quantity: stock.quantity,
      description: stock.description,
      price: stock.price,
      category: stock.category, // Inclure l'ID de la catégorie dans la réponse
      totalValue: stock.price * stock.quantity,
    });
  } else {
    res.status(400).json({ message: 'Erreur lors de la création du produit' });
  }
});

// @desc    Mettre à jour un stock
// @route   PUT /api/stocks/:id
// @access  Public
const updateStock = asyncHandler(async (req, res) => {
  const stock = await StockItem.findById(req.params.id);

  if (stock) {
    stock.name = req.body.name || stock.name;
    stock.quantity = req.body.quantity === undefined ? stock.quantity : req.body.quantity;
    stock.description = req.body.description || stock.description;
    stock.price = req.body.price === undefined ? stock.price : req.body.price;
    stock.category = req.body.category || stock.category; // Mettre à jour la catégorie

    const updatedStock = await stock.save();
    res.status(200).json({
      _id: updatedStock._id,
      name: updatedStock.name,
      quantity: updatedStock.quantity,
      description: updatedStock.description,
      price: updatedStock.price,
      category: updatedStock.category, // Inclure la catégorie mise à jour
      totalValue: updatedStock.price * updatedStock.quantity,
    });
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
});

// @desc    Supprimer un stock
// @route   DELETE /api/stocks/:id
// @access  Private
const deleteStock = asyncHandler(async (req, res) => {
  const stock = await StockItem.findById(req.params.id);

  if (!stock) {
    res.status(404);
    throw new Error('Produit non trouvé');
  }

  await StockItem.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Produit supprimé avec succès' });
});

module.exports = {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
};