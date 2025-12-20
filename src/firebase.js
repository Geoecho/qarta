import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdgcdCI2VGG1eHttnJuQ2u0SZ1M6atTi8",
    authDomain: "qarta-13864.firebaseapp.com",
    projectId: "qarta-13864",
    storageBucket: "qarta-13864.firebasestorage.app",
    messagingSenderId: "318807206504",
    appId: "1:318807206504:web:e4f26511f865689776e9dd",
    measurementId: "G-HVMD7M88JH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore (Database)
export const db = getFirestore(app);
// Initialize Auth
export const auth = getAuth(app);
