import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./src/db/connectMongoDB.mjs";
import cookieParser from "cookie-parser";
import router from "./src/routes/index.routes.mjs";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(
	cors({
		origin: "*",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Authorization",
		],
		exposedHeaders: ["Set-Cookie"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data(req.body)
app.use(cookieParser());
app.use("/", router);

const port = process.env.PORT || 8081;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	connectMongoDB();
});
