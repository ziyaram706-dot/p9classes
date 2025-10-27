import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SecurityValidator, validateInput } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!SecurityValidator.checkRateLimit(ip, 'contact_form', 60000, 5)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate and sanitize input
    const validation = validateInput(body, {
      name: 'name',
      email: 'email',
      phone: 'phone',
      message: 'message'
    })

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, message } = validation.sanitizedData
    const subject = body.subject || 'General Inquiry'

    // Additional validation for subject
    const subjectValidation = SecurityValidator.validateCourseTitle(subject)
    if (!subjectValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid subject', details: subjectValidation.errors },
        { status: 400 }
      )
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        courseInterest: subjectValidation.sanitizedData,
        message,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      message: 'Message sent successfully',
      enquiry: {
        id: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      },
    })
  } catch (error) {
    console.error('Error creating enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
