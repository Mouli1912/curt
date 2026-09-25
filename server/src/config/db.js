const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.SKIP_DB === 'true') {
    console.log('[Database] Skipping MongoDB connection (in-memory / static graph mode).');
    return;
  }
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillpath';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 1000,
      connectTimeoutMS: 1000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${mongoURI} (${error.message}). Operating in static graph fallback mode.`);
  }
};

module.exports = connectDB;
