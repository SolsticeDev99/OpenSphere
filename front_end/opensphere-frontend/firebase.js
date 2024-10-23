// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDBxawxfrBMnQd39GOrCHkSqWUzFGP",
  authDomain: "opensphere-62cfa.firebaseapp.com",
  databaseURL: "https://opensphere-62cfa-default-rtdb.firebaseio.com",
  projectId: "opensphere-62cfa",
  storageBucket: "opensphere-62cfa.appspot.com",
  messagingSenderId: "222953338493",
  appId: "1:222953338493:web:6d8921dbfa02d12cd3e314"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

