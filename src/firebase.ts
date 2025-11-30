import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzIXboLe9EQxocvwmEATlDt1RP8A2bfdY",
  authDomain: "atlaset.firebaseapp.com",
  projectId: "atlaset",
  storageBucket: "atlaset.firebasestorage.app",
  messagingSenderId: "798426081525",
  appId: "1:798426081525:web:7053ec7995a960fb487dbc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);