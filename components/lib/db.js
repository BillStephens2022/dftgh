// import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// export default async function connectToDatabase() {
  // const pwParam = encodeURIComponent(process.env.MONGODB_PW);
  // const client = await MongoClient.connect(
  //   `mongodb+srv://two4onebill:${pwParam}@cluster0.xvwjnur.mongodb.net/dftgh?retryWrites=true&w=majority`
  // );
//   return client;
// }

const MONGODB_URI = process.env.MONGODB_URI;

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

