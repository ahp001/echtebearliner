const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");

admin.initializeApp();
const expo = new Expo();

exports.sendPushToAll = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Not logged in");
  }

  const uid = context.auth.uid;

  const me = await admin.firestore().doc(`users/${uid}`).get();
  const role = me.exists ? me.data().role : null;
  if (role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Not admin");
  }

  const title = String(data?.title ?? "").trim();
  const body = String(data?.body ?? "").trim();
  if (!title || !body) {
    throw new functions.https.HttpsError("invalid-argument", "title/body required");
  }

  const snap = await admin.firestore().collection("users").get();

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

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }

  return { ok: true, sent: messages.length };
});