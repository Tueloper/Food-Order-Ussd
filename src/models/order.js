module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    foodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Food',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.Food, {
      as: 'food',
      foreignKey: 'foodId'
    });
    Order.belongsTo(models.Order, {
      as: 'order',
      foreignKey: 'foodId'
    });
  };
  return Order;
};