import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.mjs";
import connectMongoDB from "./src/db/connectMongoDB.mjs";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data(req.body)
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 8081;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
	connectMongoDB();
});
