import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjG1QQU1m2ilUcWIDAvDh4BHhbSLSuQjo",
  authDomain: "echtebearliner.firebaseapp.com",
  projectId: "echtebearliner",
  storageBucket: "echtebearliner.firebasestorage.app",
  messagingSenderId: "886466098233",
  appId: "1:886466098233:web:0a3dd96d616a10429b09e8",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: firebaseAuth.Auth;

try {
  auth = firebaseAuth.initializeAuth(app, {
    persistence: (firebaseAuth as any).getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = firebaseAuth.getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

