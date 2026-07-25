import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

//Import Routes
import authRouter from './routes/authRoutes.js';
//Import Middlewares
import validationMiddlewares from './middlewares/validationMiddleware.js';
//Import Cookie Parser
import cookieParser from 'cookie-parser';

config();
connectDB();


const app = express();
const port = Number(PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);



//http://localhost:3000

app.listen(port, () => {
  console.log(`Student Grade Management System is running on http://localhost:${port}`);
});

//Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(async (err) => {
  await disconnectDB();
    process.exit(1);
  });
});


//Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  await disconnectDB();
  process.exit(1);
});


//Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await disconnectDB();
    process.exit("0");
  });
});






export default app;