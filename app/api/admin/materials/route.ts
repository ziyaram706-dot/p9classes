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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }

    const materials = await prisma.courseMaterial.findMany({
      where,
      include: {
        course: {
          select: {
            title: true,
            tutor: {
              select: {
                name: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.courseMaterial.count({ where })

    return NextResponse.json({
      materials,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { materialId, status } = await request.json()

    if (!materialId || !status) {
      return NextResponse.json(
        { error: 'Material ID and status are required' },
        { status: 400 }
      )
    }

    const material = await prisma.courseMaterial.update({
      where: {
        id: materialId
      },
      data: {
        status: status.toUpperCase()
      },
      include: {
        course: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      material,
      message: `Material ${status.toLowerCase()} successfully`
    })

  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
