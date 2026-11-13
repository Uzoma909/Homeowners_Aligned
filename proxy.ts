import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /command routes
  if (!pathname.startsWith("/command")) {
    return NextResponse.next();
  }

  // The admin dashboard is switched off unless explicitly enabled.
  // The public portfolio deployment leaves this unset.
  if (process.env.ENABLE_ADMIN_DASHBOARD !== "true") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Create a response we can modify cookies on
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Check session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // No session — silently redirect to home (route doesn't exist)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check admin role in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    // Not admin — silently redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/command/:path*"],
};

export default proxy;
