import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/about'];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    const isAuthRequired = !publicRoutes.some((route) =>
        pathname.startsWith(route),
    );

    const accessToken = req.cookies.get('access_token')?.value;
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // No tokens at all
    if (!accessToken && !refreshToken) {
        if (isAuthRequired) return redirectToSignin(req);
        return NextResponse.next();
    }

    // Drop refresh redirect logic; always proceed.
    return NextResponse.next();
}

function redirectToSignin(req: NextRequest) {
    const signinUrl = new URL('/login', req.url);
    return NextResponse.redirect(signinUrl);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|feedback|privacy-policy|terms-and-conditions).*)',
    ],
};
