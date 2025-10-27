# Planet Nine Classes - Project Structure

## Overview
Planet Nine Classes is a comprehensive online learning platform built with Next.js 14, featuring role-based access control for Students, Tutors, and Admins.

## Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 15
- **Authentication**: NextAuth.js with JWT
- **Caching**: Redis 7
- **Deployment**: Docker & Docker Compose
- **Security**: bcryptjs, Input validation, Rate limiting

## Project Structure

```
Planet-Nine-Classes/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── admin/                # Admin-specific APIs
│   │   │   ├── certificates/     # Certificate management
│   │   │   ├── enquiries/        # Enquiry management
│   │   │   ├── enrollments/      # Enrollment management
│   │   │   ├── materials/        # Course materials
│   │   │   ├── schedules/        # Class schedules
│   │   │   ├── stats/            # Dashboard statistics
│   │   │   └── users/            # User management
│   │   ├── auth/                 # Authentication APIs
│   │   │   ├── [...nextauth]/    # NextAuth configuration
│   │   │   └── register/         # User registration
│   │   ├── certificate/          # Certificate generation
│   │   ├── cms/                  # Content management
│   │   ├── contact/              # Contact form
│   │   ├── courses/              # Course management
│   │   ├── enrollments/          # Enrollment requests
│   │   ├── health/               # Health check
│   │   ├── quiz/                 # Quiz system
│   │   ├── student/              # Student-specific APIs
│   │   ├── testimonials/         # Testimonials
│   │   ├── tutor/                # Tutor-specific APIs
│   │   └── upload/               # File upload
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Sign in page
│   │   ├── signup/               # Sign up page
│   │   └── forgot-password/      # Password reset
│   ├── admin/                    # Admin dashboard
│   │   ├── enquiries/            # Enquiry management
│   │   └── enrollments/          # Enrollment management
│   ├── courses/                  # Course pages
│   ├── dashboard/                # Student dashboard
│   ├── tutor/                    # Tutor dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── not-found.tsx             # 404 page
├── components/                   # Reusable components
│   ├── layout/                   # Layout components
│   │   ├── footer.tsx            # Footer component
│   │   └── navbar.tsx            # Navigation bar
│   ├── providers/                # Context providers
│   │   └── auth-provider.tsx     # Authentication provider
│   └── ui/                       # UI components
│       ├── badge.tsx             # Badge component
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card component
│       ├── input.tsx             # Input component
│       ├── progress.tsx          # Progress bar
│       └── textarea.tsx          # Textarea component
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   ├── security.ts               # Security utilities
│   └── utils.ts                  # General utilities
├── prisma/                       # Database schema
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding
├── public/                       # Static assets
│   ├── logo.png                  # Application logo
│   └── uploads/                  # User uploads
├── types/                        # TypeScript types
│   └── next-auth.d.ts            # NextAuth type extensions
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── SECURITY_REPORT.md            # Security audit report
└── SECURITY_CONFIGURATION.md     # Security configuration guide
```

## Key Features

### Authentication & Authorization
- **NextAuth.js**: JWT-based authentication
- **Role-based Access**: ADMIN, TUTOR, STUDENT roles
- **Password Security**: bcryptjs with 12 rounds
- **Session Management**: 7-day session expiry

### Course Management
- **Live Courses Only**: No self-paced courses
- **Course Categories**: Web Development, Software Testing, Makeup, Data Science
- **Seat Management**: Limited seats with tracking
- **Batch Scheduling**: Start/end date management

### User Roles

#### Student Features
- Course enrollment and payment tracking
- Access to course materials (when approved)
- Class schedule calendar view
- Certificate download
- Progress tracking

#### Tutor Features
- Course material submission
- Class schedule management
- Attendance marking
- Student progress monitoring

#### Admin Features
- User management (create/activate/deactivate)
- Course creation and management
- Enquiry to enrollment conversion
- CMS management
- Certificate management
- Analytics and reporting

### Security Features
- **Input Validation**: Comprehensive validation and sanitization
- **Rate Limiting**: API endpoint protection
- **SQL Injection Prevention**: Prisma ORM
- **XSS Protection**: HTML sanitization
- **File Upload Security**: Type and size validation
- **CSRF Protection**: NextAuth.js built-in protection

## Database Schema

### Core Models
- **User**: Authentication and profile data
- **Course**: Course information and metadata
- **Enrollment**: Student-course relationships
- **CourseMaterial**: Course content and resources
- **ClassSchedule**: Live class scheduling
- **Certificate**: Course completion certificates
- **Progress**: Student learning progress
- **Session**: Live class sessions
- **Attendance**: Class attendance tracking

### Relationships
- Users can have multiple enrollments
- Courses can have multiple materials and schedules
- Enrollments track payment and completion status
- Certificates are generated upon course completion

## API Endpoints

### Public Endpoints
- `GET /api/courses` - List all active courses
- `GET /api/courses/[id]` - Get course details
- `POST /api/contact` - Submit contact form
- `GET /api/health` - Health check

### Authentication Required
- `POST /api/auth/register` - User registration
- `GET /api/auth/session` - Get current session

### Role-based Endpoints
- **Student**: `/api/student/*` - Student-specific data
- **Tutor**: `/api/tutor/*` - Tutor-specific data
- **Admin**: `/api/admin/*` - Admin management functions

## Security Considerations

### Current Security Measures
- ✅ Dependency vulnerabilities fixed
- ✅ Input validation and sanitization
- ✅ Password hashing with bcryptjs
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Rate limiting implementation
- ✅ Role-based access control

### Security Recommendations
- 🔄 Change default passwords and secrets
- 🔄 Enable HTTPS in production
- 🔄 Implement comprehensive logging
- 🔄 Add file upload security measures
- 🔄 Set up security monitoring

## Deployment

### Docker Configuration
- **PostgreSQL**: Database server
- **Redis**: Caching and session storage
- **Next.js App**: Main application
- **Network**: Isolated Docker network

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: Authentication secret

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd planet-nine-classes

# Start with Docker
docker-compose up -d

# Access application
open http://localhost:3002
```

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Maintenance

### Regular Tasks
- **Weekly**: Security log review
- **Monthly**: Dependency updates
- **Quarterly**: Security audit
- **Annually**: Penetration testing

### Backup Procedures
- **Database**: Automated PostgreSQL dumps
- **Files**: User uploads backup
- **Code**: Version control with Git

## Support

For technical support or security concerns:
- **Email**: support@planetnineclasses.com
- **Security**: security@planetnineclasses.com
- **Documentation**: See SECURITY_REPORT.md and SECURITY_CONFIGURATION.md

---

**Last Updated**: October 14, 2025
**Version**: 1.0.0
**Security Score**: 7.5/10
