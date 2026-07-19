import { Router } from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => res.send({ title: 'User routes' }));
userRouter.get('/:id', (req, res) => res.send({ title: 'View a student\'s grades' }));
userRouter.get('/reports/:id', (req, res) => res.send({ title: 'Generate a full grade report/transcript' }));

export default userRouter;