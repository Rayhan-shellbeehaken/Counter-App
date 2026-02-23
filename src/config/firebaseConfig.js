import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3jZ8T9lZYTceT6zn9BEF0XwTEHdtO6Dg",
  authDomain: "counter-app-68d9f.firebaseapp.com",
  projectId: "counter-app-68d9f",
  storageBucket: "counter-app-68d9f.firebasestorage.app",
  messagingSenderId: "1071659976809",
  appId: "1:1071659976809:web:16173c8b9c19faa87d3af8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);