import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED']
        }
      },
      include: {
        course: {
          include: {
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
                title: true,
                description: true,
                type: true,
                url: true,
                fileName: true,
                status: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
            schedules: {
              select: {
                id: true,
                title: true,
                startTime: true,
                endTime: true,
                googleMeetLink: true,
                status: true,
              },
              orderBy: {
                startTime: 'asc',
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}
