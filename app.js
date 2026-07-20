import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import connectTODatabase from './database/mongodb.js';
import validationMiddlewares from './middlewares/validationMiddlewares.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = Number(PORT) || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.use(validationMiddlewares);

app.get('/', (req, res) => {
  res.send('Welcome to the Student Grade Management System!');
});

app.listen(port, async () => {
  console.log(`Student Grade Management System is running on http://localhost:${port}`);

  await connectTODatabase()
});

export default app;