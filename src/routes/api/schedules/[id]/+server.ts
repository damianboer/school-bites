
import { db } from '$lib/server/db';
import { mealSchedule } from '$lib/server/db/schema';

import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function DELETE({ params }) {
  const id = params.id;

  await db
    .delete(mealSchedule)
    .where(eq(mealSchedule.id, id));

  return json({ ok: true });
}

export async function PUT({ params, request }) {
  const data = await request.json();

  await db.update(mealSchedule).set(data).where(eq(mealSchedule.id, params.id));

  return json({ ok: true });
}