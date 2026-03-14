"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("info@maras-group.de");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Login fehlgeschlagen.");
        return;
      }

      router.push("/admin/push");
      router.refresh();
    } catch {
      setError("Login fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.wrapper}>
      <form onSubmit={onSubmit} style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>

        <input
          style={styles.input}
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <p style={styles.error}>{error}</p> : null}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Lädt..." : "Einloggen"}
        </button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0B0B0B",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 20,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: 900,
    margin: 0,
  },
  input: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: 14,
    fontSize: 16,
  },
  button: {
    background: "#C9A227",
    color: "#0B0B0B",
    border: 0,
    borderRadius: 14,
    padding: "14px 16px",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "#ff7b7b",
    margin: 0,
  },
};