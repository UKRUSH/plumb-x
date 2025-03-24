const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Fixed routes order - specific routes first
router.get('/categories', inventoryController.getCategoryStats);
router.get('/category/:category', inventoryController.getItemsByCategory);
router.get('/alerts/low-stock', inventoryController.getLowStockAlerts);

// Generic CRUD routes
router.get('/', inventoryController.getAllItems);
router.get('/:id', inventoryController.getItemById);
router.post('/', inventoryController.createItem);
router.put('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);

module.exports = router;