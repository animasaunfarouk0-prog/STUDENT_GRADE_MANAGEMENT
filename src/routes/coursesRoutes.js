import express from 'express';
import { protect, checkRole } from '../middlewares/authMiddleware.js';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/coursesController.js';

const router = express.Router();

// Check if the user has the required role to access the route
// Create a new course
router.post('/', protect, checkRole(['Admin', 'Teacher']), createCourse);

// Check if the user has the required role to access the route
// Get a list of all courses
router.get('/', protect, checkRole(['Admin', 'Teacher', 'Student']), getAllCourses);

// Check if the user has the required role to access the route
// Get a particular course by ID
router.get('/:courseId', protect, checkRole(['Admin', 'Teacher', 'Student']), getCourseById);

// Check if the user has the required role to access the route
// Update a course's details
router.patch('/:courseId', protect, checkRole(['Admin', 'Teacher']), updateCourse);

// Check if the user has the required role to access the route
// Delete a course
router.delete('/:courseId', protect, checkRole(['Admin']), deleteCourse);

export default router;