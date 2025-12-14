import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) throw error(401, { error: 'not_authenticated' });

  const [u] = await db.select().from(users).where(eq(users.id, locals.user.id));
  if (!u) throw error(401, { error: 'invalid_user' });

  return json({
    id: u.id,
    username: u.username,
    userType: u.userType,
    schoolName: u.schoolName,
    validMealPlan: !!u.validMealPlan
  });
};
