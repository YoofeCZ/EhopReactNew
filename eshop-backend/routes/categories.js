// routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - Všechny kategorie
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Detail kategorie
router.get('/:id', categoryController.getCategoryById);

// GET /api/categories/:id/products - Produkty v kategorii
router.get('/:id/products', categoryController.getProductsByCategory);

// POST /api/categories - Vytvoření nové kategorie
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - Úprava kategorie
router.put('/:id', categoryController.updateCategory);


// DELETE /api/categories/:id - Smazání kategorie
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
