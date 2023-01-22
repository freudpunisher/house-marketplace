// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK_6wNq2R7iyR4kiU_U1oYpUf20LTaqMc",
  authDomain: "house-marketplace-app-ba087.firebaseapp.com",
  projectId: "house-marketplace-app-ba087",
  storageBucket: "house-marketplace-app-ba087.appspot.com",
  messagingSenderId: "258748154896",
  appId: "1:258748154896:web:e56ef299c010d9df04b695"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore()