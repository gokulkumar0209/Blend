import express, { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.mjs";
import {
	followUnfollowUser,
	getUserProfile,
} from "../controllers/user.controller.mjs";

const userRouter = Router();

userRouter.get("/profile/:username", protectRoute, getUserProfile);
// userRouter.get("/suggested", getUserProfile)
userRouter.post("/follow/:id", protectRoute, followUnfollowUser);
// userRouter.post("/update", protectRoute, updateUserProfile)

export default userRouter;
