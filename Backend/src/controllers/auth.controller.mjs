import { generateTokensAndSetCookie } from "../../lib/utils/generateToken.mjs";
import User from "../models/user.model.mjs";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
	try {
		const { username, fullName, email, password } = req.body;
		if (!username || !fullName || !email || !password) {
			return res
				.status(400)
				.json({ message: "All marked * fields are required" });
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}
		const existingEmail = await User.findOne({ email: email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}
		const existingUsername = await User.findOne({ username: username });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}
		if (password.length < 8) {
			return res
				.status(400)
				.json({ message: "Password must be at least 8 characters long" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = new User({
			username,
			fullName,
			email,
			password: hashedPassword,
		});
		if (newUser) {
			generateTokensAndSetCookie(newUser.__id, res);
			await newUser.save();
			return res.status(201).json({ message: "User created successfully" });
		}
		
	} catch (err) {
		console.error(err);
        res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	return res.send("Login");
};

export const logout = async (req, res) => {
	return res.send("Logout");
};
