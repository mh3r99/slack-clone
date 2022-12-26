// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjLcYw2t60nkgExACr0t5eJwOqErRKVxc",
  authDomain: "slack-clone-app-bfbac.firebaseapp.com",
  databaseURL:
    "https://slack-clone-app-bfbac-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "slack-clone-app-bfbac",
  storageBucket: "slack-clone-app-bfbac.appspot.com",
  messagingSenderId: "794953762293",
  appId: "1:794953762293:web:c3c319540cd652fa9c0cbc",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
