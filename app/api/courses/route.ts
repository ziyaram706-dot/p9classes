import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SecurityValidator, validateInput } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const includeEnrollments = searchParams.get('includeEnrollments') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (type) {
      where.type = type.toUpperCase() as any
    }
    
    if (status) {
      where.status = status.toUpperCase() as any
    } else {
      // Default to show only ACTIVE courses for frontend
      where.status = 'ACTIVE'
    }

    const includeClause: any = {
      tutor: {
        select: {
          name: true,
        },
      },
      materials: {
        where: {
          status: 'APPROVED'
        },
        select: {
          id: true,
        },
      },
    }

    // Add enrollments if requested
    if (includeEnrollments) {
      includeClause.enrollments = {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }
    }

    const courses = await prisma.course.findMany({
      where,
      include: includeClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.course.count({
      where,
    })

    return NextResponse.json({
      courses: courses.map(course => ({
        ...course,
        materialsCount: course.materials.length,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
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

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!SecurityValidator.checkRateLimit(ip, 'course_creation', 300000, 10)) { // 5 minutes, 10 requests
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Log the incoming data for debugging
    console.log('Course creation request body:', JSON.stringify(body, null, 2))
    
    // Validate and sanitize input
    const validation = validateInput(body, {
      title: 'courseTitle',
      description: 'courseDescription',
      price: 'price',
      imageUrl: 'url',
      bannerUrl: 'url'
    })

    if (!validation.isValid) {
      console.error('Validation failed:', validation.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Additional validation for required fields
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Course title is required' },
        { status: 400 }
      )
    }

    if (!body.description || body.description.trim() === '') {
      return NextResponse.json(
        { error: 'Course description is required' },
        { status: 400 }
      )
    }

    if (!body.price || isNaN(parseFloat(body.price))) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      )
    }

    const {
      title,
      description,
      price,
      discountedPrice,
      category,
      tutorId,
      totalSeats,
      batchStartDate,
      batchEndDate,
      courseHours,
      features,
      imageUrl,
      bannerUrl,
      status = 'DRAFT'
    } = validation.sanitizedData

    // Additional validation for optional fields
    if (discountedPrice !== undefined) {
      const discountedPriceValidation = SecurityValidator.validatePrice(discountedPrice)
      if (!discountedPriceValidation.isValid) {
        return NextResponse.json(
          { error: 'Invalid discounted price', details: discountedPriceValidation.errors },
          { status: 400 }
        )
      }
    }

    // Validate category
    const validCategories = ['WEB_DEVELOPMENT', 'SOFTWARE_TESTING', 'MAKEUP', 'DATA_SCIENCE', 'OTHER']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate tutor exists if provided
    if (tutorId) {
      const tutor = await prisma.user.findUnique({
        where: { id: tutorId, role: 'TUTOR' }
      })
      if (!tutor) {
        return NextResponse.json(
          { error: 'Invalid tutor' },
          { status: 400 }
        )
      }
    }

    // Validate dates
    if (batchStartDate && batchEndDate) {
      const startDate = new Date(batchStartDate)
      const endDate = new Date(batchEndDate)
      
      if (startDate >= endDate) {
        return NextResponse.json(
          { error: 'End date must be after start date' },
          { status: 400 }
        )
      }
    }

    // Validate numeric fields
    if (totalSeats && (totalSeats < 1 || totalSeats > 1000)) {
      return NextResponse.json(
        { error: 'Total seats must be between 1 and 1000' },
        { status: 400 }
      )
    }

    if (courseHours && (courseHours < 1 || courseHours > 1000)) {
      return NextResponse.json(
        { error: 'Course hours must be between 1 and 1000' },
        { status: 400 }
      )
    }

    try {
      const course = await prisma.course.create({
        data: {
          title,
          description,
          price: parseFloat(price),
          discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
          category: category || 'OTHER',
          tutorId: tutorId || null,
          totalSeats: totalSeats ? parseInt(totalSeats) : null,
          seatsLeft: totalSeats ? parseInt(totalSeats) : null,
          batchStartDate: batchStartDate ? new Date(batchStartDate) : null,
          batchEndDate: batchEndDate ? new Date(batchEndDate) : null,
          courseHours: courseHours ? parseInt(courseHours) : null,
          features: features || [],
          imageUrl: imageUrl || null,
          bannerUrl: bannerUrl || null,
          status: status || 'DRAFT',
          type: 'LIVE'
        },
        include: {
          tutor: {
            select: {
              name: true,
            },
          },
        },
      })

      return NextResponse.json({
        course,
        message: 'Course created successfully'
      })
    } catch (error) {
      console.error('Prisma error during course creation:', error)
      return NextResponse.json(
        { error: 'Failed to create course', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}