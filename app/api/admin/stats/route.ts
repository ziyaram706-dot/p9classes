import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [
      totalStudents,
      totalCourses,
      revenueAggregate,
      pendingEnquiries,
      activeCourses,
      completedCourses
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.course.count(),
      prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true }
      }),
      prisma.enquiry.count({ where: { status: 'PENDING' } }),
      prisma.course.count({ where: { status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { status: 'COMPLETED' } })
    ])

    const stats = {
      totalStudents,
      totalCourses,
      totalRevenue: revenueAggregate._sum.amount ?? 0,
      pendingEnquiries,
      activeCourses,
      completedCourses
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
