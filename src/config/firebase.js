import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";


const firebaseConfig = {
  apiKey: "AIzaSyCyjBgzQCmWcnCOlU5GYd2wlyDAJGKdq8c",
  authDomain: "internship-2025-2.firebaseapp.com",
  projectId: "internship-2025-2",
  storageBucket: "internship-2025-2.firebasestorage.app",
  messagingSenderId: "760544131744",
  appId: "1:760544131744:web:2d381e4e41237938a0a7c5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);