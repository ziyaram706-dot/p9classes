import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { quizId, answers } = await request.json()

    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        module: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const passed = score >= 80

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: quizId,
        score,
        status: passed ? 'COMPLETED' : 'FAILED',
        answers: answers,
      },
    })

    // Update module progress
    await prisma.progress.updateMany({
      where: {
        userId: session.user.id,
        moduleId: quiz.moduleId,
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // If passed, unlock next module
    if (passed) {
      const nextModule = await prisma.module.findFirst({
        where: {
          courseId: quiz.module.courseId,
          order: {
            gt: quiz.module.order,
          },
        },
        orderBy: {
          order: 'asc',
        },
      })

      if (nextModule) {
        await prisma.progress.upsert({
          where: {
            userId_courseId_moduleId: {
              userId: session.user.id,
              courseId: quiz.module.courseId,
              moduleId: nextModule.id,
            },
          },
          update: {
            status: 'UNLOCKED',
          },
          create: {
            userId: session.user.id,
            courseId: quiz.module.courseId,
            moduleId: nextModule.id,
            status: 'UNLOCKED',
          },
        })
      } else {
        // Course completed, create certificate
        await prisma.certificate.create({
          data: {
            userId: session.user.id,
            courseId: quiz.module.courseId,
            certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            certificateUrl: `/certificates/${session.user.id}-${quiz.module.courseId}.pdf`,
            issuedAt: new Date()
          },
        })
      }
    }

    return NextResponse.json({
      score,
      passed,
      attempt,
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}
