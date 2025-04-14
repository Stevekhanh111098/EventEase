// Import required Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU63KmJtx0Qo6NM9YyDmAprqmsyg5VAaU",
  authDomain: "eventease-9ee72.firebaseapp.com",
  projectId: "eventease-9ee72",
  storageBucket: "eventease-9ee72.firebasestorage.app",
  messagingSenderId: "19212825958",
  appId: "1:19212825958:web:37b60b12fcf36d609144a7",
  measurementId: "G-YFFDNCZFE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database for event storage
export const storage = getStorage(app); // Firebase Storage for image uploads

export default app; // Export app for potential future Firebase extensions
