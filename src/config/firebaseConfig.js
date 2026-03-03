import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🆕
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey:            "AIzaSyB3jZ8T9lZYTceT6zn9BEF0XwTEHdtO6Dg",
  authDomain:        "counter-app-68d9f.firebaseapp.com",
  projectId:         "counter-app-68d9f",
  storageBucket:     "counter-app-68d9f.firebasestorage.app",
  messagingSenderId: "1071659976809",
  appId:             "1:1071659976809:web:16173c8b9c19faa87d3af8",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app); // 🆕