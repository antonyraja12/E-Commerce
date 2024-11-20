const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// CRUD routes for cart
router.post("/", cartController.createCartItem); // Add item to cart
router.get("/", cartController.getAllCartItems); // Get all cart items
router.get("/:id", cartController.getCartItemById); // Get cart item by ID
router.put("/:id", cartController.updateCartItem); // Update a cart item by ID
router.delete("/:id", cartController.deleteCartItem); // Delete a cart item by ID

module.exports = router;
