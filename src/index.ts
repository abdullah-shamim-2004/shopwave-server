import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongodb from "./config/mongodb.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 500;
//middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(cookieParser());

// Start server
const start = async () => {
  try {
    // connect mongodb
    await connectMongodb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
};
start();
