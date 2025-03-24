const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  },
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tools', 'pipes', 'fittings', 'valves', 'pvc', 'fixtures', 'sealants', 'safety', 'others']
  },
  description: String,
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    trim: true
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
    trim: true
  },
  supplier: String,
  reorderPoint: {
    type: Number,
    default: 10
  },
  location: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }
}, {
  timestamps: true
});

// Add pre-save middleware to ensure SKU is unique
inventorySchema.pre('save', async function(next) {
  if (!this.sku) {
    let isUnique = false;
    while (!isUnique) {
      this.sku = `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const existing = await this.constructor.findOne({ sku: this.sku });
      if (!existing) isUnique = true;
    }
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
