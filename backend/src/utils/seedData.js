const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const User = require('../models/userModel');

// Sample user data matching the frontend mockUsers
const users = [
  {
    name: 'John Inventory',
    email: 'inventory@plumbx.com',
    password: '123456',
    role: 'inventory'
  },
  {
    name: 'Jane Employee',
    email: 'employee@plumbx.com',
    password: '123456',
    role: 'employee'
  },
  {
    name: 'Mike Delivery',
    email: 'delivery@plumbx.com',
    password: '123456',
    role: 'delivery'
  },
  {
    name: 'Sarah Finance',
    email: 'finance@plumbx.com',
    password: '123456',
    role: 'finance'
  },
  {
    name: 'Tom Customer',
    email: 'customer@plumbx.com',
    password: '123456',
    role: 'customer'
  },
  {
    name: 'Admin User',
    email: 'admin@plumbx.com',
    password: '123456',
    role: 'admin'
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log('Users cleared');

    // Create users with hashed passwords
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 