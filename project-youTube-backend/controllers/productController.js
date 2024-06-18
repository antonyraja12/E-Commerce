const Product = require("../models/product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    await product.update(req.body);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    await product.destroy();
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};
