import { type NextRequest, NextResponse } from 'next/server';

export async function proxy(_req: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|feedback|privacy-policy|terms-and-conditions|.well-known).*)'
    ]
};
