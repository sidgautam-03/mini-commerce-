const Product = require('../models/Product');

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const getAllProducts = async (queryParams) => {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        isActive,
        sortBy = "createdAt",
        order = "desc",
        page = 1,
        limit = 10
    } = queryParams;

    const filter = {};

    // search by name (case-insensitive partial match)
    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    // filter by exact category
    if (category) {
        filter.category = category;
    }

    // filter by active/inactive
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    // filter by price range
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // sorting
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    // pagination
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limitNum),
        Product.countDocuments(filter)
    ]);

    return {
        products,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
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