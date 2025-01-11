// controllers/productController.js
const { Product, Category, sequelize, ProductImage  } = require('../models'); // Přidáno 'sequelize'
const { Op } = require('sequelize');


exports.createProduct = async (req, res) => {
  try {
    const { 
      name,
      description,
      price,
      imageUrl,       // hlavní obrázek
      categoryId,
      stock,
      productImages   // pole stringů pro další obrázky
    } = req.body;

    // Ověření validního categoryId
    if (!categoryId || categoryId === 0) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Category does not exist' });
    }

    // 1) Vytvoříme samotný produkt
    const product = await Product.create({
      name,
      description,
      price,        // decimal
      imageUrl,     // main image
      categoryId,
      stock
    });

    // 2) Pokud pole productImages existuje a je pole stringů, uložíme do ProductImage
    if (productImages && Array.isArray(productImages)) {
      for (const url of productImages) {
        await ProductImage.create({
          productId: product.id,
          imageUrl: url
        });
      }
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Chyba při vytváření produktu:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'name'], // Uveď pouze potřebná pole
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl'], // Uveď pouze potřebná pole
        },
      ],
      order: [['createdAt', 'DESC']], // Seřazení podle data vytvoření, nejnovější první
      limit: 4, // Limit na 4 produkty
    });
    res.json(latestProducts);
  } catch (error) {
    console.error('Chyba při načítání nejnovějších produktů:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Category },
        { model: ProductImage, as: 'images', required: false }, // Přidán `required: false`
      ],
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produkt nenalezen' });
    }
  } catch (error) {
    console.error('Chyba při načítání produktu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      imageUrl,
      categoryId,
      stock,
      productImages  // pole nových URL obrázků
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nenalezen' });
    }

    if (!categoryId || categoryId === 0) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Kategorie neexistuje' });
    }

    // Update základních polí
    await product.update({
      name,
      description,
      price,
      imageUrl,
      categoryId,
      stock
    });

    // Pokud front-end poslal pole productImages, tak staré smažeme a vytvoříme nové
    if (productImages && Array.isArray(productImages)) {
      // Smazat staré
      await ProductImage.destroy({ where: { productId: id } });
      // Vytvořit nové
      for (const url of productImages) {
        await ProductImage.create({ productId: id, imageUrl: url });
      }
    }

    res.json(product);
  } catch (error) {
    console.error('Chyba při aktualizaci produktu:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

    

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: Category });
    res.json(products);
  } catch (error) {
    console.error('Chyba při načítání produktů:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.findAll({
      where: {
        purchaseCount: { [Op.gt]: 0 },
      },
      include: Category,
      order: [['purchaseCount', 'DESC']],
      limit: 20, // Nastavte na požadovaný počet
    });
    res.json(featuredProducts);
  } catch (error) {
    console.error('Chyba při načítání doporučených produktů:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Produkt nenalezen' });
    }
  } catch (error) {
    console.error('Chyba při mazání produktu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/products/random - Náhodné produkty
exports.getRandomProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      order: sequelize.random(),
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Žádný produkt nenalezen' });
    }
  } catch (error) {
    console.error('Chyba při načítání náhodného produktu:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Přidání nového endpointu pro získání více náhodných produktů// controllers/productController.js

exports.getRandomProducts = async (req, res) => {
  try {
    const count = parseInt(req.query.count, 10) || 1;
    const excludeIds = req.query.excludeIds ? req.query.excludeIds.split(',').map(id => parseInt(id, 10)) : [];

    const totalProducts = await Product.count({
      where: {
        ...(excludeIds.length > 0 && { id: { [Op.notIn]: excludeIds } }),
      },
    });
    const limitedCount = Math.min(count, totalProducts);

    const randomFunction = sequelize.fn('RANDOM'); // PostgreSQL
    const randomProducts = await Product.findAll({
      where: {
        ...(excludeIds.length > 0 && { id: { [Op.notIn]: excludeIds } }),
      },
      order: [randomFunction],
      limit: limitedCount,
      include: Category,
    });

    res.json(randomProducts);
  } catch (error) {
    console.error('Chyba při načítání náhodných produktů:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




