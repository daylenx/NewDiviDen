import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDQvzyZ3BkcyOLMxbUAbuKzOiGXsFC5GdQ",
  authDomain: "dividen-55b8d.firebaseapp.com",
  projectId: "dividen-55b8d",
  storageBucket: "dividen-55b8d.firebasestorage.app",
  messagingSenderId: "749990705289",
  appId: "1:749990705289:web:8601bbb166d44e8299ee58",
  measurementId: "G-K11X2W1NBB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 