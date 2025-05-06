const Category = require('../models/category.model');
const asyncHandler = require('express-async-handler');

// @desc    Récupérer toutes les catégories
// @route   GET /api/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});

// @desc    Créer une nouvelle catégorie (pour l'admin dashboard)
// @route   POST /api/categories
// @access  Private (à protéger)
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400).json({ message: 'Catégorie avec ce nom existe déjà' });
  }

  const category = await Category.create({
    name,
    description,
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400).json({ message: 'Erreur lors de la création de la catégorie' });
  }
});

// @desc    Mettre à jour une catégorie (pour l'admin dashboard)
// @route   PUT /api/categories/:id
// @access  Private (à protéger)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } else {
    res.status(404).json({ message: 'Catégorie non trouvée' });
  }
});

// @desc    Supprimer une catégorie (pour l'admin dashboard)
// @route   DELETE /api/categories/:id
// @access  Private (à protéger)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Catégorie non trouvée');
  }

  // Vérifier si des produits sont associés à cette catégorie avant de supprimer
  const productsInCategory = await StockItem.find({ category: category._id });
  if (productsInCategory.length > 0) {
    res.status(400).json({ message: 'Impossible de supprimer la catégorie car elle contient des produits.' });
    return;
  }

  await Category.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Catégorie supprimée avec succès' });
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};