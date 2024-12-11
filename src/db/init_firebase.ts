// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD747XXBGwvTpk82pd7anO7eVgzru_fO8Q",
    authDomain: "serviify-f5e86.firebaseapp.com",
    projectId: "serviify-f5e86",
    storageBucket: "serviify-f5e86.firebasestorage.app",
    messagingSenderId: "885086649809",
    appId: "1:885086649809:web:4a8258e56f4318a941f4f0",
    measurementId: "G-7HWMMB64GK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

