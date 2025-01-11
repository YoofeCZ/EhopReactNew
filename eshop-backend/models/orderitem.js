'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {});
  
  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };
  
  return OrderItem;
};
