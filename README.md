# Student Grade Management System

A RESTful API for managing students, courses, and grades — built with Node.js, Express, PostgreSQL, and Prisma. Features role-based access control, JWT authentication, email verification, and automated grade alert emails.

## Features

- **Authentication** — Register, login, logout using JWT stored in httpOnly cookies
- **Email Verification** — New accounts must verify their email before logging in
- **Role-Based Access Control** — Three roles: `Admin`, `Teacher`, `Student`, each with different permissions
- **Student Management** — View student profiles and enrollment details
- **Course Management** — Full CRUD for courses (create, read, update, delete)
- **Grade Management** — Record, view, update, and delete grades, with automatic letter grade calculation
- **Grade Alert Emails** — Students are automatically emailed whenever a grade is recorded for them
- **Password Security** — Passwords hashed with bcrypt, never stored or transmitted in plain text

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma (with `@prisma/adapter-pg` driver adapter) |
| Authentication | JSON Web Tokens (JWT), httpOnly cookies |
| Password Hashing | bcryptjs |
| Email | Resend |

## Project Structure

```
STUDENT_GRADE_MANAGEMENT/
├── prisma/
│   └── schema.prisma          # Database models: User, Student, Course, Grade
├── src/
│   ├── config/
│   │   └── db.js              # Prisma Client setup with driver adapter
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentsController.js
│   │   ├── coursesController.js
│   │   └── gradesController.js
│   ├── middlewares/
│   │   └── authMiddleware.js  # protect (JWT verification) and checkRole (role guard)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentsRoutes.js
│   │   ├── coursesRoutes.js
│   │   └── gradesRoutes.js
│   ├── utils/
│   │   ├── generateToken.js   # Signs JWT and sets it as an httpOnly cookie
│   │   ├── sendEmail.js        # Resend email wrapper
│   │   └── getLetterGrade.js  # Converts numeric score to letter grade
│   └── app.js                 # Express app entry point
├── .env
├── package.json
└── README.md
```

## Data Models

**User** — id, name, email (unique), passwordHash, role, isVerified, verificationToken, timestamps

**Student** — id, userId (linked to User), enrollmentNo, dateOfBirth, timestamps

**Course** — id, title, courseCode, units, createdById (linked to User), timestamps

**Grade** — id, studentId, courseId, score, comment, recordedById (linked to User), timestamps
*(One grade per student per course — enforced by a unique constraint)*

## Grading Scale

