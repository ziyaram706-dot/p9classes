import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAgvqljeKuz0Aoht-0lfZFK71ddIDrPJo8",
  authDomain: "p9class.firebaseapp.com",
  projectId: "p9class",
  storageBucket: "p9class.firebasestorage.app",
  messagingSenderId: "357279869541",
  appId: "1:357279869541:web:d50b2fec90f5f118a9b48c",
  measurementId: "G-PX1TKDDECK"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, db, auth, storage, analytics };