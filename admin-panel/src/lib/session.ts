import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET);

if (!process.env.ADMIN_SESSION_SECRET) {
  throw new Error("ADMIN_SESSION_SECRET fehlt.");
}

export async function createAdminToken(email: string) {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}