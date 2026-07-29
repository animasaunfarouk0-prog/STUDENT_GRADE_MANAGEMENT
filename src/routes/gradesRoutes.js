import express from 'express';
import { protect, checkRole } from '../middlewares/authMiddleware.js';
import {createGrade, getAllGrades, getGradeById, getMyGrades, updateGrade, deleteGrade,} from '../controllers/gradesController.js';

const router = express.Router();

// Check if the user has the required role to access the route
// Record a new grade
router.post('/', protect, checkRole(['Admin', 'Teacher']), createGrade);

// Check if the user has the required role to access the route
// Get the logged-in student's own grades
router.get('/me', protect, checkRole(['Student']), getMyGrades);

// Check if the user has the required role to access the route
// Get a list of all grades
router.get('/', protect, checkRole(['Admin', 'Teacher']), getAllGrades);

// Check if the user has the required role to access the route
// Get a particular grade by ID
router.get('/:gradeId', protect, checkRole(['Admin', 'Teacher']), getGradeById);

// Check if the user has the required role to access the route
// Update a grade
router.patch('/:gradeId', protect, checkRole(['Admin', 'Teacher']), updateGrade);

// Check if the user has the required role to access the route
// Delete a grade
router.delete('/:gradeId', protect, checkRole(['Admin']), deleteGrade);

export default router;