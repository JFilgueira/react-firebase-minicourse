import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAR0OaHai5vjxfJuKMKQZUJN9i-4MrsnsE",
  authDomain: "fir-course-e5595.firebaseapp.com",
  projectId: "fir-course-e5595",
  storageBucket: "fir-course-e5595.appspot.com",
  messagingSenderId: "345108663241",
  appId: "1:345108663241:web:a2143c1808dc1f8c737618"
};

const app = initializeApp(firebaseConfig);

//providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    auth,
    googleProvider,
    db,
    storage
}