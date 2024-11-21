import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
  } from "@env"; // Import environment variables
  
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
  };
  
const app = initializeApp(firebaseConfig); //initialize firebase instance
const storage = getStorage(app);//initialize Cloud Storage and get a reference to the service

export { storage };