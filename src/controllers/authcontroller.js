import { prisma } from "../config/db.js"
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const register = async(req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await prisma.user.findUnique({
      where:{ email: email},
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists with this email"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const finalRole = role || "Student";
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: finalRole,
        verificationToken,
        ...(finalRole === "Student" && {
          student: {
            create: {}
          }
        })
      },
      include: { student: true }
    });

    const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/api/v1/auth/verify/${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your account",
      html: `<p>Hi ${name},</p><p>Please verify your account by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    res.status(201).json({ 
      status: "success",
      message: "Registration successful. Please check your email to verify your account.",
      data: {
        user: {
          id: user.id,
          name: name,
          email: email,
          role: user.role,
          student: user.student
        }
      }
    })
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired verification link" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  });

  res.status(200).json({ status: "success", message: "Email verified successfully. You can now log in." });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password"});
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password"});
  }

  if (!user.isVerified) {
    return res.status(403).json({ error: "Please verify your email before logging in" });
  }

  const token = generateToken(res, user.id);

  res.status(200).json({ 
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    },
  })
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
}



export { register, login, logout, verifyEmail };

