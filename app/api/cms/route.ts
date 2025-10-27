import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (page) {
      // Get specific page content
      const pageContent = await prisma.cMSContent.findUnique({
        where: { section: page }
      })
      return NextResponse.json({ content: pageContent })
    } else {
      // Get all page content
      const allContent = await prisma.cMSContent.findMany()
      return NextResponse.json({ content: allContent })
    }
  } catch (error) {
    console.error('Error fetching CMS content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CMS content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { section, title, description, content, offer } = body

    if (!section || !title) {
      return NextResponse.json(
        { error: 'Section and title are required' },
        { status: 400 }
      )
    }

    // Upsert CMS content
    const cmsContent = await prisma.cMSContent.upsert({
      where: { section: section },
      update: {
        content: {
          title,
          description: description || null,
          content: content || null,
          offer: offer || null
        }
      },
      create: {
        section: section,
        content: {
          title,
          description: description || null,
          content: content || null,
          offer: offer || null
        }
      }
    })

    return NextResponse.json({
      content: cmsContent,
      message: 'CMS content updated successfully'
    })
  } catch (error) {
    console.error('Error updating CMS content:', error)
    return NextResponse.json(
      { error: 'Failed to update CMS content' },
      { status: 500 }
    )
  }
}
