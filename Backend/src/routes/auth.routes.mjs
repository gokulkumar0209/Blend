import { Router } from "express";
import {
	getMe,
	login,
	logout,
	signup,
} from "../controllers/auth.controller.mjs";
import { protectRoute } from "../middleware/protectRoute.mjs";

const authRouter = Router();

authRouter.get("/me", protectRoute, getMe);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
