// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNGBVWgv9TPVhvv36v1MJtuYgw9OJCVyA",
  authDomain: "realtor-clone-1c518.firebaseapp.com",
  projectId: "realtor-clone-1c518",
  storageBucket: "realtor-clone-1c518.appspot.com",
  messagingSenderId: "1023514929576",
  appId: "1:1023514929576:web:4af5e3b20ed582da85159d"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();