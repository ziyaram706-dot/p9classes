import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { scheduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { scheduleId } = params
    const { status, googleMeetLink } = await request.json()

    if (!status && googleMeetLink === undefined) {
      return NextResponse.json(
        { error: 'Status or Google Meet link is required' },
        { status: 400 }
      )
    }

    // Verify the schedule belongs to a course assigned to this tutor
    const schedule = await prisma.classSchedule.findFirst({
      where: {
        id: scheduleId,
        course: {
          tutorId: session.user.id
        }
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found or not assigned to you' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (googleMeetLink !== undefined) updateData.googleMeetLink = googleMeetLink

    const updatedSchedule = await prisma.classSchedule.update({
      where: {
        id: scheduleId
      },
      data: updateData
    })

    return NextResponse.json({
      schedule: updatedSchedule,
      message: 'Schedule updated successfully'
    })

  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
