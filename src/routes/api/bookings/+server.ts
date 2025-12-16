import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { bookings, mealSchedule, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const createBookingBody = z.object({
  mealScheduleId: z.string().uuid()
});

function requireAuth(locals: App.Locals) {
  const user = locals.user;
  if (!user) {
    throw error(401, { error: 'not_authenticated' });
  }
  return user;
}

export const GET: RequestHandler = async ({ locals }) => {
  const user = requireAuth(locals);

  const mine = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, user.id));

  return json(mine);
};

export const POST: RequestHandler = async ({ locals, request }) => {
  const user = requireAuth(locals);

  const body = await request.json();
  const parsed = createBookingBody.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        error: 'bad_request',
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const [u] = await db.select().from(users).where(eq(users.id, user.id));
  if (!u) {
    throw error(401, { error: 'invalid_user' });
  }


  if (u.userType !== 'user') {
    return json(
      { error: 'only_students_can_book' },
      { status: 403 }
    );
  }

  if (!u.validMealPlan) {
    return json(
      { error: 'meal_plan_not_validated' },
      { status: 403 }
    );
  }

  const [ms] = await db
    .select()
    .from(mealSchedule)
    .where(eq(mealSchedule.id, parsed.data.mealScheduleId));

  if (!ms) {
    return json(
      { error: 'schedule_not_found' },
      { status: 404 }
    );
  }

  try {
    const [inserted] = await db
      .insert(bookings)
      .values({
        userId: u.id,
        mealScheduleId: parsed.data.mealScheduleId
      })
      .returning();

    return json(inserted, { status: 201 });
  } catch (e: any) {
    if (e?.code === '23505') {
      return json(
        { error: 'already_booked_this_day' },
        { status: 409 }
      );
    }

    console.error(e);
    return json(
      { error: 'internal_error' },
      { status: 500 }
    );
  }
};
