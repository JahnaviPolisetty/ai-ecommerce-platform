import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Database connection placeholder called. Provide MONGO_URI in .env to connect.');
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected`);
    } else {
      console.log('Skipping MongoDB connection (MONGO_URI not provided). Using mock data modes.');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}\nContinuing without database access...`);
    // Removed process.exit(1) to allow the server to keep running
  }
};

export default connectDB;
