import { Router } from 'express';

const authRouter = Router();

authRouter.get('/', (req, res) => res.send({ title: 'Auth routes' }));
authRouter.post('/register', (req, res) => res.send({ title: 'Register' }));
authRouter.post('/login', (req, res) => res.send({ title: 'Login' }));
authRouter.post('/courses', (req, res) => res.send({ title: 'Courses' }));
authRouter.post('/grades', (req, res) => res.send({ title: 'Grades' }));

export default authRouter;