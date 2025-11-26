import { json } from "@sveltejs/kit";
import { db } from '$lib/server/db';
import { mealOptions } from '$lib/server/db/schema';

export async function GET() {
  const rows = await db.select().from(mealOptions);
  return json(rows);
}

export async function POST({ request }) {
  const data = await request.json();

  await db.insert(mealOptions).values(data);

  return json({ ok: true });
}