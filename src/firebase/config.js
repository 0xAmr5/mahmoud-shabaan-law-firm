import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyAGuAJ7zmfgjTFFZcTkp6VhLLyCD0juMlY',

  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'mahmoud-shabaan-legal.firebaseapp.com',

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    'mahmoud-shabaan-legal',

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'mahmoud-shabaan-legal.firebasestorage.app',

  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '323152856872',

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:323152856872:web:0d29a3a839d97bc688f21d',
};

export const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

const secondaryApp =
  getApps().find((firebaseApp) => firebaseApp.name === 'Secondary') ||
  initializeApp(firebaseConfig, 'Secondary');

export const secondaryAuth = getAuth(secondaryApp);

export default app;