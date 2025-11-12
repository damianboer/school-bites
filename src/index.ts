import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import {users, mealOptions, mealSchedule, bookings} from "./lib/server/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const user: typeof users.$inferInsert = {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'user@example.com',
        role: 'student',
        validMealPlan: true,
    };
    await db.insert(users).values(user);

    const mealOption: typeof mealOptions.$inferInsert = {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Chicken Salad',
        description: 'A healthy chicken salad with mixed greens.',
        priceCents: 1299,
        dietaryTags: ['gluten-free'],
        isAvailable: true,
        ingredientCostCents: 700,
    };
    await db.insert(mealOptions).values(mealOption);

    const mealoption2: typeof mealOptions.$inferInsert = {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Vegan Wrap',
        description: 'A delicious vegan wrap with fresh vegetables.',
        priceCents: 1099,
        dietaryTags: ['vegan'],
        isAvailable: true,
        ingredientCostCents: 600,
    };
    await db.insert(mealOptions).values(mealoption2);

    const mealSch: typeof mealSchedule.$inferInsert = {
        id: '33333333-3333-3333-3333-333333333333',
        serveDate: '2024-07-01',
        mealOptionId: mealOption.id,
    };
    await db.insert(mealSchedule).values(mealSch);
}

main();