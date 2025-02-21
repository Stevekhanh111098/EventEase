// Import required Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-gxx4VuJtcFzbBRC7GjdpAzbUfXK6wT8",
  authDomain: "fir-eventease.firebaseapp.com",
  projectId: "fir-eventease",
  storageBucket: "fir-eventease.appspot.com", // Fixed incorrect storage bucket URL
  messagingSenderId: "903802502171",
  appId: "1:903802502171:web:9503f7b177b99a6ce1ccbe",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Firebase Authentication
export const db = getFirestore(app); // Firestore Database for event storage
export const storage = getStorage(app); // Firebase Storage for image uploads

export default app; // Export app for potential future Firebase extensions
