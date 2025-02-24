import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		profileImage: {
			type: String,
			default: "", // default profile image
		},
		coverImage: {
			type: String,
			default: "", // default cover image
		},
		bio: {
			type: String,
			default: "", // default bio
		},
		link: {
			type: String,
			default: "", // default link
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
