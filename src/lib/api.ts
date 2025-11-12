export async function getMyBookings(userId) {
  const r = await fetch(`/api/bookings?userId=${userId}`);
  if (!r.ok) throw await r.json();
  return r.json();
}
export async function createBooking(userId, mealScheduleId) {
  const r = await fetch(`/api/bookings?userId=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealScheduleId })
  });
  if (!r.ok) throw await r.json();
  return r.json();
}
export async function cancelBooking(userId, id) {
  const r = await fetch(`/api/bookings/${id}?userId=${userId}`, { method: 'DELETE' });
  if (!r.ok && r.status !== 204) throw await r.json();
}
