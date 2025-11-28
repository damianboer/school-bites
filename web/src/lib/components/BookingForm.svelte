<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { createBooking } from '$lib/api'; // uses web/src/lib/api/api.ts

  export let userId: string;
  export let validMealPlan: boolean;
  export let todaysSchedules: { id: string; serve_date: string; meal_name: string }[] = [];

  const dispatch = createEventDispatcher<{ booked: void }>();

  let selectedSchedule = '';
  let message = '';

  async function submit() {
    message = '';
    try {
      await createBooking(userId, selectedSchedule);
      message = 'Booked!';
      selectedSchedule = '';
      // notify parent so it can refresh the list
      dispatch('booked');
    } catch (e: any) {
      console.error(e);
      message = e?.error ?? 'Error';
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
