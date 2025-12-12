// 1. Import fungsi wajib dari Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- Kita butuh ini (Database)

// 2. Konfigurasi Rahasia Kamu (Sudah benar)
const firebaseConfig = {
  apiKey: "AIzaSyDh1w1u72ZeCvmyraBuyti3vKFZqXhARR4",
  authDomain: "sipilah2.firebaseapp.com",
  projectId: "sipilah2",
  storageBucket: "sipilah2.firebasestorage.app",
  messagingSenderId: "1073617692076",
  appId: "1:1073617692076:web:106ce9441221a05201c609",
  measurementId: "G-9NEF82LJMH"
};

// 3. Nyalakan Firebase
const app = initializeApp(firebaseConfig);

// 4. Siapkan Database agar bisa dipakai di ScannerScreen & HistoryScreen
export const db = getFirestore(app);