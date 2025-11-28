# SchoolBites – Student Booking System (Updated)

This README describes the latest updates made to the Student Booking System backend and frontend.

============================================================
🚀 LATEST FEATURES & FIXES
============================================================

==============================
✅ Backend (Node.js + Express + Drizzle)
==============================
• Added /api/user endpoint returning:
  - id
  - email
  - role
  - validMealPlan

• Improved validation using Zod for userId.
• Booking creation now correctly checks:
  - User exists
  - Meal schedule exists
  - User has a validated meal plan
  - Role is student
  - Duplicate booking prevented

• Improved error codes (400, 401, 403, 404, 409).
• Fixed CORS issues to allow frontend → backend communication.

==============================
✅ Frontend (SvelteKit)
==============================

-------- +page.ts --------
• Loads:
  - user profile (validMealPlan)
  - bookings list
• Returns:
  { userId, validMealPlan, bookings }

-------- +page.svelte --------
• Receives "data" using:
  export let data;
  const { userId, validMealPlan, bookings } = data;

• Passes props into components:
  <BookingForm {userId} {validMealPlan} />
  <BookingList {bookings} />

-------- BookingForm.svelte --------
• Prevents booking if validMealPlan === false
• Uses event dispatch to refresh page after booking
• Dropdown to choose meal schedule
• Error/success message shown correctly

-------- BookingList.svelte --------
• Accepts `bookings` as a prop
• Displays booking list
• Supports booking cancellation

============================================================
🗂 PROJECT STRUCTURE
============================================================

schoolbites-booking/
 ├── server/               (# Express backend)
 ├── web/                  (# SvelteKit frontend)
 ├── docker-compose.yml
 ├── drizzle.config.js
 ├── README.md (this file)
 └── package.json

============================================================
▶️ HOW TO RUN THE PROJECT
============================================================

BACKEND:
-------------------------------------
cd server
npm install
npm run dev

FRONTEND:
-------------------------------------
cd web
npm install
npm run dev

ACCESS:
-------------------------------------
Frontend:  http://localhost:5173
Backend:   http://localhost:3001

============================================================
🧪 TESTING INSTRUCTIONS
============================================================

1. Open:
   http://localhost:5173/?userId=<uuid>

EXPECTED:
-------------------------------------
• If validMealPlan = false → booking disabled
• If validMealPlan = true → booking allowed

2. Test APIs manually:

GET user:
http://localhost:3001/api/user?userId=<uuid>

GET bookings:
http://localhost:3001/api/bookings?userId=<uuid>

