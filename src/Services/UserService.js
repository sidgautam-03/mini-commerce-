const User = require("../models/Users");

const createUser = async (userData) => {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser;
};

const getAllUsers = async () => {
    return await User.find();
};

const getUserById = async (userId) => {
    return await User.findById(userId);
};

const updateUser = async (userId, userData) => {
    return await User.findByIdAndUpdate(userId, userData, { new: true, runValidators: true });
};

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};