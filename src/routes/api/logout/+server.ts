// src/routes/api/logout/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
/**
 * Handles user logout by invalidating the session cookie
 * Reference: SvelteKit Cookies API - Deleting Cookies
 * Source: https://kit.svelte.dev/docs/types#public-types-cookies
 */
export const POST: RequestHandler = async ({ cookies }) => {
  // 删除 session cookie
  cookies.delete('session', { path: '/' });

  return json({
    message: 'Logged out successfully'
  });
};