const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.route('/').get(getAllCategories).post(createCategory); // POST pour l'admin
router.route('/:id').put(updateCategory).delete(deleteCategory); // PUT et DELETE pour l'admin

module.exports = router;