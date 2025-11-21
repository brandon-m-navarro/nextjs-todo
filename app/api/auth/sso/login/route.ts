import { NextResponse } from "next/server";

export async function GET() {
  const authorizeURL = new URL(
    "https://login.bnav.dev/api/auth/oauth2/authorize"
  );

  authorizeURL.searchParams.set("client_id", process.env.TODO_CLIENT_ID!);
  authorizeURL.searchParams.set(
    "redirect_uri",
    "https://todo.bnav.dev/api/auth/callback"
  );
  authorizeURL.searchParams.set("response_type", "code");
  authorizeURL.searchParams.set("scope", "openid profile email");

  // Generate a random state parameter for CSRF protection
  authorizeURL.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(authorizeURL.toString(), 302);
}

//https://todo.bnav.dev/auth/callback
// ?code=t0KaRc1jUr1iTRMI3oP4Mxy4DopUW0DE
// &state=9e447ee2-1023-496d-a9d8-9c489eb59992
