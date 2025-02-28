import { Router } from "express";
import authRouter from "./auth.routes.mjs";
import userRouter from "./user.routes.mjs";
import postRouter from "./post.routes.mjs";

const router = Router();
router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);
router.use("/api/post", postRouter);

export default router;
