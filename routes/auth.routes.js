import { Router } from 'express';
import { register, login, logout } from '../controllers/authcontroller.js'; 

const authRouter = Router();


// Path /api/v1/auth/register (POST)
authRouter.post('/register', register);

// Path /api/v1/auth/login (POST)
authRouter.post('/login', login);

// Path /api/v1/auth/logout (POST)
authRouter.post('/logout', logout);

// Path /api/v1/auth/courses (POST)
authRouter.post('/courses', courses);

// Path /api/v1/auth/grades (POST)
authRouter.post('/grades', grades);

export default authRouter;