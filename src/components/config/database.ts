import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://faheemakhtar19730:Faheemkh12@cluster0.tvmmvdg.mongodb.net/', {
      dbName: 'your-db-name', // optional: specify your DB name
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
