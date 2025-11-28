<script lang="ts">
  import BookingForm from '$lib/components/BookingForm.svelte';
  import BookingList from '$lib/components/BookingList.svelte';

  //  this comes from +page.ts
  export let data;

  const { userId, validMealPlan, bookings } = data;
</script>

<h1>Student Meal Bookings</h1>

<BookingForm {userId} {validMealPlan} />
<hr />
<BookingList {bookings} />
