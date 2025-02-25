import User from "../models/user.model.mjs";
import jwt from "jsonwebtoken"
export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt; 
		if (!token) return res.status(401).json({ message: "Token not available" });
		const decoded = jwt.verify(token, process.env.JWT_SECRET); 
		if (!decoded) return res.status(401).json({ message: "Error in decoding" });
		req.user = await User.findById(decoded.userId).select("-password");
		if (!req.user) return res.status(401).json({ message: "unable to create req.user" });
		next();
	} catch (error) {
		return res.status(401).json({ message: "Server error" });
	}
};
