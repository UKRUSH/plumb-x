const User = require('../models/userModel');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Login user / Auth user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For simple login without JWT as specified
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}; 