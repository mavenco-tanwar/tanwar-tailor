import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths that don't need authentication within the admin section
    const isPublicPath = path === "/admin/login";

    // Check if the path is an admin path
    if (path.startsWith("/admin")) {
        const token = request.cookies.get("admin_token")?.value;

        // If it's a protected admin route and no token, redirect to login
        if (!isPublicPath && !token) {
            return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
        }

        // If it's the login page and user is already authenticated, redirect to dashboard
        if (isPublicPath && token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET);
                await jwtVerify(token, secret);
                return NextResponse.redirect(
                    new URL("/admin/dashboard", request.nextUrl)
                );
            } catch (error) {
                // Token invalid, allow access to login page
                return NextResponse.next();
            }
        }

        // specific check for other admin routes to ensure token validity
        if (!isPublicPath && token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET);
                await jwtVerify(token, secret);
                return NextResponse.next();
            } catch (error) {
                // Token invalid, redirect to login
                return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
