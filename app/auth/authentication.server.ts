import {database} from '~/database/database';
import {json, redirect} from '@remix-run/node';
import {User} from '@prisma/client';
import {commitSession, getSession} from '~/auth/session.server';
import {nanoid} from 'nanoid/non-secure';

export async function isAuthenticated(request: Request): Promise<Omit<User, 'password'>> {
    const {headers} = request;
    const cookieHeader = headers.get('Cookie');
    const session = await getSession(cookieHeader);
    const url = new URL(request.url);
    const path = url.pathname;
    const isLogin = path.toLowerCase().startsWith('/login') || path.toLowerCase().startsWith('/register');
    const redirectUrl = !isLogin ? encodeURIComponent(path.toString()) : undefined;
    const redirectLogin = '/login' + (redirectUrl ? '?redirect=' + redirectUrl : '');

    if (!session.has('accessToken')) {
        if (isLogin) {
            throw new Error('Invalid token');
        }

        throw redirect(redirectLogin);
    }

    const user = await database.user.findFirst({
        where: {
            status: 'ACTIVE',
            sessions: {
                some: {
                    accessToken: session.get('accessToken'),
                },
            },
        },
    });

    if (!user) {
        if (isLogin) {
            throw new Error('Invalid user');
        }

        throw redirect(redirectLogin);
    }

    await database.session.update({
        where: {
            accessToken: session.get('accessToken'),
        },
        data: {
            updatedAt: new Date(),
        },
    });

    return user;
}

export async function authenticate(request: Request): Promise<never> {
    const bcrypt = await import('bcrypt');
    const {
        email,
        password,
    } = await request.json();
    const url = new URL(request.url);
    const redirectUrl = url.searchParams.get('redirect');

    const user = await database.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive',
            },
        },
    });

    if (!user || !user.password || user.status !== 'ACTIVE' || !await bcrypt.compare(password, user.password)) {
        throw json({
            error: 'login.results.invalidCredentials',
        }, {
            status: 400,
        });
    }

    const session = await database.session.create({
        data: {
            user: {
                connect: {
                    id: user.id,
                },
            },
            accessToken: nanoid(64),
        },
    });

    const cookieSession = await getSession(request.headers.get('Cookie'));
    cookieSession.set('accessToken', session.accessToken);

    throw redirect(redirectUrl ?? '/app', {
        headers: {
            'Set-Cookie': await commitSession(cookieSession),
        },
    });
}

export async function logout(request: Request): Promise<Response> {
    const cookieSession = await getSession(request.headers.get('Cookie'));
    cookieSession.unset('accessToken');

    return redirect('/login', {
        headers: {
            'Set-Cookie': await commitSession(cookieSession),
        },
    });
}

export const authenticator = {
    isAuthenticated,
    authenticate,
    logout,
};

export type Authenticator = typeof authenticator;

