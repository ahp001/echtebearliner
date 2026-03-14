import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";
import { verifyAdminToken } from "../../../lib/session";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    await verifyAdminToken(session);

    const { title, body } = await req.json();

    if (
      typeof title !== "string" ||
      typeof body !== "string" ||
      !title.trim() ||
      !body.trim()
    ) {
      return NextResponse.json(
        { error: "Titel und Text sind erforderlich." },
        { status: 400 }
      );
    }

    if (title.length > 80 || body.length > 300) {
      return NextResponse.json(
        { error: "Titel oder Text zu lang." },
        { status: 400 }
      );
    }

    const users = await adminDb.collection("users").get();

    const tokens: string[] = [];

    users.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      const token = data.pushToken;

      if (
        typeof token === "string" &&
        token.startsWith("ExponentPushToken[") &&
        token.endsWith("]")
      ) {
        tokens.push(token);
      }
    });

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: "Keine gültigen Push-Tokens gefunden." },
        { status: 400 }
      );
    }

    const messages = tokens.map((token) => ({
      to: token,
      sound: "default",
      title: title.trim(),
      body: body.trim(),
    }));

    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(messages),
    });

    const data = await res.json();

    await adminDb.collection("campaigns").add({
  title: title.trim(),
  body: body.trim(),
  sentCount: tokens.length,
  createdAt: new Date(),
  success: res.ok,
});

/* LOG SPEICHERN */
await adminDb.collection("adminLogs").add({
  action: "send_push",
  title: title.trim(),
  body: body.trim(),
  deviceCount: tokens.length,
  success: res.ok,
  createdAt: new Date(),
});

/* ENDE LOG */

if (!res.ok) {
      return NextResponse.json(
        { error: "Expo Push Fehler.", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: tokens.length,
      response: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Push konnte nicht gesendet werden.",
        details: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}