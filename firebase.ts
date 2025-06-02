
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBmUc26zMXDWEzKPyoLvjg-bv9dexOO76U",
  authDomain: "control-shift-pro-86730.firebaseapp.com",
  databaseURL: "https://control-shift-pro-86730-default-rtdb.firebaseio.com",
  projectId: "control-shift-pro-86730",
  storageBucket: "control-shift-pro-86730.firebasestorage.app",
  messagingSenderId: "390755674582",
  appId: "1:390755674582:web:6237382cd4a438601f1c77",
  measurementId: "G-N4ERPYF35L"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Database = getDatabase(app);
const storage: FirebaseStorage = getStorage(app);

let analytics: Analytics | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("Firebase Analytics initialized");
  } else {
    console.log("Firebase Analytics not supported on this browser.");
  }
});

export { app, auth, db, storage, analytics };
