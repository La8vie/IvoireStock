// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjFaIlnZt0xz12W2Ip1VT_cEZ86_o7WYk",
  authDomain: "ndsmon-inventaire-2024.firebaseapp.com",
  projectId: "ndsmon-inventaire-2024",
  storageBucket: "ndsmon-inventaire-2024.firebasestorage.app",
  messagingSenderId: "259689548234",
  appId: "1:259689548234:web:43b26234a2cc366d1b2733",
  measurementId: "G-7BMEZSWS0B"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
