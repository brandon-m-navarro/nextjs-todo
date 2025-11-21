import { authClient } from "@/lib/auth-client";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  // const user = await authClient.oauth2.userinfo({
  //   //   accessToken: data?.access_token as string,
  // });
  // console.log("TESTING");
//   console.log("OAuth2 User Info:", user);
  // const atoken = (await cookies()).get(
  //   "__Secure-better-auth.session_token"
  // )?.value;
  // console.log("Access Token:", atoken);

}