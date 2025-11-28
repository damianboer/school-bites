const API = "http://localhost:3001";

export async function getMyBookings(userId: string) {
    const r = await fetch(`${API}/api/bookings?userId=${userId}`);
    if (!r.ok) throw await r.json();
    return r.json();
}

export async function createBooking(userId: string, mealScheduleId: string) {
    const r = await fetch(`${API}/api/bookings?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealScheduleId })
    });
    if (!r.ok) throw await r.json();
    return r.json();
}

export async function cancelBooking(userId: string, id: string) {
    const r = await fetch(`${API}/api/bookings/${id}?userId=${userId}`, {
        method: "DELETE"
    });
    if (!r.ok && r.status !== 204) throw await r.json();
    return true;
}

export async function getHealth() {
    const r = await fetch(`${API}/api/health`);
    return r.json();
}
