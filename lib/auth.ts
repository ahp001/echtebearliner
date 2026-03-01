import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function registerWithEmail(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

  // user doc anlegen
  await setDoc(
    doc(db, "users", cred.user.uid),
    {
      email: cred.user.email,
      createdAt: serverTimestamp(),
      role: "customer", // später: admin/employee/customer
    },
    { merge: true }
  );

  return cred.user;
}

export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}