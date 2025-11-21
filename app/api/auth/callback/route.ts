import { authClient } from "@/lib/auth-client";
// import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
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

  return Response.redirect("https://todo.bnav.dev/projects");
}
