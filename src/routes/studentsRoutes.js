import express from 'express';
import { protect, checkRole } from '../middlewares/authMiddleware.js';
import { getAllStudents, getStudentById } from '../controllers/studentsController.js';

const router = express.Router();

// Check if the user has the required role to access the route
// Get a list of all students
router.get('/', protect, checkRole(['Admin', 'Teacher']), getAllStudents);

// Check if the user has the required role to access the route
// Get a particular student by ID
router.get('/:studentId', protect, checkRole(['Admin', 'Teacher']), getStudentById);

// Check if the user has the required role to access the route
// Get grade list for a specific student
router.get('/:studentId/grades', protect, checkRole(['Student', 'Teacher', 'Admin']), (req, res) => {
    const { studentId } = req.params;
    res.json({ message: `Fetched grade list for student ${studentId}` });
});

// Check if the user has the required role to access the route
// Generate academic report for a specific student
router.get('/:studentId/report', protect, checkRole(['Student', 'Teacher', 'Admin']), (req, res) => {
    const { studentId } = req.params;
    res.json({ message: `Generated academic report for student ${studentId}` });
});

export default router;