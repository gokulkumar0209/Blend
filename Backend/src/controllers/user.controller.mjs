import mongoose from "mongoose";
import User from "../models/user.model.mjs";
import Notification from "../models/notifications.model.mjs";

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
