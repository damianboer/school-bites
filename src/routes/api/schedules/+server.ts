
import { db } from '$lib/server/db';
import { mealSchedule, mealOptions, bookings } from '$lib/server/db/schema';

import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select({
      id: mealSchedule.id,
      serveDate: mealSchedule.serveDate,
      mealName: mealOptions.name,
      bookingCount: sql`COUNT(${bookings.id})`
    })
    .from(mealSchedule)
    .leftJoin(mealOptions, eq(mealSchedule.mealOptionId, mealOptions.id))
    .leftJoin(bookings, eq(bookings.mealScheduleId, mealSchedule.id))
    .groupBy(mealSchedule.id, mealOptions.name);

  return json(rows);
}

export async function POST({ request }) {
  const { mealOptionId, serveDate } = await request.json();

  await db.insert(mealSchedule).values({
    mealOptionId,
    serveDate: serveDate
  });

  return json({ ok: true });
}
