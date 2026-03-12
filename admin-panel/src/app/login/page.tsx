"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/push");
    } catch (err: any) {
      setError("Login fehlgeschlagen");
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "60px auto", fontFamily: "system-ui" }}>
      <h1>Admin Login</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Einloggen</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </main>
  );
}