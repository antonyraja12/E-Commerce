// controllers/userController.js

const User = require("../models/user");
const bcrypt = require("bcrypt");

const userController = {
  // Create user
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      let hashed_password = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, hashed_password });
      res.json({ message: "Your account has created successfully" });
    } catch (error) {
      console.error("Error creating user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Retrieve all users
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Retrieve a single user by ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update a user by ID
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, password } = req.body;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.username = username;
      user.email = email;
      user.password = password;
      await user.save();
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete a user by ID
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = userController;
