// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8OUGJLatnS0aksRFuJnXowEv2k7uipg4",
  authDomain: "try-jesus-app.firebaseapp.com",
  projectId: "try-jesus-app",
  storageBucket: "try-jesus-app.firebasestorage.app",
  messagingSenderId: "202287377847",
  appId: "1:202287377847:web:53cc1ee4c8285fac314c32",
  measurementId: "G-4E2R98GE1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, app, auth };
