import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessions = await prisma.session.findMany({
      where: {
        tutorId: session.user.id,
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching tutor sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
