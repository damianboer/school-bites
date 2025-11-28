import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { bookings, users, mealSchedule } from './db/schema.js';
import { eq, and } from 'drizzle-orm';

const app = express();

// --- CORS so frontend (5173) can call backend (3001) ---
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-user-id'],
  })
);

app.use(express.json());

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// ---------- AUTH MIDDLEWARE ----------

type AuthedReq = express.Request & {
  user?: { id: string; role: 'student' | 'admin' };
  _userRecord?: any;
};

const userIdSchema = z.string().uuid();

const requireAuth = async (
  req: AuthedReq,
  res: express.Response,
  next: express.NextFunction
) => {
  const rawId =
    (req.query.userId as string | undefined) ??
    (req.headers['x-user-id'] as string | undefined);

  if (!rawId) {
    return res.status(400).json({ error: 'missing_user_id' });
  }

  const trimmed = rawId.trim();
  let userId: string;

  try {
    userId = userIdSchema.parse(trimmed);
  } catch {
    return res.status(400).json({ error: 'invalid_user_id_format' });
  }

  const rows = await db.select().from(users).where(eq(users.id, userId));
  const u = rows[0];

  if (!u) {
    return res.status(401).json({ error: 'invalid_user' });
  }

  req.user = { id: u.id, role: (u as any).role };
  (req as any)._userRecord = u;
  next();
};

// ---------- SCHEMAS ----------
const createBookingBody = z.object({
  mealScheduleId: z.string().uuid(),
});

// ---------- ROUTES ----------

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Return full user row (includes validMealPlan)
app.get('/api/user', requireAuth, async (req: AuthedReq, res) => {
  const u = (req as any)._userRecord;
  res.json(u);
});

// Get all bookings for current user
app.get('/api/bookings', requireAuth, async (req: AuthedReq, res) => {
  const mine = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, req.user!.id));

  res.json(mine);
});

// Create booking
app.post('/api/bookings', requireAuth, async (req: AuthedReq, res) => {
  const parsed = createBookingBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'bad_request',
      details: parsed.error.flatten(),
    });
  }

  const u = (req as any)._userRecord as {
    validMealPlan: boolean;
    role: string;
    id: string;
  };

  if (u.role !== 'student') {
    return res.status(403).json({ error: 'only_students_can_book' });
  }
  if (!u.validMealPlan) {
    return res.status(403).json({ error: 'meal_plan_not_validated' });
  }

  const msRows = await db
    .select()
    .from(mealSchedule)
    .where(eq(mealSchedule.id, parsed.data.mealScheduleId));
  const ms = msRows[0];

  if (!ms) {
    return res.status(404).json({ error: 'schedule_not_found' });
  }

  try {
    const inserted = await db
      .insert(bookings)
      .values({ userId: u.id, mealScheduleId: parsed.data.mealScheduleId })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (e: any) {
    if (e.code === '23505') {
      return res.status(409).json({ error: 'already_booked_this_day' });
    }
    console.error(e);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Cancel booking
app.delete('/api/bookings/:id', requireAuth, async (req: AuthedReq, res) => {
  await db
    .delete(bookings)
    .where(
      and(eq(bookings.id, req.params.id), eq(bookings.userId, req.user!.id))
    );

  res.status(204).end();
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Booking service listening on :${port}`));
