import { Router } from 'express';
import { register, login, logout } from '../src/controllers/authcontroller.js';

const authRouter = Router();

// POST /api/v1/auth/register — Admin
authRouter.post('/auth/register', checkRole(['Admin']), (req, res) => {
    res.json({ message: "User registered" });
});

// POST /api/v1/auth/login — All Roles
authRouter.post('/auth/login', (req, res) => {
    res.json({ message: "User authenticated, JWT returned" });
});

export default authRouter;