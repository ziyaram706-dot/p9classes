import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SecurityValidator, validateInput } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const testimonials = await prisma.testimonial.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.testimonial.count()

    return NextResponse.json({
      testimonials,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate and sanitize input
    const validation = validateInput(body, {
      name: 'name',
      course: 'courseTitle',
      rating: 'rating',
      content: 'message'
    })

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { name, course, rating, content } = validation.sanitizedData
    const imageUrl = body.imageUrl || null
    const isActive = body.isActive !== undefined ? body.isActive : true

    // Validate rating
    const ratingNum = parseInt(rating)
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        course,
        rating: ratingNum,
        content,
        imageUrl,
        isActive
      }
    })

    return NextResponse.json({
      testimonial,
      message: 'Testimonial created successfully'
    })

  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    // Validate and sanitize input if provided
    let sanitizedData: any = {}
    if (updateData.name) {
      const nameValidation = validateInput({ name: updateData.name }, { name: 'name' })
      if (!nameValidation.isValid) {
        return NextResponse.json(
          { error: 'Invalid name', details: nameValidation.errors },
          { status: 400 }
        )
      }
      sanitizedData.name = nameValidation.sanitizedData.name
    }

    if (updateData.course) {
      const courseValidation = validateInput({ course: updateData.course }, { course: 'courseTitle' })
      if (!courseValidation.isValid) {
        return NextResponse.json(
          { error: 'Invalid course', details: courseValidation.errors },
          { status: 400 }
        )
      }
      sanitizedData.course = courseValidation.sanitizedData.course
    }

    if (updateData.content) {
      const contentValidation = validateInput({ content: updateData.content }, { content: 'message' })
      if (!contentValidation.isValid) {
        return NextResponse.json(
          { error: 'Invalid content', details: contentValidation.errors },
          { status: 400 }
        )
      }
      sanitizedData.content = contentValidation.sanitizedData.content
    }

    if (updateData.rating) {
      const ratingNum = parseInt(updateData.rating)
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        )
      }
      sanitizedData.rating = ratingNum
    }

    if (updateData.imageUrl !== undefined) {
      sanitizedData.imageUrl = updateData.imageUrl
    }

    if (updateData.isActive !== undefined) {
      sanitizedData.isActive = updateData.isActive
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: sanitizedData
    })

    return NextResponse.json({
      testimonial,
      message: 'Testimonial updated successfully'
    })

  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Testimonial deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
