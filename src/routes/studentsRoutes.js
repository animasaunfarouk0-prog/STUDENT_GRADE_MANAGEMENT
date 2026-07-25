import express from 'express';
import { checkRole } from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

// Check if the user has the required role to access the route
// Get a particular student by ID
router.get('/:studentId/grades', checkRole(['Student', 'Teacher', 'Admin']), (req, res) => {
    const { studentId } = req.params;
    res.json({ message: `Fetched grade list for student ${studentId}` });
});

// Check if the user has the required role to access the route
// Generate academic report for a specific student
router.get('/:studentId/report', checkRole(['Student', 'Teacher', 'Admin']), (req, res) => {
    const { studentId } = req.params;
    res.json({ message: `Generated academic report for student ${studentId}` });
});


export default router;