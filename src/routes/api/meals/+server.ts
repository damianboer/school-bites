import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { mealOptions } from '$lib/server/db/schema';

const mealOptionSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  priceCents: z.number().int().nonnegative(),
  dietaryTags: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
  ingredientCostCents: z.number().int().nonnegative().default(0)
});

export const GET: RequestHandler = async () => {
  const all = await db.select().from(mealOptions);
  return json(all);
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = mealOptionSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { error: 'bad_request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(mealOptions)
    .values(parsed.data)
    .returning();

  return json(created, { status: 201 });
};
