const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

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

  console.log('Database seeded successfully!')
  console.log('Demo accounts created:')
  console.log('Admin: admin@testacademy.com / admin123')
  console.log('Tutor: tutor@testacademy.com / tutor123')
  console.log('Student: student@testacademy.com / student123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
