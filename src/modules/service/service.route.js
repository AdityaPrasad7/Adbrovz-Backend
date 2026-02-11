const express = require('express');
const router = express.Router();
const serviceController = require('./service.controller');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { ROLES } = require('../../constants/roles');
const upload = require('../../middlewares/upload.middleware');

// ================= PUBLIC ROUTES =================
router.get('/categories', serviceController.getCategories);
router.get('/categories/:categoryId/subcategories', serviceController.getSubcategories);
router.get('/subcategories/:subcategoryId/services', serviceController.getServices);
router.get('/:serviceId', serviceController.getServiceDetails);

// ================= ADMIN ROUTES =================
router.use(authenticate);
router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

// Get all categories with subcategories (Admin)
router.get('/admin/categories', serviceController.getCategoriesWithSubcategories);

// Category Management
router.post('/admin/categories', upload.single('icon'), serviceController.createCategory);
router.put('/admin/categories/:categoryId', upload.single('icon'), serviceController.updateCategory);
router.delete('/admin/categories/:categoryId', serviceController.deleteCategory);

// Subcategory Management
router.post('/admin/subcategories', upload.single('icon'), serviceController.createSubcategory);
router.put('/admin/subcategories/:subcategoryId', upload.single('icon'), serviceController.updateSubcategory);
router.delete('/admin/subcategories/:subcategoryId', serviceController.deleteSubcategory);

// Service Management
router.post('/admin/services', serviceController.createService);
router.put('/admin/services/:serviceId', serviceController.updateService);
router.delete('/admin/services/:serviceId', serviceController.deleteService);

module.exports = router;
