import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Check if user has completed this course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        status: 'COMPLETED'
      },
      include: {
        course: true,
        user: true
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Course not completed or not found' },
        { status: 404 }
      )
    }

    // Check if student certificate already exists
    const existingCertificate = await prisma.certificate.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        type: 'STUDENT'
      }
    })

    if (existingCertificate) {
      return NextResponse.json({
        message: 'Certificate already exists',
        certificate: existingCertificate
      })
    }

    // Generate unique certificate ID
    const timestamp = Date.now()
    const certificateId = `student_cert_${session.user.id}_${courseId}_${timestamp}`

    // Create student certificate record
    const certificate = await prisma.certificate.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        certificateUrl: `/api/certificate/generate-pdf/${certificateId}`, // This will generate PDF on demand
        certificateId: certificateId,
        type: 'STUDENT',
        issuedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Certificate generated successfully',
      certificate
    })

  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
