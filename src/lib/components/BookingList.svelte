<script>
  import { getMyBookings, cancelBooking } from '../api.ts';
  export let userId;
  let rows = [];
  let loading = true;
  async function load(){
    loading=true;
    rows = await getMyBookings(userId);
    loading=false;
  }
  load();
  async function cancel(id){
    await cancelBooking(userId,id);
    await load();
  }
</script>

{#if loading}
  <p>Loading…</p>
{:else if rows.length===0}
  <p>No bookings yet.</p>
{:else}
  <ul>
    {#each rows as b}
      <li>
        {b.id} — {b.status}
        <button on:click={() => cancel(b.id)}>Cancel</button>
      </li>
    {/each}
  </ul>
{/if}
