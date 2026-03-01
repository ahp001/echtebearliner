const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const expo = new Expo();

// ---- Firebase Admin init via ENV (Service Account JSON) ----
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_JSON env var");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
});

const db = admin.firestore();

// ---- Helper: verify Firebase ID token ----
async function requireAdmin(req) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    return { ok: false, status: 401, msg: "Missing Authorization Bearer token" };
  }

  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const me = await db.doc(`users/${uid}`).get();
    const role = me.exists ? me.data().role : null;

    if (role !== "admin") {
      return { ok: false, status: 403, msg: "Not admin" };
    }

    return { ok: true, uid };
  } catch (e) {
    return { ok: false, status: 401, msg: "Invalid token" };
  }
}

// ---- POST /broadcast ----
app.post("/broadcast", async (req, res) => {
  const gate = await requireAdmin(req);
  if (!gate.ok) return res.status(gate.status).json({ ok: false, error: gate.msg });

  const title = String(req.body?.title ?? "").trim();
  const body = String(req.body?.body ?? "").trim();

  if (!title || !body) {
    return res.status(400).json({ ok: false, error: "title/body required" });
  }

  try {
    // tokens sammeln
    const snap = await db.collection("users").get();

    const messages = [];
    snap.forEach((doc) => {
      const t = doc.data().pushToken;
      if (typeof t === "string" && Expo.isExpoPushToken(t)) {
        messages.push({
          to: t,
          sound: "default",
          title,
          body,
          data: { kind: "broadcast" },
        });
      }
    });

    // in chunks senden
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    return res.json({ ok: true, sent: messages.length });
  } catch (e) {
    console.error("broadcast error", e);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.get("/", (_req, res) => res.send("OK"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Push server running on", port));