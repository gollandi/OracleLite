import { cookies } from 'next/headers';

const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'admin123';
const AUTH_COOKIE_NAME = 'owner_authenticated';

export function checkOwnerAuth(): boolean {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    return authCookie?.value === 'true';
  } catch {
    return false;
  }
}

export function verifyOwnerPassword(password: string): boolean {
  return password === OWNER_PASSWORD;
}
