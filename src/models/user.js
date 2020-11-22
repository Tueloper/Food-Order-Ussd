module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      bank_code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bank_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {}
  );
  User.associate = () => {};
  return User;
};
