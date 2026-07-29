import express from "express";
import { register, login, logout, verifyEmail}from '../controllers/authController.js';

const authRouter = express.Router();

// POST /api/v1/auth/register — Student
authRouter.post("/register", register);

// POST /api/v1/auth/login — All Roles
authRouter.post("/login", login);

// POST /api/v1/auth/logout — All Roles
authRouter.post("/logout", logout);

// GET  /api/v1/auth/verifyEmail
authRouter.get("/verify/:token", verifyEmail);

export default authRouter;