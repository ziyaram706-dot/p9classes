import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        moduleId: params.moduleId,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this module
    const progress = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        moduleId: params.moduleId,
        status: {
          in: ['UNLOCKED', 'IN_PROGRESS', 'COMPLETED'],
        },
      },
    })

    if (!progress) {
      return NextResponse.json(
        { error: 'Module not unlocked' },
        { status: 403 }
      )
    }

    return NextResponse.json({ quiz })
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}
