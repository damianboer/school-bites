import { json } from "@sveltejs/kit";
import { db } from '$lib/server/db';
import { mealOptions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE({ params }) {
  const id = params.id;

  await db
    .delete(mealOptions)
    .where(eq(mealOptions.id, id));

  return json({ ok: true });
}

export async function PUT({ params, request }) {
  const data = await request.json();

  await db.update(mealOptions).set(data).where(eq(mealOptions.id, params.id));

  return json({ ok: true });
}