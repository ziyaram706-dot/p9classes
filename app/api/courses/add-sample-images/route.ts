import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sample images for different categories
    const sampleImages = {
      'WEB_DEVELOPMENT': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      'DATA_SCIENCE': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'SOFTWARE_TESTING': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      'MOBILE_DEVELOPMENT': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      'AI_ML': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      'MAKEUP': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
      'CYBERSECURITY': 'https://images.unsplash.com/photo-1563013544-6ae71c85e3f9?w=400&h=300&fit=crop',
      'CLOUD_COMPUTING': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      'OTHER': 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop'
    }

    const sampleBanners = {
      'WEB_DEVELOPMENT': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
      'DATA_SCIENCE': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      'SOFTWARE_TESTING': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      'MAKEUP': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop',
      'MOBILE_DEVELOPMENT': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
      'AI_ML': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      'CYBERSECURITY': 'https://images.unsplash.com/photo-1563013544-6ae71c85e3f9?w=800&h=400&fit=crop',
      'CLOUD_COMPUTING': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
      'OTHER': 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop'
    }

    // Get all courses that don't have images
    const coursesWithoutImages = await prisma.course.findMany({
      where: {
        OR: [
          { imageUrl: null },
          { imageUrl: '' },
          { bannerUrl: null },
          { bannerUrl: '' }
        ]
      }
    })

    let updatedCount = 0

    // Update each course with sample images
    for (const course of coursesWithoutImages) {
      const category = course.category as keyof typeof sampleImages
      const imageUrl = sampleImages[category] || sampleImages['OTHER']
      const bannerUrl = sampleBanners[category] || sampleBanners['OTHER']

      await prisma.course.update({
        where: { id: course.id },
        data: {
          imageUrl: imageUrl,
          bannerUrl: bannerUrl
        }
      })

      updatedCount++
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} courses with sample images`,
      updatedCount 
    })

  } catch (error) {
    console.error('Error adding sample images:', error)
    return NextResponse.json({ error: 'Failed to add sample images' }, { status: 500 })
  }
}
