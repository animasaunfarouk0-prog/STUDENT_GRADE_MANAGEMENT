import { prisma } from "../config/db.js";

const getAllStudents = async (req, res) => {
  const students = await prisma.student.findMany();
  res.json({ students });
};

const getStudentById = async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: Number(req.params.studentId) },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });
  res.json({ student });
};

export { getAllStudents, getStudentById };