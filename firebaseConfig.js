// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- INI CONFIG BARU KAMU ---
const firebaseConfig = {
  apiKey: "AIzaSyDh1w1u72ZeCvmyraBuyti3vKFZqXhARR4",
  authDomain: "sipilah2.firebaseapp.com",
  projectId: "sipilah2",
  storageBucket: "sipilah2.firebasestorage.app",
  messagingSenderId: "1073617692076",
  appId: "1:1073617692076:web:106ce9441221a05201c609",
  measurementId: "G-9NEF82LJMH"
};

// Inisialisasi Aplikasi
const app = initializeApp(firebaseConfig);

// Inisialisasi Auth dengan Pencegah Logout (Persistence)
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

// Inisialisasi Database
const db = getFirestore(app);

export { app, auth, db };