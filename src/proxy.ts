import { type NextRequest, NextResponse } from 'next/server';
import { publicRoutes } from './lib/constants/routes';

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    console.log(`[Middleware: 👀] at ${pathname} | cookies:`, Object.fromEntries(req.cookies));

    const refreshToken = req.cookies.get('refresh_token')?.value;
    const hasRFToken = !!refreshToken;

    // Authenticated users visiting landing page → redirect to discover
    if (hasRFToken && pathname === '/') {
        return NextResponse.redirect(new URL('/discover', req.url));
    }

    // Unauthenticated users on protected routes → redirect to login
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
    if (!hasRFToken && !isPublic) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|feedback|privacy-policy|terms-and-conditions|.well-known).*)'
    ]
};
