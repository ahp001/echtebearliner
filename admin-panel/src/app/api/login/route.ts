import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createAdminToken } from "../../../lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Ungültige Zugangsdaten." },
        { status: 401 }
      );
    }

    const token = await createAdminToken(email);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Login fehlgeschlagen." },
      { status: 500 }
    );
  }
}