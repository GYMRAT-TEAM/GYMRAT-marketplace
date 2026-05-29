const mongoose = require('mongoose');
const logger = require('../utils/logger'); // or use console if logger fails

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (logger && logger.info) {
      logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    if (logger && logger.warn) {
      logger.warn(`Atlas Connection Failed: ${error.message}. Attempting Local Fallback...`);
    } else {
      console.warn(`Atlas Connection Failed: ${error.message}. Attempting Local Fallback...`);
    }
    
    try {
      await mongoose.connect('mongodb://localhost:27017/gymrat');
      console.log('✅ Connected to Local MongoDB fallback!');
    } catch (localError) {
      console.error('❌ CRITICAL: Both Atlas and Local MongoDB failed.');
      // process.exit(1); 
    }
  }
};

module.exports = connectDB;