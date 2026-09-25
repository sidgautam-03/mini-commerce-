const Order = require('../models/Order');
const User = require('../models/Users');   // match this to your actual model export
const Product = require('../models/Product');

const createOrder = async (orderData) => {
    const { userId, items } = orderData;

    // check user exists before creating any order for them
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // order must have at least one item
    if (!items || items.length === 0) {
        throw new Error("Order must contain at least one product");
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        // verify each product actually exists in the DB
        const product = await Product.findById(item.productId);

        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }

        // reject missing, zero, or negative quantity
        if (!item.quantity || item.quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }

        // use the product's real DB price, never trust client-sent price
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        // build the clean item to save, with verified id and price
        orderItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price
        });
    }

    // create and save the order with the computed total
    const order = new Order({
        userId,
        items: orderItems,
        totalAmount
    });

    return await order.save();
};

const getAllOrders = async () => {
    // fetch every order in the collection
    return await Order.find();
};

const getOrderById = async (id) => {
    // fetch a single order by its _id, returns null if not found
    return await Order.findById(id);
};

const updateOrder = async (id, updateData) => {
    // update an order (e.g. status) and return the updated document
    return await Order.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteOrder = async (id) => {
    // delete an order by its _id, returns the deleted doc or null
    return await Order.findByIdAndDelete(id);
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};