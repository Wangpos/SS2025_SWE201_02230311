import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXYtCV7RxW0Hg30BBoD2WhY-gDVOXzTYI",
  authDomain: "todo-application-9f107.firebaseapp.com",
  projectId: "todo-application-9f107",
  storageBucket: "todo-application-9f107.firebasestorage.app",
  messagingSenderId: "467067515423",
  appId: "1:467067515423:web:5b6728185a9dad89985b2a",
  measurementId: "G-E7CSLFKENB",
};

// Initialize Firebase app only once
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIRESTORE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB };
