// models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hashed_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
