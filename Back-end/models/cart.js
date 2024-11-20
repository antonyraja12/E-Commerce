const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define("cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: true, // Optional ID field
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // Optional userId
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false, // Foreign key from the Product model
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default value set to 1
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Cart;
