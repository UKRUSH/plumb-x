const Inventory = require('../models/inventoryModel');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
exports.getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const { itemName, category, quantity, price } = req.body;
    
    // Validate required fields
    if (!itemName || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Required fields missing: itemName, category, quantity, price'
      });
    }

    // Create new item
    const newItem = new Inventory({
      itemName,
      category,
      quantity: Number(quantity),
      price: Number(price),
      ...req.body,
      lastUpdated: new Date()
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      status: 'success',
      message: 'Item created successfully',
      data: savedItem
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to create item',
      errors: error.errors
    });
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      lastUpdated: new Date()
    };

    // Handle specific field updates
    if (req.body.imageUrl !== undefined) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory by category
// @route   GET /api/inventory/category/:category
// @access  Private
exports.getItemsByCategory = async (req, res) => {
  try {
    const items = await Inventory.find({ 
      category: req.params.category.toLowerCase() 
    });
    
    if (!items) {
      return res.status(404).json({
        status: 'error',
        message: 'No items found in this category'
      });
    }

    // Transform the data to include calculated fields
    const transformedItems = items.map(item => ({
      id: item._id,
      itemName: item.itemName,
      category: item.category,
      quantity: Number(item.quantity),
      price: Number(item.price),
      size: item.size,
      material: item.material,
      imageUrl: item.imageUrl,
      totalValue: Number(item.price) * Number(item.quantity),
      sku: item.sku,
      lastUpdated: item.lastUpdated
    }));

    res.status(200).json({
      status: 'success',
      count: items.length,
      data: transformedItems
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts/low-stock
// @access  Private
exports.getLowStockAlerts = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Get low stock alerts',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get category statistics
// @route   GET /api/inventory/category-stats
// @access  Private
exports.getCategoryStats = async (req, res) => {
  try {
    // Aggregate inventory items by category
    const categories = await Inventory.aggregate([
      {
        $group: {
          _id: '$category',
          name: { $first: '$category' },
          inStock: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          itemCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          inStock: 1,
          totalValue: 1,
          itemCount: 1,
          image: {
            $concat: ['/image/', { $toLower: '$name' }, '.jpg']
          },
          link: {
            $concat: ['/inventory/category/', { $toLower: '$name' }]
          }
        }
      }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};