// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const authRoutes = require("./routes/authRouter");

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Routes
// app.use("/auth", authRoutes);

// // Start server
// const PORT = process.env.PORT || 300;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// app.js

const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRouter");
const prodRoutes = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRouter");
const sequelize = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());
app.options("*", cors());

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use("/api/users", userRoutes);
app.use("/api", authRoutes);
app.use("/api/product", prodRoutes);
app.use("/api/cart", cartRouter);

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.sync();
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error.message);
  }
});
