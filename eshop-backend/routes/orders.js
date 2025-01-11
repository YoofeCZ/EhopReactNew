const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /orders - Vytvoření objednávky
router.post('/', orderController.createOrder);

module.exports = router;
