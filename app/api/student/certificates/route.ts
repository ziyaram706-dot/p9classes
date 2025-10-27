import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        userId: session.user.id,
        type: 'STUDENT' // Only show student-generated certificates
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            courseHours: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    // Filter to only show certificates for completed courses
    const completedCertificates = certificates.filter(certificate => {
      // Check if the user has a completed enrollment for this course
      return prisma.enrollment.findFirst({
        where: {
          userId: session.user.id,
          courseId: certificate.courseId,
          status: 'COMPLETED'
        }
      }).then(enrollment => !!enrollment)
    })

    // Since we can't use async in filter, let's do it differently
    const completedEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: 'COMPLETED'
      },
      select: {
        courseId: true
      }
    })

    const completedCourseIds = completedEnrollments.map(e => e.courseId)
    const filteredCertificates = certificates.filter(cert => 
      completedCourseIds.includes(cert.courseId)
    )

    return NextResponse.json({ certificates: filteredCertificates })

  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
