// src/routes/+page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
  const userId = (url.searchParams.get('userId') ?? '').trim();

  let validMealPlan = false;
  let bookings: any[] = [];

  if (userId) {
    // 1) Get user (includes validMealPlan)
    try {
      const r = await fetch(
        `http://localhost:3001/api/user?userId=${encodeURIComponent(userId)}`
      );

      if (r.ok) {
        const user = await r.json();
        // ✅ use the value exactly as stored in DB
        validMealPlan = !!user.validMealPlan;
      } else {
        console.error('GET /api/user failed with status', r.status);
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    }

    // 2) Get bookings for that user
    try {
      const b = await fetch(
        `http://localhost:3001/api/bookings?userId=${encodeURIComponent(userId)}`
      );

      if (b.ok) {
        bookings = await b.json();
      } else {
        console.error('GET /api/bookings failed with status', b.status);
      }
    } catch (e) {
      console.error('Error fetching bookings:', e);
    }
  }

  return {
    userId,
    validMealPlan,
    bookings
  };
};