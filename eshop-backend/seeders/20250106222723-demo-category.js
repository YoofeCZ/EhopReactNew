'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Elektronika',
        description: 'Elektronické zařízení',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Oblečení',
        description: 'Módní oblečení',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Přidej další kategorie podle potřeby
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
