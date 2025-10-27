import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const certificates = await prisma.certificate.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    })

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const certificateFile = formData.get('certificate') as File
    const enrollmentId = formData.get('enrollmentId') as string

    if (!certificateFile || !enrollmentId) {
      return NextResponse.json(
        { error: 'Certificate file and enrollment ID are required' },
        { status: 400 }
      )
    }

    // Get enrollment details
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        course: true,
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      )
    }

    // Create certificates directory if it doesn't exist
    const certificatesDir = join(process.cwd(), 'certificates')
    await mkdir(certificatesDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `certificate_${enrollment.user.id}_${enrollment.course.id}_${timestamp}.pdf`
    const filepath = join(certificatesDir, filename)

    // Save file
    const bytes = await certificateFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Generate unique certificate ID
    const certificateId = `cert_${enrollment.user.id}_${enrollment.course.id}_${timestamp}`

    // Create certificate record (admin-uploaded)
    const certificate = await prisma.certificate.create({
      data: {
        userId: enrollment.user.id,
        courseId: enrollment.course.id,
        certificateUrl: `/certificates/${filename}`,
        certificateId: certificateId,
        type: 'ADMIN_UPLOADED',
        issuedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      message: 'Certificate uploaded successfully',
      certificate 
    })
  } catch (error) {
    console.error('Error uploading certificate:', error)
    return NextResponse.json(
      { error: 'Failed to upload certificate' },
      { status: 500 }
    )
  }
}
