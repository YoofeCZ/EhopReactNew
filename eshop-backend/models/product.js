'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    imageUrl: DataTypes.STRING, // Můžeme odstranit, pokud používáme `ProductImage`
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    purchaseCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {});
  
  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
    Product.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'images' });
  };
  
  return Product;
};
