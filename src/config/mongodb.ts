import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongodb = async (): Promise<void> => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`Mongodb Connected: ${con.connection.host}`);
    // Handle connection event
    mongoose.connection.on("error", (err) => {
      console.error("Mongodb Connection error", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongodb disconnected");
      setTimeout(connectMongodb, 5000);
    });
  } catch (error) {
    console.error("Mongodb conection failed", error);
    process.exit(1);
  }
};
export default connectMongodb;
