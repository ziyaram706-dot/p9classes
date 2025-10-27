import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

async function seedData() {
  // Add a sample course
  const courseRef = await addDoc(collection(db, 'courses'), {
    title: 'Introduction to Web Development',
    description: 'Learn the basics of web development with HTML, CSS, and JavaScript',
    type: 'LIVE',
    category: 'DEVELOPMENT',
    price: 99.99,
    discountedPrice: 79.99,
    features: [
      'Live online classes',
      'Project-based learning',
      'Certificate upon completion'
    ],
    imageUrl: 'https://example.com/webdev.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('Added sample course with ID: ', courseRef.id);
}

// Run the seed function
seedData().catch(console.error);