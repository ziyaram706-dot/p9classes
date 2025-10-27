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

    // Get students enrolled in courses taught by this tutor
    const students = await prisma.enrollment.findMany({
      where: {
        course: {
          tutorId: session.user.id,
        },
        status: 'APPROVED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            modules: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    // Calculate progress for each student
    const studentsWithProgress = await Promise.all(students.map(async enrollment => {
      // Get progress for this enrollment
      const progressRecords = await prisma.progress.findMany({
        where: {
          userId: enrollment.user.id,
          courseId: enrollment.courseId,
        },
        select: {
          status: true,
          completedAt: true,
        },
      })
      
      const completedModules = progressRecords.filter(p => p.status === 'COMPLETED').length
      const totalModules = enrollment.course.modules?.length || 1
      const progress = Math.round((completedModules / totalModules) * 100)
      
      const lastActivity = progressRecords
        .filter(p => p.completedAt)
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0]?.completedAt || enrollment.createdAt

      return {
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        course: enrollment.course,
        progress,
        lastActivity,
      }
    }))

    return NextResponse.json({ students: studentsWithProgress })
  } catch (error) {
    console.error('Error fetching tutor students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
