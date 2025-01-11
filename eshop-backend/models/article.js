// src/models/article.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // Může být null, pokud článek nemá obrázek
    },
    shortText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});

  // Pokud byste chtěli přidat asociace, můžete to udělat zde
  Article.associate = function(models) {
    // Příklad: Článek může mít autora (User)
    // Article.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
  };

  return Article;
};
