const API = "http://localhost:3001";

export async function getMyBookings(userId: string) {
  try {
    const r = await fetch(`${API}/api/bookings?userId=${userId}`);
    // If backend says “not ok”, just log and return empty array
    if (!r.ok) {
      console.error("getMyBookings failed:", r.status, await r.text());
      return [];
    }
    return await r.json();
  } catch (err) {
    console.error("getMyBookings network error:", err);
    return [];
  }
}

export async function createBooking(userId: string, mealScheduleId: string) {
  const r = await fetch(`${API}/api/bookings?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mealScheduleId })
  });

  if (!r.ok) {
    // surface an error *only when user actually clicks Book*
    const body = await r.text();
    throw new Error(`createBooking failed: ${r.status} ${body}`);
  }

  return await r.json();
}

export async function cancelBooking(userId: string, id: string) {
  const r = await fetch(`${API}/api/bookings/${id}?userId=${userId}`, {
    method: "DELETE"
  });

  if (!r.ok && r.status !== 204) {
    const body = await r.text();
    throw new Error(`cancelBooking failed: ${r.status} ${body}`);
  }

  return true;
}

export async function getHealth() {
  const r = await fetch(`${API}/api/health`);
  return r.json();
}