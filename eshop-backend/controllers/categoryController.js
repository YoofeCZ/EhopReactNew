// controllers/categoryController.js
const { Category, Product } = require('../models');
const { Op } = require('sequelize');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Chyba při načítání kategorií:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Kategorie nenalezena' });
    }
  } catch (error) {
    console.error('Chyba při načítání kategorie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { minPrice, maxPrice, startDate, endDate, sortBy } = req.query;

    // Zkontrolujte, zda kategorie existuje
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Kategorie nenalezena' });
    }

    // Vytvořte filtrační podmínky
    const whereConditions = { categoryId: id };

    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) {
        whereConditions.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereConditions.price[Op.lte] = parseFloat(maxPrice);
      }
    }

    if (startDate || endDate) {
      whereConditions.createdAt = {};
      if (startDate) {
        whereConditions.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereConditions.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Nastavte třídění
    let order = [['price', 'ASC']]; // Výchozí třídění

    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          order = [['price', 'ASC']];
          break;
        case 'price_desc':
          order = [['price', 'DESC']];
          break;
        case 'purchaseCount_desc':
          order = [['purchaseCount', 'DESC']];
          break;
        case 'createdAt_desc':
          order = [['createdAt', 'DESC']];
          break;
        default:
          break;
      }
    }

    // Najděte všechny produkty v této kategorii s filtry a tříděním
    const products = await Product.findAll({
      where: whereConditions,
      order,
    });

    res.json(products);
  } catch (error) {
    console.error('Chyba při načítání produktů v kategorii:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.create({ name, description, icon });
    res.status(201).json(category);
  } catch (error) {
    console.error('Chyba při vytváření kategorie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Data z těla requestu
    const { name, description, icon } = req.body;

    // Najdeme kategorii podle ID
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Kategorie nenalezena' });
    }

    // Upravíme pole, která chceme (můžete upravit i další, pokud je máte)
    if (name !== undefined) {
      category.name = name;
    }
    if (description !== undefined) {
      category.description = description;
    }
    if (icon !== undefined) {
      category.icon = icon;
    }

    // Uložíme změny
    await category.save();

    res.json(category); // Pošleme zpátky upravenou kategorii
  } catch (error) {
    console.error('Chyba při updatu kategorie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Kategorie nenalezena' });
    }
  } catch (error) {
    console.error('Chyba při mazání kategorie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
