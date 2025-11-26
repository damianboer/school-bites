import { pgTable, uuid, text, timestamp, boolean, integer, date, pgEnum, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username').notNull().unique(),
  password: varchar('password').notNull(),
  schoolName: varchar('school_name').notNull(),
  userType: varchar('user_type').notNull().default('user'), // 'admin' 或 'user'
  adminName: varchar('admin_name'), // only for admin
  validMealPlan: boolean('valid_meal_plan').default(false), // only for user
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
export const bookingStatus = pgEnum("booking_status", ['PENDING','CONFIRMED','CANCELLED']);

/*export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  validMealPlan: boolean("valid_meal_plan").notNull().default(false),
});*/

export const mealOptions = pgTable("meal_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  dietaryTags: text("dietary_tags").array().notNull().default([]),
  isAvailable: boolean("is_available").notNull().default(true),
  ingredientCostCents: integer("ingredient_cost_cents").default(0),
});

export const mealSchedule = pgTable("meal_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  serveDate: date("serve_date").notNull(),
  mealOptionId: uuid("meal_option_id").notNull().references(() => mealOptions.id, { onDelete: "cascade" }),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  mealScheduleId: uuid("meal_schedule_id").notNull().references(() => mealSchedule.id, { onDelete: "restrict" }),
  status: bookingStatus("status").notNull().default('PENDING'),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uqUserPerDay: { columns: [t.userId, t.mealScheduleId], unique: true },
}));
