import mongoose from "mongoose";
import User from "../models/user.model.mjs";
import Notification from "../models/notifications.model.mjs";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
export const getUserProfile = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const followUnfollowUser = async (req, res) => {
	const { id } = req.params;
	const userToFollowId = id;
	const currentUserId = req.user._id;
	if (!currentUserId) {
		return res.status(401).json({ message: "Not authorized" });
	}
	if (!userToFollowId) {
		return res.status(404).json({ message: "User not found" });
	}

	try {
		const userToFollow = await User.findById(userToFollowId);
		const currentUser = await User.findById(currentUserId);

		if (!userToFollow || !currentUser) {
			return res.status(404).json({ message: "User not found" });
		}
		if (userToFollow == currentUser) {
			return res.status(400).json({ message: "Cannot follow yourself" });
		}
		if (currentUser.following.includes(userToFollowId)) {
			await User.findByIdAndUpdate(currentUserId, {
				$pull: { following: userToFollowId },
			});
			await User.findByIdAndUpdate(userToFollowId, {
				$pull: { followers: currentUserId },
			});
			return res.status(200).json({ message: "User unfollowed" });
		} else {
			await User.findByIdAndUpdate(currentUserId, {
				$push: { following: userToFollowId },
			});

			await User.findByIdAndUpdate(userToFollowId, {
				$push: { followers: currentUserId },
			});
			const newNotification = new Notification({
				type: "follow",
				from: currentUserId,
				to: userToFollowId,
			});
			await newNotification.save();
			//  ToDo: Retuen the id of the user as response
			return res.status(200).json({ message: "User followed" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;
		const usersFollowedByMe = await User.findById(userId).select("following");
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter(
			(user) => !usersFollowedByMe.following.includes(user._id)
		);
		const suggestedUsers = filteredUsers.slice(0, 4);
		suggestedUsers.forEach((user) => (user.password = null));
		return res.status(200).json(suggestedUsers);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const updateUserProfile = async (req, res) => {
	const { fullName, email, currentPassword, newPassword, bio, link } = req.body;
	let { profileImage, coverImage } = req.body;
	const userId = req.user._id;
	try {
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (
			(!newPassword && currentPassword) ||
			(newPassword && !currentPassword)
		) {
			return res
				.status(400)
				.json({ message: "Need both new and current password " });
		}
		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) {
				return res.status(401).json({ message: "Invalid current password" });
			}
			if (newPassword.length < 8) {
				return res.status(401).json({ message: "Password too short" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);
			user.password = hashedPassword;
		}

		if (profileImage) {
			if (user.profileImage) {
				await cloudinary.uploader.destroy(
					user.profileImage.split("/").pop().split(".")[0]
				);
			}
			const uploadedResponse = await cloudinary.uploader.upload(profileImage);
			profileImage = uploadedResponse.secure_url;
		}
		if (coverImage) {
			if (user.coverImage) {
				await cloudinary.uploader.destroy(
					user.coverImage.split("/").pop().split(".")[0]
				);
			}
			const uploadedResponse = await cloudinary.uploader.upload(coverImage);
			coverImage = uploadedResponse.secure_url;
		}
		if (fullName) user.fullName = fullName;
		if (email) user.email = email;
		if (bio) user.bio = bio;
		if (link) user.link = link;
		user.profileImage = profileImage || user.profileImage;
		user.coverImage = coverImage || user.coverImage;
		await user.save();
		user.password = null;
		return res.status(200).json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};
