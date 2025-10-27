import { db } from './config';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, DocumentData } from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  PROGRESS: 'progress',
  QUIZ_ATTEMPTS: 'quizAttempts',
  CERTIFICATES: 'certificates',
  SESSIONS: 'sessions',
  ATTENDANCE: 'attendance',
} as const;

// Types
export interface User extends DocumentData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'TUTOR' | 'STUDENT';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course extends DocumentData {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  price: number;
  discountedPrice?: number;
  features: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User functions
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, COLLECTIONS.USERS), {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, COLLECTIONS.USERS), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];
  return doc ? { id: doc.id, ...doc.data() } as User : null;
};

// Course functions
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, COLLECTIONS.COURSES), {
    ...courseData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getCourses = async (): Promise<Course[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

// Enrollment functions
export const createEnrollment = async (enrollmentData: {
  userId: string;
  courseId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}) => {
  return await addDoc(collection(db, COLLECTIONS.ENROLLMENTS), {
    ...enrollmentData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Progress tracking functions
export const updateProgress = async (progressId: string, progressData: {
  userId: string;
  courseId: string;
  moduleId: string;
  completed: boolean;
  score?: number;
}) => {
  const progressRef = doc(db, COLLECTIONS.PROGRESS, progressId);
  return await updateDoc(progressRef, {
    ...progressData,
    updatedAt: new Date()
  });
};