require('dotenv').config(); // Načtení proměnných z .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const db = require('./models');

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const articleRoutes = require('./routes/articles'); // Přidání článků
const sliderRoutes = require('./routes/sliders');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Prefikování rout s /api
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/articles', articleRoutes); // Použití článkového routeru
app.use('/api/sliders', sliderRoutes);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Testovací endpoint
app.get('/api', (req, res) => {
  res.send('Backend je spuštěn!');
});

// Synchronizace databáze a spuštění serveru
const PORT = process.env.PORT || 5000;


db.sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server bďż˝ďż˝ na portu ${PORT}`);
  });
});
