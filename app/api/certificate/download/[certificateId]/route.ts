import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jsPDF from 'jspdf'

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: params.certificateId },
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
            courseHours: true,
          },
        },
      },
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Create PDF certificate
    const doc = new jsPDF('landscape', 'mm', 'a4')
    
    // Background
    doc.setFillColor(240, 248, 255)
    doc.rect(0, 0, 297, 210, 'F')
    
    // Border
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(2)
    doc.rect(10, 10, 277, 190)
    
    // Inner border
    doc.setDrawColor(59, 130, 246)
    doc.setLineWidth(1)
    doc.rect(20, 20, 257, 170)
    
    // Title
    doc.setFontSize(28)
    doc.setTextColor(59, 130, 246)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICATE OF COMPLETION', 148, 50, { align: 'center' })
    
    // Subtitle
    doc.setFontSize(16)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'normal')
    doc.text('This is to certify that', 148, 70, { align: 'center' })
    
    // Student name
    doc.setFontSize(24)
    doc.setTextColor(30, 41, 59)
    doc.setFont('helvetica', 'bold')
    doc.text(certificate.user.name, 148, 95, { align: 'center' })
    
    // Course completion text
    doc.setFontSize(14)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'normal')
    doc.text('has successfully completed the course', 148, 115, { align: 'center' })
    
    // Course title
    doc.setFontSize(18)
    doc.setTextColor(59, 130, 246)
    doc.setFont('helvetica', 'bold')
    doc.text(certificate.course.title, 148, 135, { align: 'center' })
    
    // Course hours
    doc.setFontSize(12)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'normal')
    doc.text(`Duration: ${certificate.course.courseHours} hours`, 148, 150, { align: 'center' })
    
    // Date
    doc.setFontSize(12)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'normal')
    doc.text(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, 148, 165, { align: 'center' })
    
    // Certificate ID
    doc.setFontSize(10)
    doc.setTextColor(156, 163, 175)
    doc.setFont('helvetica', 'normal')
    doc.text(`Certificate ID: ${certificate.certificateId}`, 148, 180, { align: 'center' })
    
    // Signature line
    doc.setDrawColor(156, 163, 175)
    doc.setLineWidth(0.5)
    doc.line(50, 195, 100, 195)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text('Authorized Signature', 75, 200, { align: 'center' })
    
    // Academy name
    doc.setFontSize(12)
    doc.setTextColor(59, 130, 246)
    doc.setFont('helvetica', 'bold')
    doc.text('Planet Nine Classes', 200, 200, { align: 'center' })
    
    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer')
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${certificate.course.title}_${certificate.user.name}_Certificate.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}
