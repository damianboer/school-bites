import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { mealSchedule } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const scheduleUpdateSchema = z.object({
  serveDate: z.string().optional(),
  mealOptionId: z.string().uuid().optional()
});

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params.id;
  const body = await request.json();
  const parsed = scheduleUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { error: 'bad_request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(mealSchedule)
    .set(parsed.data)
    .where(eq(mealSchedule.id, id))
    .returning();

  if (!updated) {
    return json({ error: 'not_found' }, { status: 404 });
  }

  return json(updated);
};

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id;

  const [deleted] = await db
    .delete(mealSchedule)
    .where(eq(mealSchedule.id, id))
    .returning();

  if (!deleted) {
    return json({ error: 'not_found' }, { status: 404 });
  }

  return json({ ok: true });
};
