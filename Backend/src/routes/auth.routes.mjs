import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.mjs";

const router = Router();

router.get("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
