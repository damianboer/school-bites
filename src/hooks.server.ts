import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const raw = event.cookies.get('session');
  event.locals.user = undefined;

  if (raw) {
    try {
      const s = JSON.parse(raw);

      if (s?.id && s?.username && s?.userType) {
        event.locals.user = {
          id: s.id,
          username: s.username,
          userType: s.userType
        };
      }
    } catch {
      event.cookies.delete('session', { path: '/' });
    }
  }

  const { pathname } = event.url;

  const publicRoutes = ['/login', '/register'];

  const isPublic = publicRoutes.some((p) => pathname.startsWith(p));

  if (!event.locals.user && !isPublic) {
    throw redirect(302, '/login');
  }

  return resolve(event);
};
