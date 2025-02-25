import { Router } from "express";
import authRouter from "./auth.routes.mjs";
import userRouter from "./user.routes.mjs";


const router= Router()
router.use("/api/auth",authRouter)
router.use("/api/user",userRouter)

export default router;
