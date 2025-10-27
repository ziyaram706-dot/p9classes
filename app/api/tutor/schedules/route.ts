import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId, title, description, startTime, endTime, googleMeetLink } = await request.json()

    if (!courseId || !title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Course ID, title, start time, and end time are required' },
        { status: 400 }
      )
    }

    // Verify the course is assigned to this tutor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        tutorId: session.user.id
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or not assigned to you' },
        { status: 404 }
      )
    }

    const schedule = await prisma.classSchedule.create({
      data: {
        courseId,
        title,
        description: description || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        googleMeetLink: googleMeetLink || null,
        status: 'SCHEDULED'
      }
    })

    return NextResponse.json({
      schedule,
      message: 'Class schedule added successfully'
    })

  } catch (error) {
    console.error('Error adding schedule:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
