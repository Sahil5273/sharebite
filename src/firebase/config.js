// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these with the keys Firebase gives you!
const firebaseConfig = {
  apiKey: "AIzaSyCN9009Qdx9yeJussgRYEiUIhuA_zdJgns",
  authDomain: "sharebyte-ff1a8.firebaseapp.com",
  projectId: "sharebyte-ff1a8",
  storageBucket: "sharebyte-ff1a8.firebasestorage.app",
  messagingSenderId: "545197199561",
  appId: "1:545197199561:web:feb8bee40c064e99873d18",
  measurementId: "G-881VJXNLCB"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);