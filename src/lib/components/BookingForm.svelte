<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { createBooking, getAllSchedules } from '$lib/api';

  const dispatch = createEventDispatcher();

  export let validMealPlan: boolean = false;

  let todaysSchedules: { id: string; serveDate: string; mealName: string }[] = [];

  let selectedSchedule = '';
  let message = '';
  let submitting = false;

  function todayLocalYYYYMMDD() {
    return new Date().toLocaleDateString('en-CA');
  }

  async function loadTodaysSchedules() {
    const all = await getAllSchedules();
    const today = todayLocalYYYYMMDD();
    todaysSchedules = all.filter((s: any) => s.serveDate === today);
    console.log('schedules from api:', all);
  }

  onMount(async () => {
    if (validMealPlan) {
      await loadTodaysSchedules();
    }
  });

  async function submit() {
    if (!selectedSchedule) return;

    message = '';
    submitting = true;

    try {
      await createBooking(selectedSchedule);
      message = 'Booked!';
      selectedSchedule = '';
      dispatch('booked');
      await loadTodaysSchedules();
    } catch (e: any) {
      message = e?.error ?? 'Error';
    } finally {
      submitting = false;
    }
  }
</script>

<p>Schedules available: {todaysSchedules.length}</p>

{#if !validMealPlan}
  <p class="warn">
    Your meal plan has not been validated yet. You cannot book until an admin validates it.
  </p>
{:else}
  <form on:submit|preventDefault={submit}>
    <label>
      Choose a meal/date
      <select bind:value={selectedSchedule}>
        <option value="" disabled>Select…</option>
        {#each todaysSchedules as s}
          <option value={s.id}>{s.serveDate} — {s.mealName}</option>
        {/each}
      </select>
    </label>

    <button type="submit" disabled={!selectedSchedule || submitting}>
      {#if submitting}Booking…{:else}Book{/if}
    </button>

    {#if message}
      <p>{message}</p>
    {/if}
  </form>
{/if}
