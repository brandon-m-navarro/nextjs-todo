import { authClient } from "@/lib/auth-client";
// import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  // This calls BetterAuth’s /oauth2/token endpoint
  const { data, error } = await authClient.oauth2.token({
    grant_type: "authorization_code",
    code,
    redirect_uri: "https://todo.bnav.dev/auth/callback",
    client_id: process.env.TODO_CLIENT_ID as string,
    client_secret: process.env.TODO_CLIENT_SECRET as string,
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  // const user = await authClient.oauth2.userinfo({
  //   //   accessToken: data?.access_token as string,
  // });
  // console.log("TESTING");
  // console.log("OAuth2 User Info:", user);
  // const atoken = (await cookies()).get(
  //   "__Secure-better-auth.session_token"
  // )?.value;
  // console.log("Access Token:", atoken);

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

  //   // Handle error
  //   if (error) {
  //     return new Response(error.message, { status: 400 });
  //   }

  return Response.redirect("https://todo.bnav.dev/projects");
}
