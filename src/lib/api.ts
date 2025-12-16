async function handleJson(res: Response) {
  if (!res.ok) {
    try {
      const data = await res.json();
      throw data;
    } catch {
      throw new Error(await res.text());
    }
  }
  if (res.status === 204) return null;
  return res.json();
}

/* -------------------------------------------------------------------------- */
/*                                BOOKINGS                                    */
/* -------------------------------------------------------------------------- */

export async function getMyBookings() {
  const res = await fetch('/api/bookings');
  return handleJson(res);
}

export async function createBooking(mealScheduleId: string) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealScheduleId })
  });
  return handleJson(res);
}

export async function cancelBooking(id: string) {
  const res = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE'
  });
  return handleJson(res);
}

/* -------------------------------------------------------------------------- */
/*                                MEAL OPTIONS                                */
/* -------------------------------------------------------------------------- */

export async function getMealOptions() {
  const res = await fetch('/api/meals');
  return handleJson(res);
}

export async function createMealOption(data: unknown) {
  const res = await fetch('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleJson(res);
}

export async function updateMealOption(id: string, data: unknown) {
  const res = await fetch(`/api/meals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleJson(res);
}

export async function deleteMealOption(id: string) {
  const res = await fetch(`/api/meals/${id}`, {
    method: 'DELETE'
  });
  return handleJson(res);
}

/* -------------------------------------------------------------------------- */
/*                                 SCHEDULES                                  */
/* -------------------------------------------------------------------------- */

export async function getAllSchedules() {
  const res = await fetch('/api/schedules');
  return handleJson(res);
}

export async function createSchedule(data: unknown) {
  const res = await fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleJson(res);
}

export async function updateSchedule(id: string, data: unknown) {
  const res = await fetch(`/api/schedules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleJson(res);
}

export async function deleteSchedule(id: string) {
  const res = await fetch(`/api/schedules/${id}`, {
    method: 'DELETE'
  });
  return handleJson(res);
}
