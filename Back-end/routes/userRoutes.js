// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userContorller");

// Create a new user
router.post("/add", userController.createUser);

// Retrieve all users
router.get("/get", userController.getUsers);

// Retrieve a single user by ID
router.get("/get:id", userController.getUserById);

// Update a user by ID
router.put("/put:id", userController.updateUser);

// Delete a user by ID
router.delete("/delete:id", userController.deleteUser);

module.exports = router;
