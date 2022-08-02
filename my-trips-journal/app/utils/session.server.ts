import bcrypt from 'bcrypt';
import { db } from '~/utils/db.server';
import { redirect, createCookieSessionStorage } from '@remix-run/node';

export async function register({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const passwordHash = await bcrypt.hash(password, 10);

  return db.user.create({ data: { username, passwordHash } });
}

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));

  return redirect('/auth/logout', {
    headers: { 'Set-Cookie': await storage.destroySession(session) },
  });
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('No session secret');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'tripsjournal_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();

  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await storage.commitSession(session) },
  });
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });

    return user;
  } catch (error) {
    return null;
  }
}
