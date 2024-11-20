const Cart = require("../models/cart");

// Create a cart item
exports.createCartItem = async (req, res) => {
  try {
    const cartItem = await Cart.create(req.body);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create cart item" });
  }
};

// Get all cart items
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findAll();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
};

// Get a cart item by ID
exports.getCartItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findByPk(id);

    if (cartItem) {
      res.status(200).json(cartItem);
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve cart item" });
  }
};

// Update a cart item by ID
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Cart.update(req.body, { where: { id } });

    if (updated) {
      const updatedCartItem = await Cart.findByPk(id);
      res.status(200).json(updatedCartItem);
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Delete a cart item by ID
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cart.destroy({ where: { id } });

    if (deleted) {
      res.status(204).json({ message: "Cart item deleted" });
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
};
