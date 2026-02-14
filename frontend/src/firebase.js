// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // ✅ Import Firebase Authentication
import { getStorage } from "firebase/storage"; // ✅ For file uploads (optional)
import { getFirestore } from "firebase/firestore"; // ✅ For database (optional)

// 🔹 Alinafe Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5mkYhoJVy8rMpTwpy43y8RPYP5x7P6uo",
  authDomain: "alinafe-77f09.firebaseapp.com",
  projectId: "alinafe-77f09",
  storageBucket: "alinafe-77f09.firebasestorage.app",
  messagingSenderId: "557088401969",
  appId: "1:557088401969:web:3c5d5f850dd3f72e0a8310",
  measurementId: "G-FLLCCJKGD8",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services for use in your app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
