// server/src/seedStudent.ts
import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from './db/schema.js';
import { eq } from 'drizzle-orm';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
  const email = 'student@example.com';
  const role = 'student';

  // If user already exists -> just mark meal plan as valid
  const existing = await db.select().from(users).where(eq(users.email, email));
  let user;

  if (existing[0]) {
    const updated = await db
      .update(users)
      .set({ validMealPlan: true })
      .where(eq(users.email, email))
      .returning();
    user = updated[0];
  } else {
    const inserted = await db
      .insert(users)
      .values({
        email,
        role,
        validMealPlan: true
      })
      .returning();
    user = inserted[0];
  }

  console.log('✅ Seeded student:');
  console.log('  email:', user.email);
  console.log('  id   :', user.id); // <- copy this for the frontend

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});