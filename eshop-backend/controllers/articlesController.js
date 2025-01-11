// src/controllers/articlesController.js
const { Article } = require('../models');

// Získat všechny články
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      order: [['createdAt', 'DESC']], // Nejnovější články první
    });
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Získat článek podle ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Článek nenalezen' });
    }
    res.json(article);
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Vytvořit nový článek
exports.createArticle = async (req, res) => {
  const { title, image, shortText, content } = req.body;
  try {
    const newArticle = await Article.create({ title, image, shortText, content });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Aktualizovat článek podle ID
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, image, shortText, content } = req.body;
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Článek nenalezen' });
    }

    // Aktualizace polí
    article.title = title !== undefined ? title : article.title;
    article.image = image !== undefined ? image : article.image;
    article.shortText = shortText !== undefined ? shortText : article.shortText;
    article.content = content !== undefined ? content : article.content;

    await article.save();
    res.json(article);
  } catch (error) {
    console.error(`Error updating article with id ${id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Smazat článek podle ID
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Článek nenalezen' });
    }

    await article.destroy();
    res.json({ message: 'Článek byl úspěšně smazán' });
  } catch (error) {
    console.error(`Error deleting article with id ${id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
