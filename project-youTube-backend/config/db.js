const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

// Function to perform raw SQL queries

const query = async (sql, params) => {
  console.log("sql", sql);
  try {
    const [results, metadata] = await sequelize.query(sql, {
      replacements: params,
      type: Sequelize.QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
};
(module.exports = sequelize), query;
