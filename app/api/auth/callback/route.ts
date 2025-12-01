import { authClient } from "@/lib/auth-client";
import { cookies } from "next/headers";

export async function GET(req: Request) {

  console.log("Callback route hit");
  const url = new URL(req.url);
  console.log("Full URL:", url.toString());
  console.log("Search params:", Object.fromEntries(url.searchParams.entries()));

  const code = url.searchParams.get("code");

  if (!code) {
    console.error("Missing code in callback");
    return new Response("Missing code", { status: 400 });
  }

  // This calls BetterAuth’s /oauth2/token endpoint
  const { data, error } = await authClient.oauth2.token({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://todo.bnav.dev/api/auth/callback",
    client_id: process.env.TODO_CLIENT_ID as string,
    client_secret: process.env.TODO_CLIENT_SECRET as string,
  });

  if (error) {
    console.error("Error exchanging code for token:", error);
    return new Response(error.message, { status: 400 });
  }

  // Use the access token to fetch user info
  const response = await fetch(
    "https://login.bnav.dev/api/auth/oauth2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${data?.access_token}`,
      },
    }
  );
  const userInfo = await response.json();
  console.log("OAuth2 User Info:", userInfo);

  // Create a session in your database (just local for now)
  const session = //await db.session.create({
    /*data:*/ {
      // Generate a random session ID
      id: crypto.randomUUID(),
      // Store the user's unique identifier from the OIDC provider
      sub: userInfo.sub,
      // Optionally store user info for quick access (or you can fetch from userinfo endpoint when needed)
      email: userInfo.email,
      name: userInfo.name,
      // Set expiration (e.g., 1 week)
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  //});

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("session_id", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 1 week
    path: "/",
  });

  return Response.redirect("https://todo.bnav.dev/projects");
}
