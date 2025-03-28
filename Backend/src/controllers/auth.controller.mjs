import { generateTokensAndSetCookie } from "../lib/utils/generateToken.mjs";
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
	// console.log("Login");

	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "All marked * fields are required" });
		}
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		// console.log(user);

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}
		generateTokensAndSetCookie(user._id, res);
		return res.json({ message: "Logged in successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const getMe = async (req, res) => {
	try{
		const user= req.user
		if(!user){
            return res.status(401).json({message: "Not authorized"})
        }
		return res.json(user)
	}
	catch(err){
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }
};
