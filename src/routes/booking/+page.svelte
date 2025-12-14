<script lang="ts">
  import BookingForm from "$lib/components/BookingForm.svelte";
  import BookingList from "$lib/components/BookingList.svelte";

  export let data: { validMealPlan: boolean };
</script>

<BookingList />
<BookingForm validMealPlan={data.me?.validMealPlan} />