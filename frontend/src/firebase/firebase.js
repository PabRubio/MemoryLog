import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDxRK7bYRTolyWfCECyjy0dK_A2_o9xeLU",
  authDomain: "memorylog-713.firebaseapp.com",
  projectId: "memorylog-713",
  storageBucket: "memorylog-713.firebasestorage.app",
  messagingSenderId: "252776008221",
  appId: "1:252776008221:web:bf0432861547d1de4294f4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };