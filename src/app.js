import 'dotenv/config';   // must be first
import express from 'express';
import { connectDB, disconnectDB } from './config/db.js';

//Import Routes
import authRouter from './routes/authRoutes.js';
import studentsRouter from './routes/studentsRoutes.js';
import coursesRouter from './routes/coursesRoutes.js';
import gradesRouter from './routes/gradesRoutes.js';
//Import Middlewares

//Import Cookie Parser
import cookieParser from 'cookie-parser';

connectDB();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//API ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentsRouter);
app.use('/api/v1/courses', coursesRouter);
app.use('/api/v1/grades', gradesRouter);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Student Grade Management System" });
});

const server = app.listen(port, () => {
  console.log(`Student Grade Management System is running on http://localhost:${port}`);
});

//Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

//Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await disconnectDB();
  process.exit(1);
});

//Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export default app;