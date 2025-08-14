// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./supabase";

// This is the URL where your login page is located.
// Replace '/login' with the actual path to your login page.
const LOGIN_URL = "/";

// An array of routes that should be protected.
// Any request to a URL that starts with one of these paths will be checked for authentication.
const protectedRoutes = ["/dashboard", "/articles", "/articles/new"];

// The main middleware function that runs on every request.
export async function middleware(request: NextRequest) {
  // Create a Supabase client that can be used on the server.
  // This client will automatically handle the user session from the cookies.
  // The cookie functions must be named get, set, and remove for @supabase/ssr.
  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // Check if the current user has an active session.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the requested path is a protected route.
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If the route is protected and there is no user session,
  // redirect the user to the login page.
  if (isProtectedRoute && !session) {
    const absoluteUrl = new URL(LOGIN_URL, request.nextUrl.origin).toString();
    return NextResponse.redirect(absoluteUrl);
  }

  // If the user is authenticated or the route is not protected, continue to the next step.
  return NextResponse.next();
}

// Configuration for the middleware.
// This tells Next.js which paths the middleware should apply to.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
