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

    const courses = await prisma.course.findMany({
      where: {
        tutorId: session.user.id
      },
      include: {
        materials: {
          where: {
            uploadedBy: session.user.id
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        schedules: {
          include: {
            attendance: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            startTime: 'asc'
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ courses })

  } catch (error) {
    console.error('Error fetching tutor courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}