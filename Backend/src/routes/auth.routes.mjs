import { Router } from "express";
import {
	getMe,
	login,
	logout,
	signup,
} from "../controllers/auth.controller.mjs";
import { protectRoute } from "../middleware/protectRoute.mjs";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
