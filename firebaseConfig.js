import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDh1w1u72ZeCvmyraBuyti3vKFZqXhARR4",
  authDomain: "sipilah2.firebaseapp.com",
  projectId: "sipilah2",
  storageBucket: "sipilah2.firebasestorage.app",
  messagingSenderId: "1073617692076",
  appId: "1:1073617692076:web:106ce9441221a05201c609",
  measurementId: "G-9NEF82LJMH"
};

// --- LOGIKA INISIALISASI YANG LEBIH KUAT ---
let app;
let auth;

if (getApps().length === 0) {
  // Jika belum ada aplikasi, buat baru
  app = initializeApp(firebaseConfig);
  // Inisialisasi Auth dengan AsyncStorage (Supaya gak logout sendiri)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  // Jika sudah ada, pakai yang lama (Mencegah error double)
  app = getApp();
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };