<script lang="ts">
  import { onMount } from "svelte";

  import {
    getAllSchedules,
    getMealOptions,
    createSchedule,
    updateSchedule,
    deleteSchedule,

    createMealOption,

    updateMealOption,

    deleteMealOption
  } from "../../lib/api";

  let schedules = [];
  let mealOptions = [];
  let loading = true;

  let selectedOption = "";
  let selectedDate = "";

  let editingMeal: any = null;
  let newMeal = {
    name: "",
    description: "",
    priceCents: 0,
    dietaryTags: "",
    ingredientCostCents: 0,
    isAvailable: true
  };

  let editingSchedule: any = null;

  const money = (cents: number) =>
    (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

  type MealStat = {
    mealOptionId: string;
    name: string;
    bookings: number;
    revenueCents: number;
    costCents: number;
    profitCents: number;
  };

  $: mealById = new Map(mealOptions.map((m) => [m.id, m]));

  $: mealStats = (() => {
    const map = new Map<string, MealStat>();

    for (const s of schedules) {
      const mealId = s.mealOptionId;
      if (!mealId) continue;

      const meal = mealById.get(mealId);
      const name = s.mealName ?? meal?.name ?? "Unknown meal";

      const bookings = Number(s.bookingCount ?? 0);

      const priceCents = Number(meal?.priceCents ?? 0);
      const ingredientCostCents = Number(meal?.ingredientCostCents ?? 0);

      const revenueCents = priceCents * bookings;
      const costCents = ingredientCostCents * bookings;
      const profitCents = revenueCents - costCents;

      const prev = map.get(mealId);
      if (prev) {
        prev.bookings += bookings;
        prev.revenueCents += revenueCents;
        prev.costCents += costCents;
        prev.profitCents += profitCents;
      } else {
        map.set(mealId, {
          mealOptionId: mealId,
          name,
          bookings,
          revenueCents,
          costCents,
          profitCents
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.bookings - a.bookings);
  })();

  $: totals = mealStats.reduce(
    (acc, m) => {
      acc.bookings += m.bookings;
      acc.revenueCents += m.revenueCents;
      acc.costCents += m.costCents;
      acc.profitCents += m.profitCents;
      return acc;
    },
    { bookings: 0, revenueCents: 0, costCents: 0, profitCents: 0 }
  );

  $: profitMargin = totals.revenueCents > 0 ? totals.profitCents / totals.revenueCents : 0;

  $: mostPopularMeal = mealStats[0] ?? null;

  $: mostProfitableMeal = (() => {
    if (mealStats.length === 0) return null;
    return [...mealStats].sort((a, b) => b.profitCents - a.profitCents)[0];
  })();

  async function load() {
    loading = true;
    mealOptions = await getMealOptions();
    schedules = await getAllSchedules();
    loading = false;
  }

  async function addSchedule() {
    if (!selectedOption || !selectedDate) return alert("Missing fields");
    await createSchedule({
      mealOptionId: selectedOption,
      serveDate: selectedDate
    });
    selectedOption = "";
    selectedDate = "";
    await load();
  }

  async function addMeal() {
    if (!newMeal.name) return alert("Meal must have a name");

    const payload = {
      name: newMeal.name,
      description: newMeal.description,
      priceCents: Number(newMeal.priceCents),
      ingredientCostCents: Number(newMeal.ingredientCostCents),
      dietaryTags: newMeal.dietaryTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isAvailable: newMeal.isAvailable
    };

    await createMealOption(payload);

    newMeal = {
      name: "",
      description: "",
      priceCents: 0,
      dietaryTags: "",
      ingredientCostCents: 0,
      isAvailable: true
    };

    await load();
  }

  async function saveMealChanges() {
    const payload = {
      name: editingMeal.name,
      description: editingMeal.description,
      priceCents: Number(editingMeal.priceCents),
      ingredientCostCents: Number(editingMeal.ingredientCostCents),
      dietaryTags: editingMeal.dietaryTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isAvailable: editingMeal.isAvailable
    };

    await updateMealOption(editingMeal.id, payload);
    editingMeal = null;
    await load();
  }

  async function removeMeal(id: string) {
    if (!confirm("Delete this meal?")) return;
    await deleteMealOption(id);
    await load();
  }

  async function saveScheduleChanges() {
    await updateSchedule(editingSchedule.id, {
      serveDate: editingSchedule.serveDate,
      mealOptionId: editingSchedule.mealOptionId
    });

    editingSchedule = null;
    await load();
  }

  async function removeSchedule(id: string) {
    if (!confirm("Delete this schedule?")) return;
    await deleteSchedule(id);
    await load();
  }

  onMount(load);
</script>

<h1 class="text-3xl font-bold mb-4">Admin Dashboard</h1>

{#if loading}
  <p>Loading…</p>
{:else}
  <h2 class="text-xl font-semibold mb-2 mt-4">Statistics</h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="p-4 border rounded">
      <div class="text-sm opacity-70">Total Bookings</div>
      <div class="text-2xl font-bold">{totals.bookings}</div>
    </div>

    <div class="p-4 border rounded">
      <div class="text-sm opacity-70">Revenue</div>
      <div class="text-2xl font-bold">{money(totals.revenueCents)}</div>
      <div class="text-sm opacity-70 mt-1">Ingredient Cost: {money(totals.costCents)}</div>
    </div>

    <div class="p-4 border rounded">
      <div class="text-sm opacity-70">Profit</div>
      <div class="text-2xl font-bold">{money(totals.profitCents)}</div>
      <div class="text-sm opacity-70 mt-1">Margin: {(profitMargin * 100).toFixed(1)}%</div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div class="p-4 border rounded">
      <div class="text-sm opacity-70">Most Popular Meal</div>
      {#if mostPopularMeal}
        <div class="text-lg font-semibold">{mostPopularMeal.name}</div>
        <div class="text-sm">Bookings: {mostPopularMeal.bookings}</div>
      {:else}
        <div class="text-sm">No data yet.</div>
      {/if}
    </div>

    <div class="p-4 border rounded">
      <div class="text-sm opacity-70">Most Profitable Meal</div>
      {#if mostProfitableMeal}
        <div class="text-lg font-semibold">{mostProfitableMeal.name}</div>
        <div class="text-sm">
          Profit: {money(mostProfitableMeal.profitCents)} (Bookings: {mostProfitableMeal.bookings})
        </div>
      {:else}
        <div class="text-sm">No data yet.</div>
      {/if}
    </div>
  </div>

  {#if mealStats.length > 0}
    <div class="p-4 border rounded mb-8">
      <h3 class="font-semibold mb-2">Meal Performance</h3>
      <table class="border w-full">
        <thead>
          <tr>
            <th class="border px-2 py-1 text-left">Meal</th>
            <th class="border px-2 py-1 text-right">Bookings</th>
            <th class="border px-2 py-1 text-right">Revenue</th>
            <th class="border px-2 py-1 text-right">Cost</th>
            <th class="border px-2 py-1 text-right">Profit</th>
          </tr>
        </thead>
        <tbody>
          {#each mealStats as ms}
            <tr>
              <td class="border px-2 py-1">{ms.name}</td>
              <td class="border px-2 py-1 text-right">{ms.bookings}</td>
              <td class="border px-2 py-1 text-right">{money(ms.revenueCents)}</td>
              <td class="border px-2 py-1 text-right">{money(ms.costCents)}</td>
              <td class="border px-2 py-1 text-right">{money(ms.profitCents)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <h2 class="text-xl font-semibold mb-2 mt-4">Meal Options</h2>

  <table class="border mt-2">
    <thead>
      <tr>
        <th class="border px-2 py-1">Name</th>
        <th class="border px-2 py-1">Description</th>
        <th class="border px-2 py-1">Price</th>
        <th class="border px-2 py-1">Ingredient Costs</th>
        <th class="border px-2 py-1">Available</th>
        <th class="border px-2 py-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each mealOptions as m}
        <tr>
          <td class="border px-2 py-1">{m.name}</td>
          <td class="border px-2 py-1">{m.description}</td>
          <td class="border px-2 py-1">${m.priceCents / 100}</td>
          <td class="border px-2 py-1">${m.ingredientCostCents / 100}</td>
          <td class="border px-2 py-1">{m.isAvailable ? "Yes" : "No"}</td>
          <td class="border px-2 py-1">
            <button on:click={() => editingMeal = { ...m, dietaryTags: m.dietaryTags.join(", ") }}>
              Edit
            </button>
            <button on:click={() => removeMeal(m.id)} class="ml-2 text-red-600">
              Delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="mt-4 p-4 border rounded">
    <h3 class="font-semibold">Add Meal</h3>

    <label>Name <input bind:value={newMeal.name} /></label>
    <label>Description <input bind:value={newMeal.description} /></label>
    <label>Price (cents) <input type="number" bind:value={newMeal.priceCents} /></label>
    <label>Ingredient Cost (cents) <input type="number" bind:value={newMeal.ingredientCostCents} /></label>
    <label>Dietary Tags (comma separated) <input bind:value={newMeal.dietaryTags} /></label>
    <label>Available <input type="checkbox" bind:checked={newMeal.isAvailable} /></label>

    <button class="mt-2 bg-green-600 text-white px-3 py-1 rounded" on:click={addMeal}>
      Add Meal
    </button>
  </div>

  {#if editingMeal}
    <div class="p-4 border mt-4 rounded bg-gray-100">
      <h3 class="font-semibold">Edit Meal</h3>

      <label>Name <input bind:value={editingMeal.name} /></label>
      <label>Description <input bind:value={editingMeal.description} /></label>
      <label>Price (cents) <input type="number" bind:value={editingMeal.priceCents} /></label>
      <label>Ingredient Cost <input type="number" bind:value={editingMeal.ingredientCostCents} /></label>
      <label>Dietary Tags <input bind:value={editingMeal.dietaryTags} /></label>
      <label>Available <input type="checkbox" bind:checked={editingMeal.isAvailable} /></label>

      <button class="mt-2 bg-blue-600 text-white px-3 py-1 rounded" on:click={saveMealChanges}>
        Save Changes
      </button>
      <button class="ml-2" on:click={() => editingMeal = null}>Cancel</button>
    </div>
  {/if}

  <hr class="my-6">

  <h2 class="text-xl font-semibold mb-2">Upcoming Meal Schedules</h2>

  {#if schedules.length === 0}
    <p>No schedules yet.</p>
  {:else}
    <table class="border mt-2">
      <thead>
        <tr>
          <th class="border px-2 py-1">Date</th>
          <th class="border px-2 py-1">Meal</th>
          <th class="border px-2 py-1">Bookings</th>
          <th class="border px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each schedules as s}
          <tr>
            <td class="border px-2 py-1">{s.serveDate}</td>
            <td class="border px-2 py-1">{s.mealName}</td>
            <td class="border px-2 py-1">{s.bookingCount}</td>
            <td class="border px-2 py-1">
              <button on:click={() => editingSchedule = { ...s }}>
                Edit
              </button>
              <button on:click={() => removeSchedule(s.id)} class="ml-2 text-red-600">
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  <div class="mt-6">
    <h2 class="text-xl font-semibold mb-2">Add New Meal Schedule</h2>

    <label>
      Date:
      <input type="date" bind:value={selectedDate} />
    </label>

    <label class="ml-4">
      Meal:
      <select bind:value={selectedOption}>
        <option value="">Choose meal</option>
        {#each mealOptions as m}
          <option value={m.id}>{m.name}</option>
        {/each}
      </select>
    </label>

    <button class="ml-4 px-3 py-1 bg-blue-500 text-white rounded" on:click={addSchedule}>
      Add Schedule
    </button>
  </div>

  {#if editingSchedule}
    <div class="mt-4 p-4 border rounded bg-gray-100">
      <h3 class="font-semibold">Edit Schedule</h3>

      <label>
        Date:
        <input type="date" bind:value={editingSchedule.serveDate} />
      </label>

      <label>
        Meal:
        <select bind:value={editingSchedule.mealOptionId}>
          {#each mealOptions as m}
            <option value={m.id}>{m.name}</option>
          {/each}
        </select>
      </label>

      <button class="mt-2 bg-blue-600 text-white px-3 py-1 rounded" on:click={saveScheduleChanges}>
        Save Changes
      </button>

      <button class="ml-2" on:click={() => editingSchedule = null}>
        Cancel
      </button>
    </div>
  {/if}
{/if}
