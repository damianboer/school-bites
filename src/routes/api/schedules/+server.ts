// src/routes/api/schedules/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { mealSchedule, mealOptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const scheduleSchema = z.object({
  serveDate: z.string(),        
  mealOptionId: z.string().uuid()
});

export const GET: RequestHandler = async () => {
  const rows = await db
    .select({
      id: mealSchedule.id,
      serveDate: mealSchedule.serveDate,
      mealOptionId: mealSchedule.mealOptionId,
      mealName: mealOptions.name
    })
    .from(mealSchedule)
    .leftJoin(mealOptions, eq(mealSchedule.mealOptionId, mealOptions.id));

  return json(rows);
};


export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = scheduleSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { error: 'bad_request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(mealSchedule)
    .values(parsed.data)
    .returning();

  return json(created, { status: 201 });
};
