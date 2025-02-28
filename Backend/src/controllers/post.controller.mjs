import mongoose from "mongoose";
import Post from "../models/posts.model.mjs";
import User from "../models/user.model.mjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notifications.model.mjs";

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		return res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const getUserPosts = async (req, res) => {
	const userId = req.params.userId;
	try {
		const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
		return res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server error" });
	}
};

export const getPost = async (req, res) => {
	const postId = req.params.postId;
	try {
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		return res.status(200).json(post);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Server error" });
	}
};
export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		const { img } = req.body;
		const userId = req.user._id;
		//    console.log(req.user);

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!text && !img) {
			return res.status(400).json({ message: "Please provide text or image" });
		}
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}
		const newPost = new Post({
			text,
			img,
			user: userId,
		});
		await newPost.save();
		return res.status(200).json(newPost);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error" });
	}
};

export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		const userId = req.user._id;
		if (userId.toString() != post.user.toString()) {
			console.log(userId, "---", post.user);

			return res.status(403).json({ message: "Unauthorized" });
		}
		await Post.findByIdAndDelete(req.params.id);
		return res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error" });
	}
};

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		if (!text) {
			return res.status(400).json({ message: "Please provide text" });
		}
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const comment = { user: userId, text };
		post.comments.push(comment);
		await post.save();
		return res.status(200).json(post);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error" });
	}
};

export const likeUnlikePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;
		const post = await Post.findById(postId);
		let message = "";
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		if (post.likes.includes(userId)) {
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likes: postId } });
			// await Post.findByIdAndUpdate(postId, {
			// 	$pull: { likes: userId },
			// });
			await post.save();
			message = "Unliked successfully";
			await Notification.findOneAndDelete({ from: userId, to: post.user });
		} else {
			await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
			await User.updateOne({ _id: userId }, { $push: { likes: postId } });
			// await User.findByIdAndUpdate(userId, { $push: { likes: postId } });
			// await Post.findByIdAndUpdate(postId, {
			// 	$push: { likes: userId },
			// });
			message = "Liked successfully";
			const newNotification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await newNotification.save();
			await post.save();
			// return res.status(200).json({ message: "Liked successfully" });
		}
		return res.status(200).json({ message });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error" });
	}
};
