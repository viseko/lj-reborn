import { type NextRequest, NextResponse } from "next/server";

const AUTH_ONLY_PATHS = ["/login", "/register", "/forgot", "/reset-password"];

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("access_token");
  const { pathname } = request.nextUrl;

  if (hasSession && AUTH_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Дублируем (из-за ограничения фреймворка)
export const config = {
  matcher: ["/login", "/register", "/forgot", "/reset-password"],
};
