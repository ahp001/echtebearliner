"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";

export default function PushPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setUid(user.uid);

      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.exists() ? (snap.data() as any).role : null;

      if (role !== "admin") {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(true);
    });

    return () => unsubscribe();
  }, [router]);

  async function sendPush() {
    if (!title || !body) {
      setMessage("Bitte alles ausfüllen.");
      return;
    }

    if (!uid) return;

    await addDoc(collection(db, "pushJobs"), {
      title,
      body,
      createdBy: uid,
      createdAt: serverTimestamp(),
      status: "queued",
    });

    setTitle("");
    setBody("");
    setMessage("✅ Push-Job erstellt.");
  }

  if (isAdmin === null) return <p style={{ padding: 20 }}>Lade...</p>;

  if (isAdmin === false)
    return (
      <main style={{ padding: 20 }}>
        <h1>Kein Zugriff</h1>
        <button
          onClick={() => {
            signOut(auth);
            router.push("/login");
          }}
        >
          Logout
        </button>
      </main>
    );

  return (
    <main style={{ maxWidth: 500, margin: "50px auto", fontFamily: "system-ui" }}>
      <h1>Push senden</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Nachricht"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button onClick={sendPush}>Senden</button>

        <button
          onClick={() => {
            signOut(auth);
            router.push("/login");
          }}
        >
          Logout
        </button>

        {message && <p>{message}</p>}
      </div>
    </main>
  );
}