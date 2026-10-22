import { NextResponse } from "next/server";
import { getClerkSession } from "@/lib/server/clerkSession";

export async function GET() {
  const session = await getClerkSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({
    user: { id: session.userId, email: session.email, name: session.name },
  });
}
