import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SecurityValidator, validateInput } from '@/lib/security'

export async function POST(request: NextRequest) {
  let body: any = null
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!SecurityValidator.checkRateLimit(ip, 'enrollment_form', 60000, 3)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    body = await request.json()
    
    // Validate and sanitize input
    const validation = validateInput(body, {
      courseId: 'courseId',
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

    const { courseId, name, email, phone, message } = validation.sanitizedData
    const preferredContact = body.preferredContact || 'email'
    
    // Handle optional message field
    const messageText = message || null

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email }
    })

    // If user doesn't exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          password: 'temp_password', // Will be updated when user sets up account
          role: 'STUDENT',
        },
      })
    } else {
      // Backfill missing contact fields from the enrollment form
      if (!user.phone && phone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { phone }
        })
      }
      if (name && name !== user.name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name }
        })
      }
    }

    // Check if enrollment already exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { message: 'You have already enrolled in this course' },
        { status: 400 }
      )
    }

    // Create enrollment request
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    })

    // Create enquiry if message is provided
    if (messageText) {
      await prisma.enquiry.create({
        data: {
          name,
          email,
          phone: phone || null,
          courseInterest: course.title,
          message: messageText,
          status: 'PENDING',
        },
      })
    }

    return NextResponse.json({
      message: 'Enrollment request submitted successfully',
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        courseTitle: course.title,
        createdAt: enrollment.createdAt
      },
    })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: body
    })
    return NextResponse.json(
      { 
        message: 'Failed to submit enrollment request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
