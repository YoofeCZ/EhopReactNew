require('dotenv').config(); // Načtení proměnných z .env

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'SolarEnergy2024',
    database: process.env.DB_NAME || 'eshop',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'SolarEnergy2024',
    database: process.env.DB_NAME || 'eshop_test',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'SolarEnergy2024',
    database: process.env.DB_NAME || 'eshop_prod',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
};
