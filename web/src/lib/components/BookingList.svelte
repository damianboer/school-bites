<script lang="ts">
  import type { Booking } from '$lib/types';

  export let bookings: Booking[] = [];
</script>

{#if bookings.length === 0}
  <p>No bookings yet.</p>
{:else}
  <ul>
    {#each bookings as b}
      <li>
        {b.id} — {b.mealScheduleId}
      </li>
    {/each}
  </ul>
{/if}