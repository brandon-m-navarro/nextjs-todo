import { NextResponse } from "next/server";

export async function GET() {
  const authorizeURL = new URL(
    "https://login.bnav.dev/api/auth/oauth2/authorize"
  );

  authorizeURL.searchParams.set("client_id", process.env.TODO_CLIENT_ID!);
  authorizeURL.searchParams.set(
    "redirect_uri",
    "https://todo.bnav.dev/auth/callback"
  );
  authorizeURL.searchParams.set("response_type", "code");
  authorizeURL.searchParams.set("scope", "openid profile email");

  // Generate a random state parameter for CSRF protection
  authorizeURL.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(authorizeURL.toString(), 302);
}
