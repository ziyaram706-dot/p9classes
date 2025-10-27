import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
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
      courseId,
      title,
      description,
      startTime,
      endTime,
      googleMeetLink
    } = body

    // Validate required fields
    if (!courseId || !title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Course ID, title, start time, and end time are required' },
        { status: 400 }
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
      },
    })

    return NextResponse.json({
      schedule,
      message: 'Class schedule created successfully'
    })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const whereClause = courseId ? { courseId } : {}

    const schedules = await prisma.classSchedule.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            title: true,
            tutor: {
              select: {
                name: true,
              },
            },
          },
        },
        attendance: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
            isPresent: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}
