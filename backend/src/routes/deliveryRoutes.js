const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Get all deliveries
router.get('/', deliveryController.getAllDeliveries);

// Get delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// Create new delivery
router.post('/', deliveryController.createDelivery);

// Update delivery
router.put('/:id', deliveryController.updateDelivery);

// Delete delivery
router.delete('/:id', deliveryController.deleteDelivery);

// Assign driver to delivery
router.put('/:id/assign', deliveryController.assignDriver);

// Update delivery status
router.put('/:id/status', deliveryController.updateStatus);

// Get deliveries by driver
router.get('/driver/:driverId', deliveryController.getDeliveriesByDriver);

module.exports = router; 