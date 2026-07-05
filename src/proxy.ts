import { type NextRequest, NextResponse } from 'next/server';
import { publicRoutes } from './lib/constants/domain';

export async function proxy(req: NextRequest) {
    console.log('kmkl');
    const pathname = req.nextUrl.pathname;

    const refreshToken = req.cookies.get('refresh_token')?.value;
    const accessToken = req.cookies.get('access_token')?.value;
    const hasRFToken = !!refreshToken;

    console.log(
        `[Middleware] ${pathname} | refresh_token: ${hasRFToken} | access_token: ${!!accessToken}`,
    );

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
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|feedback|privacy-policy|terms-and-conditions).*)',
    ],
};
