const mongoose = require('mongoose');

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGO_DB || "mongodb+srv://chamuditha:chamu@plumbx.dnrsk.mongodb.net/?retryWrites=true&w=majority&appName=PlumbX";

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connection state
let isConnected = false;

// Connect to MongoDB
const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Get connection status
const getConnectionStatus = () => {
  return {
    isConnected: isConnected,
    connectionState: mongoose.connection.readyState
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  };
};

module.exports = { connectDB, getConnectionStatus }; 