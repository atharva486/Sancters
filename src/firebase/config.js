// // src/firebase/config.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // Your Firebase config (replace with your project keys from Firebase console)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Export services
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBicJoYeavFAgD5SuO41fgTmYiuffPyzww",
  authDomain: "produs-35a29.appspot.com", //firebaseapp.com
  projectId: "produs-35a29",
  storageBucket: "produs-35a29.firebasestorage.app",
  messagingSenderId: "1077147562675",
  appId: "1:1077147562675:web:ac94ccc4b4bae2d53b36c6",
  measurementId: "G-V25YF8PCFM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);