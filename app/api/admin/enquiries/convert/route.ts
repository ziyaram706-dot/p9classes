import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// @ts-ignore
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { enquiryId, courseId, action } = await request.json()

    if (!enquiryId || !courseId || !action) {
      return NextResponse.json(
        { error: 'Enquiry ID, course ID, and action are required' },
        { status: 400 }
      )
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: {
        id: enquiryId
      }
    })

    if (!enquiry) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      )
    }

    if (action === 'convert') {
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: {
          email: enquiry.email
        }
      })

      if (!user) {
        // Create user account
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(tempPassword, 12)

        user = await prisma.user.create({
          data: {
            email: enquiry.email,
            name: enquiry.name,
            phone: enquiry.phone,
            password: hashedPassword,
            role: 'STUDENT',
            isActive: true
          }
        })
      } else if (!user.phone && enquiry.phone) {
        // Backfill phone for existing user without a phone number
        user = await prisma.user.update({
          where: { id: user.id },
          data: { phone: enquiry.phone }
        })
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
          status: 'PENDING',
          paymentStatus: 'PENDING'
        }
      })

      // Update enquiry status
      await prisma.enquiry.update({
        where: {
          id: enquiryId
        },
        data: {
          status: 'CONVERTED'
        }
      })

      return NextResponse.json({
        enrollment,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        message: 'Enquiry converted to enrollment successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error converting enquiry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
