import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        tutor: {
          select: {
            name: true,
          },
        },
        modules: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
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
      imageUrl,
      bannerUrl,
      features,
      status 
    } = body

    // Check if this is a status-only update
    const isStatusOnlyUpdate = Object.keys(body).length === 1 && body.hasOwnProperty('status')

    // Validate required fields only for full updates
    if (!isStatusOnlyUpdate && (!title || !description || !price)) {
      return NextResponse.json(
        { error: 'Title, description, and price are required' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    // Handle status-only updates
    if (isStatusOnlyUpdate) {
      updateData.status = status
    } else {
      // Handle full updates
      updateData.title = title
      updateData.description = description
      updateData.price = parseFloat(price)
      updateData.category = category || 'WEB_DEVELOPMENT'
      updateData.features = features || []

      // Add optional fields if provided
      if (discountedPrice) updateData.discountedPrice = parseFloat(discountedPrice)
      if (tutorId) updateData.tutorId = tutorId
      if (totalSeats) updateData.totalSeats = parseInt(totalSeats)
      if (batchStartDate) updateData.batchStartDate = new Date(batchStartDate)
      if (batchEndDate) updateData.batchEndDate = new Date(batchEndDate)
      if (courseHours) updateData.courseHours = parseInt(courseHours)
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl
      if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl
      if (status) updateData.status = status
    }

    const course = await prisma.course.update({
      where: { id: params.id },
      data: updateData,
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
      message: 'Course updated successfully'
    })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Use a transaction to delete all related records
    await prisma.$transaction(async (tx) => {
      // Delete related records in the correct order
      await tx.enrollment.deleteMany({
        where: { courseId: params.id }
      })
      
      await tx.progress.deleteMany({
        where: { courseId: params.id }
      })
      
      await tx.certificate.deleteMany({
        where: { courseId: params.id }
      })
      
      await tx.session.deleteMany({
        where: { courseId: params.id }
      })
      
      await tx.module.deleteMany({
        where: { courseId: params.id }
      })
      
      // Course materials and schedules have onDelete: Cascade, so they'll be deleted automatically
      
      // Finally delete the course
      await tx.course.delete({
        where: { id: params.id }
      })
    })

    return NextResponse.json({
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}