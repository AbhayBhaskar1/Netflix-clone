// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXDBX-TlqJ7FtbVJQm1vWV_0kqPbADGTY",
  authDomain: "netflix-clone-ccd3d.firebaseapp.com",
  projectId: "netflix-clone-ccd3d",
  storageBucket: "netflix-clone-ccd3d.appspot.com",
  messagingSenderId: "771001559749",
  appId: "1:771001559749:web:4bb7eec5353466ddbc5eac",
  measurementId: "G-CV7GSXWJ7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();