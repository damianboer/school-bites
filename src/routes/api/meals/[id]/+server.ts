import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { mealOptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const mealOptionUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().nonnegative().optional(),
  dietaryTags: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  ingredientCostCents: z.number().int().nonnegative().optional()
});

export const PUT: RequestHandler = async ({ params, request }) => {
  const id = params.id;
  const body = await request.json();
  const parsed = mealOptionUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { error: 'bad_request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(mealOptions)
    .set(parsed.data)
    .where(eq(mealOptions.id, id))
    .returning();

  if (!updated) {
    return json({ error: 'not_found' }, { status: 404 });
  }

  return json(updated);
};

export const DELETE: RequestHandler = async ({ params }) => {
  const id = params.id;

  const [deleted] = await db
    .delete(mealOptions)
    .where(eq(mealOptions.id, id))
    .returning();

  if (!deleted) {
    return json({ error: 'not_found' }, { status: 404 });
  }

  return json({ ok: true });
};
