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

export async function getMealOptions() {
  const res = await fetch("/api/meals");
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createMealOption(data) {
  const res = await fetch("/api/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function updateMealOption(id, data) {
  const res = await fetch(`/api/meals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteMealOption(id) {
  const res = await fetch(`/api/meals/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getAllSchedules() {
  const res = await fetch("/api/schedules");
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function createSchedule(data) {
  const res = await fetch("/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function updateSchedule(id, data) {
  const res = await fetch(`/api/schedules/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function deleteSchedule(id) {
  const res = await fetch(`/api/schedules/${id}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}