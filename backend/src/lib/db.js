import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chat_app",
    });
    console.log("mongoDB connected");
  } catch (error) {
    console.log("mongoDB connection error :", error);
  }
};
