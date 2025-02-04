import express from "express";
import { authRouter, orderRouter, productRouter } from "./routes/index.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
const port = 3000;

//cloudinary
// config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
//allow read img file from public
app.use(express.static("./public"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);

//middleware
app.use(errorHandler);
app.use(notFound);

//connect DB
try {
  await mongoose.connect(process.env.DATABASE);
  console.log("success to connect database");
} catch (error) {
  console.log("failed to connect database ");
}

app.listen(port, () => {
  console.log("aplikasi berjalan di port " + port);
});
