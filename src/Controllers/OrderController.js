const orderService = require("../Services/OrderService");

const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const result = await orderService.createOrder(orderData);
        res.status(201).json({ message: "Order created successfully", order: result });
    } catch (err) {
        // errors thrown intentionally in the service are bad input, not server errors
        res.status(400).json({ error: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid order id" });
        }
        res.status(500).json({ error: err.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrder(req.params.id, req.body);
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (err) {
        if (err.name === "ValidationError" || err.name === "CastError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await orderService.deleteOrder(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid order id" });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};