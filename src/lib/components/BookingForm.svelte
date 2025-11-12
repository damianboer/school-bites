<script>
  import { createBooking } from '../api.ts';
  export let userId;
  export let validMealPlan;
  export let todaysSchedules = []; // [{ id, serve_date, meal_name }]
  let selectedSchedule = '';
  let message = '';
  async function submit() {
    message='';
    try {
      await createBooking(userId, selectedSchedule);
      message='Booked!';
      selectedSchedule='';
      const ev = new CustomEvent('booked');
      dispatchEvent(ev);
    } catch (e) {
      message = e.error ?? 'Error';
    }
  }
</script>

{#if !validMealPlan}
  <p class="warn">Your meal plan has not been validated yet. You cannot book until an admin validates it.</p>
{:else}
  <label>
    Choose a meal/date
    <select bind:value={selectedSchedule}>
      <option value="" disabled>Select…</option>
      {#each todaysSchedules as s}
        <option value={s.id}>{s.serve_date} — {s.meal_name}</option>
      {/each}
    </select>
  </label>
  <button on:click|preventDefault={submit} disabled={!selectedSchedule}>Book</button>
  {#if message}<p>{message}</p>{/if}
{/if}
