import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const { certificateId } = params

    // Find the certificate
    const certificate = await prisma.certificate.findUnique({
      where: {
        certificateId: certificateId
      },
      include: {
        user: true,
        course: {
          include: {
            tutor: true
          }
        }
      }
    })

    // Get certificate credentials
    const credentials = await prisma.certificateCredentials.findFirst()

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Generate HTML for the certificate
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Certificate of Completion</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .certificate {
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            width: 100%;
            border: 8px solid #f4d03f;
          }
          .header {
            margin-bottom: 40px;
          }
          .title {
            font-size: 48px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          }
          .subtitle {
            font-size: 24px;
            color: #7f8c8d;
            margin-bottom: 10px;
          }
          .student-name {
            font-size: 36px;
            font-weight: bold;
            color: #e74c3c;
            margin: 30px 0;
            text-decoration: underline;
            text-decoration-color: #f4d03f;
            text-decoration-thickness: 3px;
          }
          .course-info {
            font-size: 20px;
            color: #34495e;
            margin: 20px 0;
            line-height: 1.6;
          }
          .course-title {
            font-weight: bold;
            color: #2c3e50;
          }
          .date-info {
            margin-top: 40px;
            font-size: 18px;
            color: #7f8c8d;
          }
          .certificate-id {
            margin-top: 20px;
            font-size: 14px;
            color: #95a5a6;
            font-family: monospace;
          }
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: end;
          }
          .signature {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-bottom: 2px solid #2c3e50;
            margin-bottom: 10px;
            height: 40px;
          }
          .signature-text {
            font-size: 16px;
            color: #7f8c8d;
          }
          .logo {
            font-size: 24px;
            color: #f4d03f;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .course-hours {
            font-size: 18px;
            color: #7f8c8d;
            margin: 20px 0;
            font-style: italic;
          }
          .signature-label {
            font-size: 14px;
            color: #7f8c8d;
            margin-top: 5px;
            font-style: italic;
          }
          .signature-symbol {
            font-size: 20px;
            margin-top: 5px;
          }
          .signature-image {
            height: 60px;
            width: auto;
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .verification-info {
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #28a745;
          }
          .verification-info p {
            margin: 5px 0;
            font-size: 14px;
            color: #495057;
          }
          .verification-info a {
            color: #007bff;
            text-decoration: none;
          }
          .verification-info a:hover {
            text-decoration: underline;
          }
          .verification-note {
            font-family: monospace;
            font-size: 12px;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">
              <span style="font-size: 32px;">${credentials?.companyLogo || '🎓'}</span>
              <span>${credentials?.companyName || 'Planet Nine Classes'}</span>
            </div>
            <div class="title">CERTIFICATE OF COMPLETION</div>
            <div class="subtitle">This is to certify that</div>
          </div>
          
          <div class="student-name">${certificate.user.name}</div>
          
          <div class="course-info">
            has successfully completed the course<br>
            <span class="course-title">${certificate.course.title}</span><br>
            with dedication and excellence.
          </div>
          
          <div class="course-hours">
            Course Duration: ${certificate.course.courseHours || 'N/A'} hours
          </div>
          
          <div class="date-info">
            Completed on: ${new Date(certificate.issuedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          <div class="signature-section">
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-text">${certificate.course.tutor?.name || 'Course Instructor'}</div>
              <div class="signature-label">Course Instructor</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div class="signature-text">${credentials?.managingDirectorName || 'Abhiram P Mohan'}</div>
              <div class="signature-label">Managing Director</div>
              ${credentials?.signatureImageUrl ? 
                `<img src="${credentials.signatureImageUrl}" alt="Managing Director Signature" class="signature-image" />` : 
                `<div class="signature-symbol">${credentials?.managingDirectorSignature || '✍️'}</div>`
              }
            </div>
          </div>
          
          <div class="verification-info">
            <p>To verify this certificate, visit: <a href="${credentials?.websiteUrl || 'https://planetnineclasses.com'}" target="_blank">${credentials?.websiteUrl || 'https://planetnineclasses.com'}</a></p>
            <p class="verification-note">Certificate ID: ${certificate.certificateId}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Return HTML that can be printed as PDF
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Error generating certificate PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
