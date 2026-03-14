"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { type CSSProperties, type FormEvent, useEffect, useState } from "react";
import { db } from "../../../lib/firebase";

type Campaign = {
  id: string;
  title: string;
  body: string;
  sentCount: number;
  success?: boolean;
  createdAt?: any;
};

export default function PushPage() {
  const router = useRouter();

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  async function loadCampaigns() {
    try {
      const q = query(
        collection(db, "campaigns"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const items: Campaign[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Campaign, "id">),
      }));

      setCampaigns(items);
    } catch (error) {
      console.log("Campaign load error:", error);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const json = await res.json();

      if (!res.ok) {
        setResult(json.error || "Fehler beim Senden.");
        return;
      }

      setResult(`Push gesendet an ${json.count} Nutzer.`);
      setTitle("");
      setBody("");
      await loadCampaigns();
    } catch {
      setResult("Fehler beim Senden.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Push an alle senden</h1>
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Nachricht"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sende..." : "An alle senden"}
          </button>
        </form>

        {result ? <p style={styles.result}>{result}</p> : null}

        <div style={styles.historyBox}>
          <h2 style={styles.historyTitle}>Kampagnen-Verlauf</h2>

          {campaigns.length === 0 ? (
            <p style={styles.empty}>Noch keine Kampagnen vorhanden.</p>
          ) : (
            <div style={styles.historyList}>
              {campaigns.map((item, index) => (
                <div key={item.id} style={styles.historyItem}>
                  <div style={styles.historyHeadline}>
                    Kampagne {campaigns.length - index}
                  </div>

                  <div style={styles.historyMeta}>
                    am{" "}
                    {item.createdAt?.toDate
                      ? item.createdAt.toDate().toLocaleString("de-DE")
                      : "-"}{" "}
                    gesendet an {item.sentCount ?? 0} User
                  </div>

                  <div style={styles.historyPushTitle}>{item.title}</div>
                  <div style={styles.historyPushBody}>{item.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    background: "#000000",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 820,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
    flexWrap: "wrap",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: 900,
    margin: 0,
    lineHeight: 1.1,
  },
  logout: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    borderRadius: 16,
    padding: "12px 18px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "16px 18px",
    borderRadius: 18,
    fontSize: 16,
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    minHeight: 180,
    resize: "vertical",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "16px 18px",
    borderRadius: 18,
    fontSize: 16,
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    background: "#C9A227",
    color: "#0B0B0B",
    border: 0,
    borderRadius: 18,
    padding: "16px 18px",
    fontWeight: 900,
    fontSize: 18,
    cursor: "pointer",
    width: "100%",
  },
  result: {
    color: "#fff",
    marginTop: 18,
    fontSize: 15,
    lineHeight: 1.4,
  },
  historyBox: {
    marginTop: 28,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: 22,
  },
  historyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 14,
  },
  empty: {
    color: "rgba(255,255,255,0.7)",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  historyItem: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  historyHeadline: {
    color: "#C9A227",
    fontWeight: 900,
    fontSize: 17,
    marginBottom: 6,
  },
  historyMeta: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  historyPushTitle: {
    color: "#fff",
    fontWeight: 800,
    marginBottom: 6,
  },
  historyPushBody: {
    color: "rgba(255,255,255,0.86)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
  },
};