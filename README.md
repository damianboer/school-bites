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
This starts a local Postgres at `localhost:5432` with DB `schoolbites` and loads schema + seed automatically.

### 2) Install & run API
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
The API runs at `http://localhost:3001`.

### 3) Try it (cURL)
```bash
# Create booking for seeded student on today's Chicken schedule
curl -X POST "http://localhost:3001/api/bookings?userId=00000000-0000-0000-0000-000000000001"   -H "Content-Type: application/json"   -d '{"mealScheduleId":"aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1"}'

# Duplicate same day -> 409 already_booked_this_day
```

### 4) Svelte snippets
Use files in `web/snippets` (BookingForm.svelte, BookingList.svelte, api.ts).  
Wire them into your app’s route/page and pass `userId` and `validMealPlan` from your auth context.

## Project layout
```
schoolbites-booking/
├─ server/
│  ├─ src/
│  │  ├─ db/
│  │  │  └─ schema.ts
│  │  └─ index.ts
│  ├─ migrations/
│  │  ├─ schema.sql
│  │  └─ seed.sql
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ docker-compose.yml  (in repo root)
└─ web/
   └─ snippets/
      ├─ api.ts
      ├─ BookingForm.svelte
      └─ BookingList.svelte
```

## Environment

Create `.env` in `server/`:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/schoolbites
PORT=3001
```

## Notes for teammates

- **Auth (Person 3 – Michael):** ensure `users` table includes `valid_meal_plan BOOLEAN` and attach user id to requests (cookie/header). Current server also accepts `?userId=` for local testing.
- **Menus (Person 2 – Madalyn):** own CRUD for `meal_options` & `meal_schedule`. Booking service reads `meal_schedule` only.
- **Tech Lead (Person 1 – Damian):** proxy `/api` from the web app to `localhost:3001`. Add deployment steps to the group README/ZIP.

## License
For course use.
