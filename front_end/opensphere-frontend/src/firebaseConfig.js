// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"; // Make sure this import is present

const firebaseConfig = {
    apiKey: "AIzaSyDBxawxfrBMnQd39GOrCHkSqWUzFGPiPq8",
    authDomain: "opensphere-62cfa.firebaseapp.com",
    databaseURL: "https://opensphere-62cfa-default-rtdb.firebaseio.com",
    projectId: "opensphere-62cfa",
    storageBucket: "opensphere-62cfa.appspot.com",
    messagingSenderId: "222953338493",
    appId: "1:222953338493:web:6d8921dbfa02d12cd3e314",
    measurementId: "G-WRXTRV0ZKE"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


const database = firebase.database();

export { database };