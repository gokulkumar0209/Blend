import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.mjs";
import {
	followUnfollowUser,
	getSuggestedUsers,
	getUserProfile,
} from "../controllers/user.controller.mjs";

const userRouter = Router();

userRouter.get("/profile/:username", protectRoute, getUserProfile);
userRouter.get("/suggested", protectRoute, getSuggestedUsers);
userRouter.post("/follow/:id", protectRoute, followUnfollowUser);
// userRouter.post("/update", protectRoute, updateUserProfile)

export default userRouter;
