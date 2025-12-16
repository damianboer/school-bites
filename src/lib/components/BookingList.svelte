<script lang="ts">
  import { onMount } from 'svelte';
  import { getMyBookings, cancelBooking } from '../api';

  type Booking = {
    id: string;
    status: string;
  };

  let rows: Booking[] = [];
  let loading = true;
  let errorMessage = '';

  async function load() {
    loading = true;
    errorMessage = '';

    try {
      rows = await getMyBookings();
    } catch (e: any) {
      console.error(e);
      errorMessage = e?.error ?? 'Failed to load bookings';
    } finally {
      loading = false;
    }
  }

  onMount(load);

  async function cancel(id: string) {
    try {
      await cancelBooking(id);
      await load();
    } catch (e: any) {
      console.error(e);
      errorMessage = e?.error ?? 'Failed to cancel booking';
    }
  }
</script>

{#if loading}
  <p>Loading…</p>
{:else if errorMessage}
  <p class="error">{errorMessage}</p>
{:else if rows.length === 0}
  <p>No bookings yet.</p>
{:else}
  <ul>
    {#each rows as b}
      <li>
        {b.id} — {b.status}
        <button type="button" on:click={() => cancel(b.id)}>Cancel</button>
      </li>
    {/each}
  </ul>
{/if}
