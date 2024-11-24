import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHoq_2YoXoQQwYKCmCw0oGYB_tqYFBlPE",
  authDomain: "medidaisy-scribe.firebaseapp.com",
  projectId: "medidaisy-scribe",
  storageBucket: "medidaisy-scribe.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);