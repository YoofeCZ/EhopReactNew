'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define('ProductImage', {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'ProductImages', // Nastaví přesný název tabulky
  });
  
  ProductImage.associate = function(models) {
    ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
  };
  
  return ProductImage;
};