| Score Range | Letter Grade |
|---|---|
| 70 and above | A |
| 60 – 69 | B |
| 50 – 59 | C |
| 45 – 49 | D |
| Below 45 | F |

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database (local or hosted)
- A [Resend](https://resend.com) account and API key (for sending emails)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
JWT_SECRET=your_random_secret_string
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:3000
```

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Run the Server

```bash
npm run dev
```

The server starts on `http://localhost:3000` by default.

## API Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user (defaults to `Student` role) |
| GET | `/verify/:token` | Public | Verify a new account's email |
| POST | `/login` | Public (verified users only) | Log in and receive a JWT cookie |
| POST | `/logout` | Authenticated | Clear the JWT cookie |

### Students (`/api/v1/students`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin, Teacher | List all students |
| GET | `/:studentId` | Admin, Teacher | Get a single student's details |
| GET | `/:studentId/grades` | Student, Teacher, Admin | Get a student's grade list |
| GET | `/:studentId/report` | Student, Teacher, Admin | Generate an academic report |

### Courses (`/api/v1/courses`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin, Teacher | Create a new course |
| GET | `/` | Admin, Teacher, Student | List all courses |
| GET | `/:courseId` | Admin, Teacher, Student | Get a single course's details |
| PATCH | `/:courseId` | Admin, Teacher | Update a course |
| DELETE | `/:courseId` | Admin | Delete a course |

### Grades (`/api/v1/grades`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin, Teacher | Record a new grade (sends a grade alert email) |
| GET | `/me` | Student | Get the logged-in student's own grades |
| GET | `/` | Admin, Teacher | List all grades |
| GET | `/:gradeId` | Admin, Teacher | Get a single grade's details |
| PATCH | `/:gradeId` | Admin, Teacher | Update a grade |
| DELETE | `/:gradeId` | Admin | Delete a grade |

## Authentication Flow

1. A user registers via `POST /api/v1/auth/register`, providing `name`, `email`, `password`, and optionally `role`.
2. A verification email is sent via Resend containing a unique link.
3. The user must click the link (`GET /api/v1/auth/verify/:token`) to activate their account.
4. Once verified, the user can log in via `POST /api/v1/auth/login`.
5. On successful login, a JWT is signed and set as an httpOnly cookie, valid for 7 days.
6. Protected routes use two middleware functions:
   - `protect` — verifies the JWT and attaches the authenticated user to `req.user`
   - `checkRole([...])` — restricts access to specific roles

## Role Permissions Summary

| Action | Admin | Teacher | Student |
|---|---|---|---|
| Register / Login | ✅ | ✅ | ✅ |
| View all students | ✅ | ✅ | ❌ |
| Create / update courses | ✅ | ✅ | ❌ |
| Delete courses | ✅ | ❌ | ❌ |
| Record / update grades | ✅ | ✅ | ❌ |
| Delete grades | ✅ | ❌ | ❌ |
| View own grades | ✅ | ✅ | ✅ |

## Challenges & Lessons Learned

Building this project involved working through a number of real-world issues, including:

- **Prisma 7 driver adapter requirement** — Newer versions of Prisma Client require an explicit driver adapter (e.g. `@prisma/adapter-pg`) rather than connecting directly via `DATABASE_URL`. Learned to pass the adapter into the `PrismaClient` constructor correctly.
- **ES Modules vs CommonJS** — The project uses ES Modules (`import`/`export`) throughout, which required consistent use of file extensions in import paths and careful handling of `async`/`await` inside callback functions (e.g. `process.on('uncaughtException', async (err) => {...})`).
- **Schema-to-code field mismatches** — Several bugs arose from controller code referencing field names (e.g. `password` vs `passwordHash`) that didn't match the actual Prisma schema. This reinforced the importance of keeping `schema.prisma` and controller logic in sync, and running `npx prisma generate` after every schema change.
- **Migrations not applying** — At one point, schema changes were saved but never migrated, causing "Unknown argument" errors even though the code looked correct. Resolved by explicitly running `npx prisma migrate dev` and confirming column changes directly in pgAdmin.
- **Route mounting and path duplication** — Errors like `Cannot POST /api/v1/auth/register` were traced back to Express route prefixes being duplicated between `app.js` and the router files (e.g. `/auth` appearing twice in the full path).
- **Authentication middleware ordering** — `checkRole` depends on `req.user` being set by `protect` first; running them in the wrong order would cause the role check to fail against `undefined`.
- **JWT payload errors** — Passing the wrong argument order into `generateToken(res, userId)` caused the entire Express response object to be serialized into the JWT payload, throwing a circular structure error. Fixed by aligning the function signature with how it was called.
- **Email delivery restrictions** — Using Resend's free-tier test domain (`onboarding@resend.dev`) only allows sending to the developer's own verified email address, which required testing grade alerts using a real student account tied to that same email.
- **Network connectivity issues** — Intermittent `ECONNRESET` and `ENOENT` errors during `npm install` were resolved by checking DNS resolution, clearing npm's proxy config, and retrying with adjusted timeout settings.

## Notes

- Passwords are never stored in plain text — only bcrypt hashes.
- Emails are currently sent via Resend's test domain (`onboarding@resend.dev`), which can only deliver to the email address associated with the Resend account in use. A verified custom domain is required for sending to arbitrary recipients in production.
- Deleting a course or a student cascades to delete their associated grades, per the database schema's relational constraints.
