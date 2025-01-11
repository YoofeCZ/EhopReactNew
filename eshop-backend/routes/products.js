// routes/products.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Specifické trasy definujte před dynamickou trasou
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/random', productController.getRandomProducts);
router.get('/latest', productController.getLatestProducts); // Přesunuto sem
router.get('/:id', productController.getProductById);       // Dynamická trasa zůstává na konci

// Přidání PUT trasy pro aktualizaci produktu
router.put('/:id', productController.updateProduct);

// Další trasy...
router.post('/', productController.createProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
