const Category = require('../../models/Category.model');
const Subcategory = require('../../models/Subcategory.model');
const Service = require('../../models/Service.model');
const ApiError = require('../../utils/ApiError');
const MESSAGES = require('../../constants/messages');

/**
 * Get all active categories
 */
const getAllCategories = async () => {
    const categories = await Category.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .select('name description icon membershipFee defaultFreeCredits');
    return categories;
};

/**
 * Get subcategories by category ID
 */
const getSubcategoriesByCategoryId = async (categoryId) => {
    const subcategories = await Subcategory.find({
        category: categoryId,
        isActive: true
    })
        .sort({ order: 1, name: 1 })
        .select('name description icon order price');

    return subcategories;
};

/**
 * Get services by subcategory ID with pagination
 */
const getServicesBySubcategoryId = async (subcategoryId, options = {}) => {
    const { page = 1, limit = 10, search } = options;
    const skip = (page - 1) * limit;

    const query = {
        subcategory: subcategoryId,
        isActive: true
    };

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const services = await Service.find(query)
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .select('title description photo approxCompletionTime adminPrice isAdminPriced moreInfo quantityEnabled priceAdjustmentEnabled');

    const total = await Service.countDocuments(query);

    return {
        services,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Get service details by ID
 */
const getServiceById = async (serviceId) => {
    const service = await Service.findOne({ _id: serviceId, isActive: true })
        .populate('category', 'name')
        .populate('subcategory', 'name');

    if (!service) {
        throw new ApiError(404, 'Service not found');
    }

    return service;
};

/**
 * Admin: Create Category
 */
const createCategory = async (data) => {
    const category = await Category.create(data);
    return category;
};

/**
 * Admin: Update Category
 */
const updateCategory = async (categoryId, data) => {
    const category = await Category.findByIdAndUpdate(categoryId, data, { new: true });
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
};

/**
 * Admin: Delete Category
 */
const deleteCategory = async (categoryId) => {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
};

/**
 * Admin: Create Subcategory
 */
const createSubcategory = async (data) => {
    const subcategory = await Subcategory.create(data);
    return subcategory;
};

/**
 * Admin: Update Subcategory
 */
const updateSubcategory = async (subcategoryId, data) => {
    const subcategory = await Subcategory.findByIdAndUpdate(subcategoryId, data, { new: true });
    if (!subcategory) throw new ApiError(404, 'Subcategory not found');
    return subcategory;
};

/**
 * Admin: Delete Subcategory
 */
const deleteSubcategory = async (subcategoryId) => {
    const subcategory = await Subcategory.findByIdAndDelete(subcategoryId);
    if (!subcategory) throw new ApiError(404, 'Subcategory not found');
    return subcategory;
};

/**
 * Admin: Create Service
 */
const createService = async (data) => {
    console.log('DEBUG: createService received body (raw):', data);

    // Ensure IDs are valid strings and not "null"/"undefined"
    const validateId = (id, name) => {
        if (!id) return null;
        const strId = String(id).trim();
        if (strId === 'null' || strId === 'undefined' || strId === '') {
            console.error(`DEBUG: Invalid ${name} ID received:`, id);
            return null;
        }
        return strId;
    };

    data.category = validateId(data.category, 'category');
    data.subcategory = validateId(data.subcategory, 'subcategory');

    if (!data.category) {
        throw new ApiError(400, 'A valid category ID is required');
    }

    // Verify category exists
    console.log('DEBUG: Finding category by ID:', data.category);
    const category = await Category.findById(data.category);

    if (!category) {
        console.error('DEBUG: Category not found in DB:', data.category);
        // List a few categories for comparison
        const sampleCats = await Category.find().limit(5).select('_id name');
        console.log('DEBUG: Sample Categories in DB:', sampleCats.map(c => ({ id: c._id, name: c.name })));
        throw new ApiError(404, `Category not found with ID: ${data.category}`);
    }

    if (data.subcategory) {
        console.log('DEBUG: Finding subcategory by ID:', data.subcategory);
        const subcategory = await Subcategory.findById(data.subcategory);
        if (!subcategory) {
            console.error('DEBUG: Subcategory not found in DB:', data.subcategory);
            throw new ApiError(404, `Subcategory not found with ID: ${data.subcategory}`);
        }
    }

    const service = await Service.create(data);
    console.log('DEBUG: Service created successfully:', service._id);
    return service;
};

/**
 * Admin: Update Service
 */
const updateService = async (serviceId, data) => {
    const service = await Service.findByIdAndUpdate(serviceId, data, { new: true });
    if (!service) throw new ApiError(404, 'Service not found');
    return service;
};

/**
 * Admin: Delete Service
 */
const deleteService = async (serviceId) => {
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) throw new ApiError(404, 'Service not found');
    return service;
};

/**
 * Admin: Get all categories with nested subcategories
 * Optimized using aggregation pipeline for better performance
 */
const getAllCategoriesWithSubcategories = async () => {
    // Use aggregation pipeline to join Categories -> Subcategories -> Services
    const result = await Category.aggregate([
        { $match: { isActive: true } },
        { $sort: { order: 1, name: 1 } },
        {
            $lookup: {
                from: 'subcategories',
                let: { categoryId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$category', '$$categoryId'] },
                                    { $eq: ['$isActive', true] }
                                ]
                            }
                        }
                    },
                    { $sort: { order: 1, name: 1 } },
                    {
                        $lookup: {
                            from: 'services',
                            let: { subcatId: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$subcategory', '$$subcatId'] },
                                                { $eq: ['$isActive', true] }
                                            ]
                                        }
                                    }
                                },
                                { $sort: { title: 1 } },
                                {
                                    $project: {
                                        _id: 1,
                                        title: 1,
                                        photo: 1,
                                        adminPrice: 1,
                                        price: 1,
                                        approxCompletionTime: 1,
                                        isActive: 1,
                                        description: 1
                                    }
                                }
                            ],
                            as: 'services'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            icon: 1,
                            order: 1,
                            price: { $ifNull: ['$price', 0] },
                            services: 1
                        }
                    }
                ],
                as: 'subcategories'
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                icon: 1,
                membershipFee: 1,
                defaultFreeCredits: 1,
                subcategories: {
                    $map: {
                        input: '$subcategories',
                        as: 'sub',
                        in: {
                            id: { $toString: '$$sub._id' },
                            _id: '$$sub._id',
                            name: '$$sub.name',
                            description: '$$sub.description',
                            icon: '$$sub.icon',
                            order: '$$sub.order',
                            price: '$$sub.price',
                            services: '$$sub.services'
                        }
                    }
                }
            }
        }
    ]);

    // Convert _id to id for consistency
    return result.map(cat => ({
        ...cat,
        id: cat._id.toString()
    }));
};

module.exports = {
    getAllCategories,
    getSubcategoriesByCategoryId,
    getServicesBySubcategoryId,
    getServiceById,
    // Admin exports
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    createService,
    updateService,
    deleteService,
    getAllCategoriesWithSubcategories
};
