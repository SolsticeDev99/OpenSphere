import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDBxawxfrBMnQd39GOrCHkSqWUzFGPiPq8",
  authDomain: "opensphere-62cfa.firebaseapp.com",
  projectId: "opensphere-62cfa",
  storageBucket: "opensphere-62cfa.appspot.com",
  messagingSenderId: "222953338493",
  appId: "1:222953338493:web:6d8921dbfa02d12cd3e314",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
//const database = getDatabase(app); // Add this line for Realtime Database
//const storage = getStorage(app); // Uncomment if you need Firebase Storage

export { auth, provider};
