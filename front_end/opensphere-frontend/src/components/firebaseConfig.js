// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getDatabase,set,ref } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDBxawxfrBMnQd39GOrCHkSqWUzFGPiPq8",
  authDomain: "opensphere-62cfa.firebaseapp.com",
  projectId: "opensphere-62cfa",
  storageBucket: "opensphere-62cfa.appspot.com",
  messagingSenderId: "222953338493",
  appId: "1:222953338493:web:6d8921dbfa02d12cd3e314",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const storage = getStorage(app);

export { auth, provider };
