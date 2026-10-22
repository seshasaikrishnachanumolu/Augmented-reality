import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return NextResponse.json({ error: "Please enter your email and password." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Deliberately return the same generic error whether the email doesn't
  // exist or the password is wrong, so this endpoint doesn't leak which
  // emails have accounts.
  const genericError = NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user) return genericError;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return genericError;

  const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name });
  await setSessionCookie(token);

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
