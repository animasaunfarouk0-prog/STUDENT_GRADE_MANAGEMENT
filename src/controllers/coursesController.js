import { prisma } from "../config/db.js";

// Create a new course
const createCourse = async (req, res) => {
  const { title, courseCode, units } = req.body;

  const course = await prisma.course.create({
    data: {
      title,
      courseCode,
      units,
      createdById: req.user.id,
    },
  });

  res.status(201).json({ status: "success", data: { course } });
};

// Get a list of all courses
const getAllCourses = async (req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });

  res.json({ courses });
};

// Get a particular course by ID
const getCourseById = async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: Number(req.params.courseId) },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  res.json({ course });
};

// Update a course's details
const updateCourse = async (req, res) => {
  const { title, courseCode, units } = req.body;

  const course = await prisma.course.update({
    where: { id: Number(req.params.courseId) },
    data: { title, courseCode, units },
  });

  res.json({ status: "success", data: { course } });
};

// Delete a course
const deleteCourse = async (req, res) => {
  await prisma.course.delete({
    where: { id: Number(req.params.courseId) },
  });

  res.json({ status: "success", message: "Course deleted" });
};

export { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };