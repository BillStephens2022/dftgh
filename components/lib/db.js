import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Here is my MONGODB URI: " + MONGODB_URI);
const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default dbConnect;

