import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get certificate credentials
    const credentials = await prisma.certificateCredentials.findFirst()

    return NextResponse.json({ credentials })
  } catch (error) {
    console.error('Error fetching certificate credentials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const companyName = formData.get('companyName') as string
    const companyLogo = formData.get('companyLogo') as string
    const managingDirectorName = formData.get('managingDirectorName') as string
    const websiteUrl = formData.get('websiteUrl') as string
    const signatureFile = formData.get('signatureFile') as File | null

    let signatureImageUrl = null

    // Handle signature file upload
    if (signatureFile && signatureFile.size > 0) {
      const bytes = await signatureFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'signatures')
      await mkdir(uploadsDir, { recursive: true })

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `signature_${timestamp}.png`
      const filepath = join(uploadsDir, filename)

      // Write file
      await writeFile(filepath, buffer)

      // Set the URL
      signatureImageUrl = `/uploads/signatures/${filename}`
    }

    // Upsert certificate credentials
    const credentials = await prisma.certificateCredentials.upsert({
      where: { id: 'default' },
      update: {
        companyName: companyName || 'Planet Nine Classes',
        companyLogo: companyLogo || '🎓',
        managingDirectorName: managingDirectorName || 'Abhiram P Mohan',
        managingDirectorSignature: signatureImageUrl,
        signatureImageUrl: signatureImageUrl,
        websiteUrl: websiteUrl || 'https://planetnineclasses.com'
      },
      create: {
        id: 'default',
        companyName: companyName || 'Planet Nine Classes',
        companyLogo: companyLogo || '🎓',
        managingDirectorName: managingDirectorName || 'Abhiram P Mohan',
        managingDirectorSignature: signatureImageUrl,
        signatureImageUrl: signatureImageUrl,
        websiteUrl: websiteUrl || 'https://planetnineclasses.com'
      }
    })

    return NextResponse.json({ message: 'Certificate credentials updated successfully', credentials })
  } catch (error) {
    console.error('Error updating certificate credentials:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
