// backend/controllers/stockController.js
const StockItem = require('../models/stockItem.model');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer tous les stocks avec la valeur totale
// @route   GET /api/stocks
// @access  Public (pour l'instant)
const getAllStocks = asyncHandler(async (req, res) => {
  const stocks = await StockItem.find({}).select('-__v'); // Sélectionner tous les champs sauf __v
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
  const stock = await StockItem.findById(req.params.id).select('-__v'); // Sélectionner tous les champs sauf __v

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
  const { name, quantity, description, price } = req.body;

  if (!name || quantity === undefined || price === undefined) {
    res.status(400).json({ message: 'Le nom, la quantité et le prix sont obligatoires' });
    return;
  }

  const stock = await StockItem.create({
    name,
    quantity,
    description,
    price,
  });

  if (stock) {
    res.status(201).json({
      _id: stock._id,
      name: stock.name,
      quantity: stock.quantity,
      description: stock.description,
      price: stock.price,
      totalValue: stock.price * stock.quantity, // Calculer et inclure la valeur totale
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
    stock.price = req.body.price === undefined ? stock.price : req.body.price; // Mettre à jour le prix

    const updatedStock = await stock.save();
    res.status(200).json({
      _id: updatedStock._id,
      name: updatedStock.name,
      quantity: updatedStock.quantity,
      description: updatedStock.description,
      price: updatedStock.price,
      totalValue: updatedStock.price * updatedStock.quantity, // Calculer et inclure la valeur totale mise à jour
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