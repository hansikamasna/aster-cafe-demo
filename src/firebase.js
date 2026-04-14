import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpveH6x2ZRbtoh7F-YFm1UKS9dV1icURo",
  authDomain: "aster-cafe-demo.firebaseapp.com",
  projectId: "aster-cafe-demo",
  storageBucket: "aster-cafe-demo.firebasestorage.app",
  messagingSenderId: "121393571940",
  appId: "1:121393571940:web:60773a2fe420dbac6f1771"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);