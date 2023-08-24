// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { collection, initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAGTnjuUfSQI-ZAGjYExLBS7oJII_q37A",
  authDomain: "dialogue-react-native.firebaseapp.com",
  projectId: "dialogue-react-native",
  storageBucket: "dialogue-react-native.appspot.com",
  messagingSenderId: "363248967960",
  appId: "1:363248967960:web:eddc6b100d56d568653e6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage)});
export const db = initializeFirestore(app, {experimentalAutoDetectLongPolling: true});