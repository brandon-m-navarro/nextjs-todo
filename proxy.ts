import { /*NextRequest,*/ NextResponse } from "next/server";

export async function proxy(/*req: NextRequest*/) {
  return NextResponse.next();
  // console.log("Proxying request:", req.url);
  // const token = req.cookies.get("auth_token")?.value;

  // console.log("Found token:", token);

  // if (!token) {
  //   // No JWT → redirect to App A login
  //   return NextResponse.redirect("https://app-dashboard-livid-omega.vercel.app/login");
  // }

  // try {
  //   const user = await validateToken(token);
  //   console.log("Validated user:", user);

  //   // Optional: attach user to request headers for API routes
  //   const response = NextResponse.next();
  //   response.headers.set("X-User-Id", user.id as string);
  //   return response;
  // } catch (err) {
  //   console.error("JWT validation failed:", err);
  //   return NextResponse.redirect("https://app-dashboard-livid-omega.vercel.app/login");
  // }
}

// Apply this proxy logic only to relevant routes:
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};