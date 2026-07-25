import express from 'express';
import { checkRole } from '../middlewares/authorizeMiddleware.js';
import { Router } from 'express';

const router = express.Router();

// Check if the user has the required role to access the route
router.post('/', checkRole(['Admin', 'Teacher']), (req, res) => {
    // Logic to save the course
    res.json({ message: "Desired course created successfully" });
});

export default router;
