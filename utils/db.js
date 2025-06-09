// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApWqz8aBgXo5W7jJpYRRDOcMURQkS7YPw",
  authDomain: "tictactoe-1359c.firebaseapp.com",
  projectId: "tictactoe-1359c",
  storageBucket: "tictactoe-1359c.firebasestorage.app",
  messagingSenderId: "142408599567",
  appId: "1:142408599567:web:9639b6c9b0dc8fef503b7a",
  measurementId: "G-FPGY8LQ90Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
