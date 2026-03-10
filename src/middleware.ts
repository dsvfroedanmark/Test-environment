import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware placeholder — add auth checks here in Phase 3.
// Currently allows all requests through.

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
