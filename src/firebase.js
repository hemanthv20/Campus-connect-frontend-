import { initializeApp } from "firebase/app";
import firebase from 'firebase/app';
import 'firebase/storage';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDpBQ2HrCURYsKvqTKQnpO_TiJjb956pOI",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "campusconnect-10901.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "campusconnect-10901",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "campusconnect-10901.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1076337721495",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1076337721495:web:1fe749ff4f6fd1f62ea9d2",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-219N5ZL046"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);