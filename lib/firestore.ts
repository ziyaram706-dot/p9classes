import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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
};

// User functions
export const createUser = async (userData) => {
  return await addDoc(collection(db, COLLECTIONS.USERS), {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getUserByEmail = async (email) => {
  const q = query(collection(db, COLLECTIONS.USERS), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0]?.data();
};

// Course functions
export const createCourse = async (courseData) => {
  return await addDoc(collection(db, COLLECTIONS.COURSES), {
    ...courseData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Enrollment functions
export const createEnrollment = async (enrollmentData) => {
  return await addDoc(collection(db, COLLECTIONS.ENROLLMENTS), {
    ...enrollmentData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Progress tracking functions
export const updateProgress = async (progressId, progressData) => {
  const progressRef = doc(db, COLLECTIONS.PROGRESS, progressId);
  return await updateDoc(progressRef, {
    ...progressData,
    updatedAt: new Date()
  });
};