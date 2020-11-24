module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});
  Food.associate = function(models) {
     Food.hasMany(models.Order, {
      as: 'order',
      foreignKey: 'foodId'
    });
  };
  return Food;
};