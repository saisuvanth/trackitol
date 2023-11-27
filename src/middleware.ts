export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/',
        '/groups/:path'
        // '/((?!api|auth|_next/static|_next/image|favicon.ico).*)'
    ]
}