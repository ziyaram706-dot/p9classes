/**
 * Centralized Course interface for ONE source of truth
 * This prevents duplication and ensures consistency across the application
 */

export interface Course {
  id: string
  title: string
  description: string
  type: 'SELF_PACED' | 'LIVE'
  price: number
  discountedPrice?: number
  category?: string
  features: string[]
  imageUrl?: string
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  tutor?: {
    name: string
    image?: string
  }
  batchStartDate?: Date | string
  batchEndDate?: Date | string
  seatsLeft?: number
  totalSeats?: number
  courseHours?: number
  progress?: number
  createdAt?: Date | string
  updatedAt?: Date | string
  // Additional optional fields for different contexts
  materials?: any[]
  schedules?: any[]
  modules?: {
    id: string
    title: string
    description?: string
    order: number
  }[]
  enrollments?: {
    user: {
      name: string
      email: string
    }
  }[]
}

// Extended interfaces for specific use cases
export interface CourseWithProgress extends Course {
  progress: number
}

export interface CourseDetail extends Course {
  modules: {
    id: string
    title: string
    description?: string
    order: number
  }[]
}

