const { connectDB } = require('./database');

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = { initializeDatabase }; 