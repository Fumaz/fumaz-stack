import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: '__session',
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365, // TODO: Change this to a more reasonable value
        secrets: [process.env.SESSION_SECRET || 'CHANGE_ME_PLEASE'], // TODO: Change this to a more secure value
        secure: process.env.NODE_ENV === 'production',
    },
});

export const {
    getSession,
    commitSession,
    destroySession,
} = sessionStorage;
