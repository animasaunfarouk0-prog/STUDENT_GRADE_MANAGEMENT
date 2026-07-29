import { prisma } from "../config/db.js";
import { getLetterGrade } from "../utils/getLetterGrade.js";

// Record a new grade
import { sendEmail } from "../utils/sendEmail.js";

const createGrade = async (req, res) => {
  const { studentId, courseId, score, comment } = req.body;

  const grade = await prisma.grade.create({
    data: {
      studentId,
      courseId,
      score,
      comment,
      recordedById: req.user.id,
    },
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      course: { select: { title: true, courseCode: true } },
    },
  });

  const letterGrade = getLetterGrade(grade.score);

  // Send grade alert email to the student
  await sendEmail({
    to: grade.student.user.email,
    subject: `New grade recorded: ${grade.course.title}`,
    html: `
      <p>Hi ${grade.student.user.name},</p>
      <p>A new grade has been recorded for you:</p>
      <ul>
        <li><strong>Course:</strong> ${grade.course.title} (${grade.course.courseCode})</li>
        <li><strong>Score:</strong> ${grade.score}</li>
        <li><strong>Letter Grade:</strong> ${letterGrade}</li>
        ${grade.comment ? `<li><strong>Comment:</strong> ${grade.comment}</li>` : ""}
      </ul>
    `,
  });

  res.status(201).json({
    status: "success",
    data: { grade: { ...grade, letterGrade } },
  });
};

// Get all grades (Admin, Teacher)
const getAllGrades = async (req, res) => {
  const grades = await prisma.grade.findMany({
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      course: { select: { title: true, courseCode: true } },
    },
  });

  const gradesWithLetters = grades.map((grade) => ({
    ...grade,
    letterGrade: getLetterGrade(grade.score),
  }));

  res.json({ grades: gradesWithLetters });
};

// Get a specific grade by ID
const getGradeById = async (req, res) => {
  const grade = await prisma.grade.findUnique({
    where: { id: Number(req.params.gradeId) },
    include: {
      student: { include: { user: { select: { name: true, email: true } } } },
      course: { select: { title: true, courseCode: true } },
    },
  });

  if (!grade) {
    return res.status(404).json({ error: "Grade not found" });
  }

  res.json({ grade: { ...grade, letterGrade: getLetterGrade(grade.score) } });
};

// Get the logged-in student's own grades
const getMyGrades = async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
  });

  if (!student) {
    return res.status(404).json({ error: "Student profile not found" });
  }

  const grades = await prisma.grade.findMany({
    where: { studentId: student.id },
    include: {
      course: { select: { title: true, courseCode: true } },
    },
  });

  const gradesWithLetters = grades.map((grade) => ({
    ...grade,
    letterGrade: getLetterGrade(grade.score),
  }));

  res.json({ grades: gradesWithLetters });
};

// Update a grade
const updateGrade = async (req, res) => {
  const { score, comment } = req.body;

  const grade = await prisma.grade.update({
    where: { id: Number(req.params.gradeId) },
    data: { score, comment },
  });

  res.json({
    status: "success",
    data: { grade: { ...grade, letterGrade: getLetterGrade(grade.score) } },
  });
};

// Delete a grade
const deleteGrade = async (req, res) => {
  await prisma.grade.delete({
    where: { id: Number(req.params.gradeId) },
  });

  res.json({ status: "success", message: "Grade deleted" });
};

export { createGrade, getAllGrades, getGradeById, getMyGrades, updateGrade, deleteGrade };