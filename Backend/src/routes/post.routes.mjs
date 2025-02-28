import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.mjs";
import {
	commentOnPost,
	createPost,
	deletePost,
	likeUnlikePost,
	getAllPosts,
	getPost,
    getUserPosts,
} from "../controllers/post.controller.mjs";

const postRouter = Router();

postRouter.get("/all", protectRoute, getAllPosts)
postRouter.get("/all/:userId", protectRoute, getUserPosts);
postRouter.get("/:postId", protectRoute, getPost);
postRouter.post("/create", protectRoute, createPost);
postRouter.post("/like/:id", protectRoute, likeUnlikePost);
postRouter.post("/comment/:id", protectRoute, commentOnPost);
postRouter.delete("/:id", protectRoute, deletePost);

export default postRouter;
