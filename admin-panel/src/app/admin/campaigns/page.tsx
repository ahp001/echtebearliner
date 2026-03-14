"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";

type Campaign = {
  id: string;
  title: string;
  body: string;
  sentCount: number;
  createdAt?: any;
  success?: boolean;
};

export default function CampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);

  useEffect(() => {
    async function loadCampaigns() {
      const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const data: Campaign[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Campaign, "id">),
      }));

      setItems(data);
    }

    loadCampaigns();
  }, []);

  return (
    <main style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kampagnen-Verlauf</h1>

        {items.length === 0 ? (
          <p style={styles.empty}>Noch keine Kampagnen vorhanden.</p>
        ) : (
          <div style={styles.list}>
            {items.map((item, index) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemTitle}>
                  Kampagne {items.length - index}
                </div>

                <div style={styles.meta}>
                  am{" "}
                  {item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleString("de-DE")
                    : "-"}{" "}
                  gesendet an {item.sentCount ?? 0} User
                </div>

                <div style={styles.pushTitle}>{item.title}</div>
                <div style={styles.pushBody}>{item.body}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    background: "#0B0B0B",
    padding: 24,
  },
  card: {
    maxWidth: 900,
    margin: "0 auto",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 20,
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: 900,
    marginBottom: 20,
  },
  empty: {
    color: "#fff",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  item: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(255,255,255,0.04)",
  },
  itemTitle: {
    color: "#C9A227",
    fontWeight: 900,
    fontSize: 18,
    marginBottom: 6,
  },
  meta: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    marginBottom: 12,
  },
  pushTitle: {
    color: "#fff",
    fontWeight: 800,
    marginBottom: 6,
  },
  pushBody: {
    color: "rgba(255,255,255,0.85)",
    whiteSpace: "pre-wrap",
  },
};