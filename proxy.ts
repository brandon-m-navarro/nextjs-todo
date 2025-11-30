import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  // Simple cookie existence check (optimistic)
  const cookie = getSessionCookie(request);
  const isLoggedIn = Boolean(cookie);

  console.log(`Proxy check - isLoggedIn: ${isLoggedIn}, Path: ${request.nextUrl.pathname}`);

  return NextResponse.next();
}

// Apply this proxy logic only to relevant routes:
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
