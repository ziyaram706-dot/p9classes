# Test Academy - Learning Management System

A comprehensive e-learning platform built with Next.js, TypeScript, and Prisma.

## Features

### 🎓 Student Features
- **Course Discovery**: Browse self-paced and live courses with detailed information
- **Enrollment System**: Easy enrollment with admin approval workflow
- **Progress Tracking**: Visual progress indicators and module completion tracking
- **Quiz System**: Interactive quizzes with 80% passing requirement
- **Certificate Generation**: Automatic certificate generation upon course completion
- **Dashboard**: Personalized dashboard with course progress and upcoming sessions

### 👨‍🏫 Tutor Features
- **Session Management**: Schedule and manage live sessions
- **Student Tracking**: Monitor student progress and engagement
- **Material Upload**: Share course materials and resources
- **Attendance Management**: Track student attendance for live sessions
- **Dashboard**: Overview of assigned courses and upcoming sessions

### 👨‍💼 Admin Features
- **Course Management**: Create and manage both self-paced and live courses
- **User Management**: Manage students, tutors, and admin accounts
- **Enrollment Management**: Approve/decline enrollment requests
- **Payment Management**: Track and approve payments
- **Analytics Dashboard**: Comprehensive reports and statistics
- **CMS Integration**: Manage homepage content, testimonials, and FAQs

### 🔧 Technical Features
- **Authentication**: Secure authentication with NextAuth.js
- **Database**: SQLite database with Prisma ORM
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Live session notifications and progress updates
- **File Management**: Support for various file types (PDF, DOC, PPT, Video)
- **Payment Integration**: Manual payment approval system

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

The application comes with pre-seeded demo accounts:

- **Admin**: admin@testacademy.com / admin123
- **Tutor**: tutor@testacademy.com / tutor123  
- **Student**: student@testacademy.com / student123

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── tutor/             # Tutor dashboard
│   ├── dashboard/         # Student dashboard
│   ├── courses/           # Course pages
│   └── quiz/              # Quiz system
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/          # Layout components
│   └── providers/        # Context providers
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **PDF Generation**: jsPDF
- **Notifications**: React Hot Toast

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Courses
- `GET /api/courses` - List courses with filters
- `GET /api/courses/[id]` - Get course details
- `POST /api/enrollments` - Submit enrollment request

### Student
- `GET /api/student/enrollments` - Get student enrollments
- `GET /api/student/progress` - Get student progress

### Tutor
- `GET /api/tutor/sessions` - Get tutor sessions
- `GET /api/tutor/students` - Get tutor's students
- `GET /api/tutor/courses` - Get assigned courses

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/enquiries` - Get enquiries
- `PATCH /api/admin/enquiries/[id]` - Update enquiry status
- `GET /api/admin/enrollments` - Get enrollments
- `PATCH /api/admin/enrollments/[id]` - Update enrollment status

### Quiz System
- `GET /api/quiz/[moduleId]` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

### Certificates
- `GET /api/certificate/[courseId]` - Download certificate

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users**: Students, tutors, and admins
- **Courses**: Self-paced and live courses
- **Modules**: Course modules with materials
- **Quizzes**: Module quizzes with questions
- **Enrollments**: Student course enrollments
- **Progress**: Student progress tracking
- **Sessions**: Live course sessions
- **Certificates**: Course completion certificates
- **Enquiries**: Contact form submissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email info@testacademy.com or create an issue in the repository.
