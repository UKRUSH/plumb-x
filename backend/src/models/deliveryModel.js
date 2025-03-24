const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: String,
    address: String,
    phone: String,
    email: String
  },
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    quantity: Number,
    price: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  deliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);
