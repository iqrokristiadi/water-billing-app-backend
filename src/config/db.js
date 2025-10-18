import mongoose from "mongoose";
import log from "../utils/logger.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Optional options for stability
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    log.success(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    log.error("MongoDB connection error: ", error.message);
    process.exit(1); //Exit process if DB fails
  }
};

export default connectDB;
