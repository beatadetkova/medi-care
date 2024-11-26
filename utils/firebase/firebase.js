import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import isMobile from "../isMobile";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_API_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: isMobile()
    ? getReactNativePersistence(ReactNativeAsyncStorage)
    : undefined,
});

export { auth, db };
