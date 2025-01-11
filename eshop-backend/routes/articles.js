// src/routes/articles.js
const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

// GET /api/articles - Získat všechny články
router.get('/', articlesController.getAllArticles);

// GET /api/articles/:id - Získat článek podle ID
router.get('/:id', articlesController.getArticleById);

// POST /api/articles - Vytvořit nový článek
router.post('/', articlesController.createArticle);

// PUT /api/articles/:id - Aktualizovat článek podle ID
router.put('/:id', articlesController.updateArticle);

// DELETE /api/articles/:id - Smazat článek podle ID
router.delete('/:id', articlesController.deleteArticle);

module.exports = router;
