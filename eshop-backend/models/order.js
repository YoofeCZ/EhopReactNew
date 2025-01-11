'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  }, {});
  
  // Zachování asociace na `OrderItem`, pokud je třeba
  Order.associate = function(models) {
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
  };
  
  return Order;
};
