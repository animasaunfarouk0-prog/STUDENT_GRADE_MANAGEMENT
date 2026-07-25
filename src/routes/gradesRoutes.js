import express from 'express';
import { checkRole } from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

// Matches: POST /api/v1/grades
router.post('/grades', checkRole(['Teacher']), (req, res) => {
    res.json({ message: "Initial grade entry recorded" });
});

// Matches: PUT /api/v1/grades/:id
router.put('/grades/:id', checkRole(['Teacher']), (req, res) => {
    const { id } = req.params; // Extracts the grade ID from the URL
    res.json({ message: `Grade entry ${id} updated` });
});


export default router;
