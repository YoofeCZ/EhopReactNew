// src/models/slider.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Slider = sequelize.define('Slider', {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buttonText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    buttonLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {});

  Slider.associate = function(models) {
    // Asociace, pokud je potřeba
  };

  return Slider;
};
