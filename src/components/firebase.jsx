// src/components/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6F-lJsk6km_boR2El7MwPw6foDCA0pAE",
  authDomain: "crud-opr-82cc1.firebaseapp.com",
  databaseURL: "https://crud-opr-82cc1-default-rtdb.firebaseio.com",
  projectId: "crud-opr-82cc1",
  storageBucket: "crud-opr-82cc1.firebasestorage.app",
  messagingSenderId: "1095705596129",
  appId: "1:1095705596129:web:9ad8f99b3929dfaadd67a0",
  measurementId: "G-1XGE3DXY55",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebase = getDatabase(app); // If you still need Realtime DB