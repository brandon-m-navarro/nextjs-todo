import { authClient } from "@/lib/auth-client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("Missing code in callback");
    return new Response("Missing code", { status: 400 });
  }

  try {
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
    const tokenResponse = await fetch(
      "https://login.bnav.dev/api/auth/oauth2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${data?.access_token}`,
        },
      }
    );
    const userInfo = await tokenResponse.json();
    console.log("OAuth2 User Info:", userInfo);

    // 1. Store user reference in your database
    const user = await prisma.user.upsert({
      where: { externalId: userInfo.sub },
      update: { email: userInfo.email, name: userInfo.name },
      create: {
        externalId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
      },
    });

    // 2. Create a simple session token
    const sessionToken = crypto.randomUUID();

    // 3. Store session in database
    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 4. Set cookie
    const response = NextResponse.redirect("https://todo.bnav.dev/projects");

    response.cookies.set({
      name: "session_token",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in callback:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
