const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Product;
