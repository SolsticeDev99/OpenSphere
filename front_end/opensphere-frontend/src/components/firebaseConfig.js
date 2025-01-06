// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
// const db = getDatabase(app)


export { auth};
