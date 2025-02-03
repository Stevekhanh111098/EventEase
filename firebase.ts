// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-gxx4VuJtcFzbBRC7GjdpAzbUfXK6wT8",
  authDomain: "fir-eventease.firebaseapp.com",
  projectId: "fir-eventease",
  storageBucket: "fir-eventease.firebasestorage.app",
  messagingSenderId: "903802502171",
  appId: "1:903802502171:web:9503f7b177b99a6ce1ccbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


