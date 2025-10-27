import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = params

    // Check if user is enrolled and course is completed
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        status: 'APPROVED',
        paymentStatus: 'PAID'
      },
      include: {
        course: {
          select: {
            title: true,
            status: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found or not eligible for certificate' },
        { status: 404 }
      )
    }

    if (enrollment.course.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Course is not completed yet' },
        { status: 400 }
      )
    }

    // Check if certificate already exists
    let certificate = await prisma.certificate.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId
      }
    })

    if (!certificate) {
      // Generate certificate
      const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Create PDF certificate
      const doc = new jsPDF()
      
      // Certificate design
      doc.setFontSize(24)
      doc.text('CERTIFICATE OF COMPLETION', 105, 50, { align: 'center' })
      
      doc.setFontSize(16)
      doc.text('This is to certify that', 105, 80, { align: 'center' })
      
      doc.setFontSize(20)
      doc.text(enrollment.user.name, 105, 100, { align: 'center' })
      
      doc.setFontSize(16)
      doc.text('has successfully completed the course', 105, 120, { align: 'center' })
      
      doc.setFontSize(18)
      doc.text(enrollment.course.title, 105, 140, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Certificate ID: ${certificateId}`, 105, 180, { align: 'center' })
      doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 105, 190, { align: 'center' })
      
      // Add watermark
      doc.setFontSize(60)
      doc.setTextColor(200, 200, 200)
      doc.text('VERIFIED', 105, 120, { align: 'center', angle: 45 })
      
      const pdfBuffer = doc.output('arraybuffer')
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
      
      // In a real application, you would save this to a file storage service
      const certificateUrl = `/certificates/${certificateId}.pdf`

      // Create certificate record
      certificate = await prisma.certificate.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
          certificateId: certificateId,
          certificateUrl: certificateUrl,
          issuedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      certificate: {
        id: certificate.id,
        certificateId: certificate.certificateId,
        certificateUrl: certificate.certificateUrl,
        issuedAt: certificate.issuedAt,
        course: enrollment.course,
        user: enrollment.user
      }
    })

  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}