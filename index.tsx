<<<<<<< HEAD

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Correct relative path import

// Import Firebase using the v9 modular SDK
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app"; // Added FirebaseApp type
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";


// Your web app's Firebase configuration (UPDATED as per user request)
const firebaseConfig = {
  apiKey: "AIzaSyBmUc26zMXDWEzKPyoLvjg-bv9dexOO76U",
  authDomain: "control-shift-pro-86730.firebaseapp.com",
  databaseURL: "https://control-shift-pro-86730-default-rtdb.firebaseio.com", // Removed trailing slash
  projectId: "control-shift-pro-86730",
  storageBucket: "control-shift-pro-86730.firebasestorage.app",
  messagingSenderId: "390755674582",
  appId: "1:390755674582:web:6237382cd4a438601f1c77",
  measurementId: "G-N4ERPYF35L" 
};

// Initialize Firebase
let appFirebase: FirebaseApp; // Use FirebaseApp type
if (!getApps().length) {
  try {
    appFirebase = initializeApp(firebaseConfig);
    console.log("Firebase App Initialized successfully (Modular)", appFirebase);
  } catch (error) {
    console.error("CRITICAL: Firebase App initialization failed:", error);
    // Render a fallback UI or display a prominent error message
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `<div style="color: red; text-align: center; padding: 20px; font-family: sans-serif;"><h1>Application Error</h1><p>Failed to initialize Firebase. Please check the console for details and contact support.</p></div>`;
    }
    throw error; // Re-throw to stop further execution if Firebase init fails
  }
} else {
  appFirebase = getApp();
  console.log("Firebase App already initialized, got existing instance (Modular)", appFirebase);
}


// Initialize Firebase Analytics (asynchronously and safely)
let analytics: Analytics | null = null;
isAnalyticsSupported().then(supported => {
  if (supported) {
    try {
      analytics = getAnalytics(appFirebase);
      console.log("Firebase Analytics Initialized (Modular)", analytics);
    } catch (error) {
      console.error("Firebase Analytics initialization failed (post-support check):", error);
      // You might want to log this to an error reporting service
    }
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
}).catch(error => {
  console.error("Error checking Firebase Analytics support:", error);
});


// Initialize Cloud Firestore and get a reference to the service
const db: Firestore = getFirestore(appFirebase);
console.log("Firebase Firestore Initialized (Modular)", db);

// Initialize Firebase Authentication and get a reference to the service
const auth: Auth = getAuth(appFirebase);
console.log("Firebase Authentication Initialized (Modular)", auth);

// Initialize Firebase Realtime Database and get a reference to the service
const rtdb: Database = getDatabase(appFirebase);
console.log("Firebase Realtime Database Initialized (Modular)", rtdb);


const rootElement = document.getElementById('root');
if (!rootElement) {
  // This check is a bit redundant if Firebase fails above and replaces innerHTML,
  // but good for general sanity.
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Correct relative path import
import { ActivityLogProvider } from './contexts/ActivityLogContext'; // Correct relative path
import { LanguageProvider } from './contexts/LanguageContext'; // Added import
import { Language } from './types'; // Added import for Language enum

const rootElement = document.getElementById('root');
if (!rootElement) {
>>>>>>> bee2d85 (updated)
  console.error("CRITICAL: Could not find root element to mount React app.");
  const body = document.body;
  if(body) {
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.padding = '20px';
    errorDiv.style.fontFamily = 'sans-serif';
    errorDiv.innerHTML = '<h1>Application Critical Error</h1><p>Root HTML element not found. Deployment issue likely.</p>';
    if (body.firstChild) {
      body.insertBefore(errorDiv, body.firstChild);
    } else {
      body.appendChild(errorDiv);
    }
  }
  throw new Error("Could not find root element to mount to");
}

<<<<<<< HEAD
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export db, auth, rtdb, and analytics instances for use in other parts of the application
// Note: analytics is initialized asynchronously and might be null initially.
export { db, auth, rtdb, analytics };
=======
// Determine initial language here
const getInitialLanguage = (): Language => {
  try {
    const storedLang = localStorage.getItem('appLanguage') as Language | null;
    if (storedLang && (storedLang === Language.EN || storedLang === Language.AR)) {
      return storedLang;
    }
  } catch (e) {
    console.warn("Could not read language from localStorage", e);
  }
  return Language.AR; // Default language
};

const initialAppLanguage = getInitialLanguage();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider defaultLanguage={initialAppLanguage}>
      <ActivityLogProvider>
        <App />
      </ActivityLogProvider>
    </LanguageProvider>
  </React.StrictMode>
);

export {}; // Keep it as a module
>>>>>>> bee2d85 (updated)
