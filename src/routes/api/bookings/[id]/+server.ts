import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { bookings } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

function requireAuth(locals: App.Locals) {
  const user = locals.user;
  if (!user) {
    throw error(401, { error: 'not_authenticated' });
  }
  return user;
}

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const user = requireAuth(locals);
  const id = params.id;

  await db
    .delete(bookings)
    .where(
      and(
        eq(bookings.id, id),
        eq(bookings.userId, user.id)
      )
    );

  return new Response(null, { status: 204 });
};
