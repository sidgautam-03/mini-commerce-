const Product = require('../models/Product');

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const getAllProducts = async () => {
    return await Product.find();
};

const getProductById = async (productId) => {
    return await Product.findById(productId);
};

const updateProduct = async (productId, productData) => {
    return await Product.findByIdAndUpdate(productId, productData, { new: true, runValidators: true });
};

const deleteProduct = async (productId) => {
    return await Product.findByIdAndDelete(productId);
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};