import { /*NextRequest,*/ NextResponse } from "next/server";

export async function proxy(/*request: NextRequest*/) {
  return NextResponse.next();
}

// Apply this proxy logic only to relevant routes:
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
