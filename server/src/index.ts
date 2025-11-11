import 'dotenv/config';
import express from "express";
import { z } from "zod";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { bookings, users, mealSchedule } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

const app = express();
app.use(express.json());

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// Fake auth middleware for local dev. Replace with real session/JWT.
type AuthedReq = express.Request & { user?: { id: string; role: 'student'|'admin' }; _userRecord?: any };
const requireAuth = async (req: AuthedReq, res: express.Response, next: express.NextFunction) => {
  const userId = (req.query.userId as string) || (req.headers["x-user-id"] as string);
  if (!userId) return res.status(401).json({ error: "not_authenticated" });
  const rows = await db.select().from(users).where(eq(users.id, userId));
  const u = rows[0];
  if (!u) return res.status(401).json({ error: "invalid_user" });
  req.user = { id: u.id, role: (u as any).role };
  (req as any)._userRecord = u;
  next();
};

const createBookingBody = z.object({ mealScheduleId: z.string().uuid() });

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/bookings", requireAuth, async (req: AuthedReq, res) => {
  const mine = await db.select().from(bookings).where(eq(bookings.userId, req.user!.id));
  res.json(mine);
});

app.post("/api/bookings", requireAuth, async (req: AuthedReq, res) => {
  const parsed = createBookingBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "bad_request", details: parsed.error.flatten() });

  const u = (req as any)._userRecord as { validMealPlan: boolean; role: string; id: string };
  if (u.role !== "student") return res.status(403).json({ error: "only_students_can_book" });
  if (!u.validMealPlan) return res.status(403).json({ error: "meal_plan_not_validated" });

  const msRows = await db.select().from(mealSchedule).where(eq(mealSchedule.id, parsed.data.mealScheduleId));
  const ms = msRows[0];
  if (!ms) return res.status(404).json({ error: "schedule_not_found" });

  try {
    const inserted = await db.insert(bookings).values({ userId: u.id, mealScheduleId: parsed.data.mealScheduleId }).returning();
    res.status(201).json(inserted[0]);
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: "already_booked_this_day" });
    console.error(e);
    res.status(500).json({ error: "internal_error" });
  }
});

app.delete("/api/bookings/:id", requireAuth, async (req: AuthedReq, res) => {
  await db.delete(bookings).where(and(eq(bookings.id, req.params.id), eq(bookings.userId, req.user!.id)));
  res.status(204).end();
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Booking service listening on :${port}`));
