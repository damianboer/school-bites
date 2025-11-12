# SchoolBites – Student Booking Service (Aquila)

This package is your **Demo 3** deliverable for **Student Booking System**. It includes:
- PostgreSQL schema + seed
- TypeScript Express API using **Drizzle ORM**
- Svelte UI snippets (drop-in) for Booking form & list
- Docker Compose for Postgres

It enforces the **Demo 2** rules:
- Only **validated students** can book (`users.valid_meal_plan = true`).
- **One booking per user per day** (unique constraint via `bookings (user_id, meal_schedule_id)`).

> Matches your design document decisions (valid meal plan; `meal_schedule` as date↔meal; one-per-day).

## Quick start

### 0) Requirements
- Node 20+
- Docker & Docker Compose

### 1) Start Postgres
```bash
docker compose up -d
```
Following that to seed the database run
```bash
npx drizzle-kit push 
npx tsx src/index.ts
```

This starts a local Postgres at `localhost:5432` with DB `schoolbites`

## Notes for teammates

- **Auth (Person 3 – Michael):** ensure `users` table includes `valid_meal_plan BOOLEAN` and attach user id to requests (cookie/header). Current server also accepts `?userId=` for local testing.
- **Menus (Person 2 – Madalyn):** own CRUD for `meal_options` & `meal_schedule`. Booking service reads `meal_schedule` only.
- **Tech Lead (Person 1 – Damian):** proxy `/api` from the web app to `localhost:3001`. Add deployment steps to the group README/ZIP.

## License
For course use.
