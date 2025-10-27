import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'TUTOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const courseId = formData.get('courseId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const file = formData.get('file') as File

    if (!courseId || !title || !type) {
      return NextResponse.json(
        { error: 'Course ID, title, and type are required' },
        { status: 400 }
      )
    }

    // Verify the course is assigned to this tutor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        tutorId: session.user.id
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or not assigned to you' },
        { status: 404 }
      )
    }

    let url = ''
    let fileName = ''
    let fileSize = 0

    if (file && file.size > 0) {
      // In a real application, you would upload the file to a storage service
      // For now, we'll just store the file name and size
      fileName = file.name
      fileSize = file.size
      url = `/uploads/${file.name}` // This would be the actual file URL
    } else if (type === 'LINK') {
      url = formData.get('url') as string
      if (!url) {
        return NextResponse.json(
          { error: 'URL is required for link type' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'File or URL is required' },
        { status: 400 }
      )
    }

    const material = await prisma.courseMaterial.create({
      data: {
        courseId,
        title,
        description: description || null,
        type,
        url,
        fileName: fileName || null,
        fileSize: fileSize || null,
        uploadedBy: session.user.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      material,
      message: 'Material submitted for approval'
    })

  } catch (error) {
    console.error('Error submitting material:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
