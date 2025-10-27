import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@testacademy.com' },
    update: {},
    create: {
      email: 'admin@testacademy.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  // Create tutor user
  const tutorPassword = await bcrypt.hash('tutor123', 10)
  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@testacademy.com' },
    update: {},
    create: {
      email: 'tutor@testacademy.com',
      name: 'John Tutor',
      password: tutorPassword,
      role: 'TUTOR',
      isActive: true,
      createdBy: admin.id,
    },
  })

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.upsert({
    where: { email: 'student@testacademy.com' },
    update: {},
    create: {
      email: 'student@testacademy.com',
      name: 'Jane Student',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true,
    },
  })

  // Create live course
  const liveCourse = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch with modern technologies',
      type: 'LIVE',
      category: 'WEB_DEVELOPMENT',
      price: 2999,
      discountedPrice: 1999,
      features: [
        'HTML, CSS, JavaScript',
        'React.js & Node.js',
        'Database Design',
        'Deployment & DevOps',
        'Project Portfolio',
        'Live Sessions'
      ],
      imageUrl: '/images/web-dev-course.jpg',
      status: 'ACTIVE',
      tutorId: tutor.id,
      batchStartDate: new Date('2024-02-01'),
      batchEndDate: new Date('2024-04-30'),
      totalSeats: 30,
      seatsLeft: 25,
      courseHours: 120
    },
  })

  // Create another live course
  const dataScienceCourse = await prisma.course.create({
    data: {
      title: 'Data Science & Machine Learning',
      description: 'Master data science and machine learning with Python',
      type: 'LIVE',
      category: 'DATA_SCIENCE',
      price: 3999,
      discountedPrice: 2999,
      features: [
        'Python Programming',
        'Data Analysis',
        'Machine Learning',
        'Deep Learning',
        'Real-world Projects',
        'Live Sessions'
      ],
      imageUrl: '/images/data-science-course.jpg',
      status: 'ACTIVE',
      tutorId: tutor.id,
      batchStartDate: new Date('2024-03-01'),
      batchEndDate: new Date('2024-05-31'),
      totalSeats: 25,
      seatsLeft: 20,
      courseHours: 150
    },
  })

  // Create completed course
  const completedCourse = await prisma.course.create({
    data: {
      title: 'Digital Marketing Mastery',
      description: 'Complete digital marketing course covering all aspects',
      type: 'LIVE',
      category: 'DIGITAL_MARKETING',
      price: 1999,
      discountedPrice: 1499,
      features: [
        'SEO & SEM',
        'Social Media Marketing',
        'Content Marketing',
        'Email Marketing',
        'Analytics & Reporting',
        'Live Sessions'
      ],
      imageUrl: '/images/digital-marketing-course.jpg',
      status: 'COMPLETED',
      tutorId: tutor.id,
      batchStartDate: new Date('2023-10-01'),
      batchEndDate: new Date('2023-12-31'),
      totalSeats: 20,
      seatsLeft: 0,
      courseHours: 80
    },
  })

  // Create enrollment for student
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: liveCourse.id,
      status: 'ACTIVE',
      paymentStatus: 'PAID',
      enrolledAt: new Date('2024-01-15')
    },
  })

  // Create pending enrollment
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: dataScienceCourse.id,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    },
  })

  // Create completed enrollment
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: completedCourse.id,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      enrolledAt: new Date('2023-09-15')
    },
  })

  // Create makeup course
  const makeupCourse = await prisma.course.create({
    data: {
      title: 'Professional Makeup Artistry',
      description: 'Learn professional makeup techniques for all occasions',
      type: 'LIVE',
      category: 'MAKEUP',
      price: 1500,
      discountedPrice: 1200,
      features: [
        'Foundation & Concealing',
        'Eye Makeup Techniques',
        'Lip Artistry',
        'Bridal Makeup',
        'Photography Makeup',
        'Live Practice Sessions'
      ],
      imageUrl: '/images/makeup-course.jpg',
      status: 'ACTIVE',
      tutorId: tutor.id,
      batchStartDate: new Date('2024-03-15'),
      batchEndDate: new Date('2024-05-15'),
      totalSeats: 15,
      seatsLeft: 12,
      courseHours: 60
    },
  })

  // Create software testing course
  const testingCourse = await prisma.course.create({
    data: {
      title: 'Software Testing & QA Mastery',
      description: 'Master software testing methodologies and quality assurance',
      type: 'LIVE',
      category: 'SOFTWARE_TESTING',
      price: 2500,
      discountedPrice: 2000,
      features: [
        'Manual Testing',
        'Automated Testing',
        'API Testing',
        'Performance Testing',
        'Test Management',
        'Live Testing Sessions'
      ],
      imageUrl: '/images/testing-course.jpg',
      status: 'ACTIVE',
      tutorId: tutor.id,
      batchStartDate: new Date('2024-04-01'),
      batchEndDate: new Date('2024-06-30'),
      totalSeats: 20,
      seatsLeft: 18,
      courseHours: 80
    },
  })

  // Create course materials
  await prisma.courseMaterial.create({
    data: {
      courseId: liveCourse.id,
      title: 'Introduction to HTML',
      description: 'Learn the basics of HTML structure and elements',
      type: 'VIDEO',
      url: '/videos/html-intro.mp4',
      fileName: 'html-intro.mp4',
      fileSize: 50000000,
      uploadedBy: tutor.id,
      status: 'APPROVED'
    },
  })

  await prisma.courseMaterial.create({
    data: {
      courseId: liveCourse.id,
      title: 'CSS Fundamentals',
      description: 'Understanding CSS styling and layout',
      type: 'PDF',
      url: '/pdfs/css-fundamentals.pdf',
      fileName: 'css-fundamentals.pdf',
      fileSize: 2000000,
      uploadedBy: tutor.id,
      status: 'PENDING'
    },
  })

  // Create class schedules
  await prisma.classSchedule.create({
    data: {
      courseId: liveCourse.id,
      title: 'HTML Basics - Live Session',
      description: 'Introduction to HTML structure and elements',
      startTime: new Date('2024-02-05T10:00:00'),
      endTime: new Date('2024-02-05T12:00:00'),
      googleMeetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'COMPLETED'
    },
  })

  await prisma.classSchedule.create({
    data: {
      courseId: liveCourse.id,
      title: 'CSS Styling - Live Session',
      description: 'CSS fundamentals and styling techniques',
      startTime: new Date('2024-02-12T10:00:00'),
      endTime: new Date('2024-02-12T12:00:00'),
      googleMeetLink: 'https://meet.google.com/xyz-1234-abc',
      status: 'SCHEDULED'
    },
  })

  // Create certificate for completed course
  await prisma.certificate.create({
    data: {
      userId: student.id,
      courseId: completedCourse.id,
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      certificateUrl: '/certificates/digital-marketing-cert.pdf',
      issuedAt: new Date('2023-12-31')
    },
  })

  // Create testimonials
  await prisma.testimonial.create({
    data: {
      name: 'Sarah Johnson',
      course: 'Complete Web Development Bootcamp',
      rating: 5,
      content: 'Excellent course! The instructor was knowledgeable and the live sessions were very helpful.',
      imageUrl: '/images/sarah-johnson.jpg',
    },
  })

  await prisma.testimonial.create({
    data: {
      name: 'Mike Chen',
      course: 'Data Science & Machine Learning',
      rating: 5,
      content: 'Great learning experience with practical projects and real-world applications.',
      imageUrl: '/images/mike-chen.jpg',
    },
  })

  // Create enquiries
  await prisma.enquiry.create({
    data: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      phone: '+1234567890',
      courseInterest: 'Web Development',
      message: 'I am interested in learning web development. Can you provide more details about the course?',
      status: 'PENDING'
    },
  })

  await prisma.enquiry.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+1234567891',
      courseInterest: 'Data Science',
      message: 'I want to enroll in the data science course. What are the prerequisites?',
      status: 'PENDING'
    },
  })

  // Create page content
  await prisma.pageContent.create({
    data: {
      page: 'HOME',
      title: 'Welcome to Test Academy',
      content: 'Learn from industry experts and advance your career with our comprehensive courses.',
      metaTitle: 'Test Academy - Online Learning Platform',
      metaDescription: 'Learn from industry experts with our comprehensive online courses.'
    },
  })

  await prisma.pageContent.create({
    data: {
      page: 'ABOUT',
      title: 'About Test Academy',
      content: 'Test Academy is committed to providing high-quality education and training to help students achieve their career goals.',
      metaTitle: 'About Test Academy - Online Learning Platform',
      metaDescription: 'Learn about Test Academy and our mission to provide quality education.'
    },
  })

  // Create sliders
  await prisma.slider.create({
    data: {
      title: 'Master Web Development',
      subtitle: 'Learn full-stack development with industry experts',
      imageUrl: '/images/slider-1.jpg',
      linkUrl: '/courses',
      order: 1,
      isActive: true
    },
  })

  await prisma.slider.create({
    data: {
      title: 'Data Science Bootcamp',
      subtitle: 'Start your journey in data science and machine learning',
      imageUrl: '/images/slider-2.jpg',
      linkUrl: '/courses',
      order: 2,
      isActive: true
    },
  })

  // Create meta tags
  await prisma.metaTag.create({
    data: {
      page: 'HOME',
      property: 'og:title',
      content: 'Test Academy - Online Learning Platform'
    },
  })

  await prisma.metaTag.create({
    data: {
      page: 'HOME',
      property: 'og:description',
      content: 'Learn from industry experts with our comprehensive online courses.'
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })