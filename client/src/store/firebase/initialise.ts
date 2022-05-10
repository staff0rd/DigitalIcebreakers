import { initializeApp } from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATipYWYvg5AqvZYIMoDKg6Cbz0wq17JT0",
  authDomain: "digital-icebreakers.firebaseapp.com",
  databaseURL:
    "https://digital-icebreakers-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "digital-icebreakers",
  storageBucket: "digital-icebreakers.appspot.com",
  messagingSenderId: "918542717228",
  appId: "1:918542717228:web:6e1393044697da69495c89",
  measurementId: "G-FM8L75R6GG",
};
export const initialise = () => initializeApp(firebaseConfig);
