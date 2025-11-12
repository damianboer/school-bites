import type { Handle } from '@sveltejs/kit';
/**
 * SvelteKit Server Hook for authentication handling
 *
 * Reference: SvelteKit Hooks - handle
 * Source: https://kit.svelte.dev/docs/hooks#server-hooks-handle
 *
 * This hook runs on every request to the server and is used for:
 * - Authentication and session management
 * - Setting user data in event.locals for use in load functions and endpoints
 * - Providing test capabilities during development
 *
 * The handle function receives the request event and must return a Response
 * It can modify the event object before passing it to resolve()
 */
export const handle: Handle = async ({ event, resolve }) => {
  // from cookie get session
  const sessionCookie = event.cookies.get('session');

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie);
      event.locals.user = {
        id: session.userId,
        userType: session.userType,
        username: session.username
      };
    } catch (error) {
      // delete error session cookie
      event.cookies.delete('session', { path: '/' });
    }
  }

  // for ?userId= local test
  const userId = event.url.searchParams.get('userId');
  if (userId && !event.locals.user) {
    event.locals.user = {
      id: userId,
      userType: 'test',
      username: 'test-user'
    };
  }

  return await resolve(event);
};