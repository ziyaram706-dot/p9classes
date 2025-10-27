import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    const enrollment = await prisma.enrollment.update({
      where: { id: params.id },
      data: { status },
    })

    // If approved, unlock the first module for self-paced courses
    if (status === 'APPROVED') {
      const enrollmentWithCourse = await prisma.enrollment.findUnique({
        where: { id: params.id },
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      })

      // For live courses, we don't need to create progress records automatically
      // Progress will be tracked through attendance and course completion
    }

    return NextResponse.json({ enrollment })
  } catch (error) {
    console.error('Error updating enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    )
  }
}
