require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getConnectionStatus } = require('./config/database');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.get('/api/status', (req, res) => {
  const { isConnected, connectionState } = getConnectionStatus();
  
  let statusMessage;
  switch(connectionState) {
    case 0:
      statusMessage = 'Disconnected';
      break;
    case 1:
      statusMessage = 'Connected';
      break;
    case 2:
      statusMessage = 'Connecting';
      break;
    case 3:
      statusMessage = 'Disconnecting';
      break;
    default:
      statusMessage = 'Unknown';
  }
  
  res.json({
    status: isConnected ? 'success' : 'error',
    message: `MongoDB is ${statusMessage}`,
    connectionState
  });
});

// Import route files
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const financeRoutes = require('./routes/financeRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/finance', financeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
}); 