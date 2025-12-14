svelte
<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  let formData = {
    username: '',
    password: '',
    schoolName: '',
    userType: 'user',
    adminName: '',
    validMealPlan: false
  };

  let message = '';
  let isLoading = false;

  async function handleRegister() {
    isLoading = true;
    message = '';

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        message = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          goto('/login');
        }, 2000);
      } else {
        message = result.error || 'Registration failed';
      }
    } catch (error) {
      message = 'Network error: ' + error.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container">
  <h1>Register for SchoolBites</h1>

  <form on:submit|preventDefault={handleRegister}>
    <div class="form-group">
      <label for="username">Username:</label>
      <input
        id="username"
        type="text"
        bind:value={formData.username}
        required
      />
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
        id="password"
        type="password"
        bind:value={formData.password}
        required
      />
    </div>

    <div class="form-group">
      <label for="schoolName">School Name:</label>
      <input
        id="schoolName"
        type="text"
        bind:value={formData.schoolName}
        required
      />
    </div>

    <div class="form-group">
      <label for="userType">User Type:</label>
      <select id="userType" bind:value={formData.userType}>
        <option value="user">Student/User</option>
        <option value="admin">Administrator</option>
      </select>
    </div>

    {#if formData.userType === 'admin'}
      <div class="form-group">
        <label for="adminName">Admin Name:</label>
        <input
          id="adminName"
          type="text"
          bind:value={formData.adminName}
          required
        />
      </div>
    {/if}

    {#if formData.userType === 'user'}
      <div class="form-group checkbox">
        <label>
          <input
            type="checkbox"
            bind:checked={formData.validMealPlan}
          />
          Has Valid Meal Plan
        </label>
      </div>
    {/if}

    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Registering...' : 'Register'}
    </button>
  </form>

  {#if message}
    <div class:success={!message.includes('error')} class:error={message.includes('error')}>
      {message}
    </div>
  {/if}

  <p>Already have an account? <a href="/login">Login here</a></p>
</div>

<style>
  .container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .checkbox label {
    display: flex;
    align-items: center;
    font-weight: normal;
  }

  .checkbox input {
    width: auto;
    margin-right: 8px;
  }

  button {
    width: 100%;
    padding: 10px;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .success {
    color: green;
    margin-top: 15px;
    padding: 10px;
    background: #f0fff0;
    border: 1px solid green;
    border-radius: 4px;
  }

  .error {
    color: red;
    margin-top: 15px;
    padding: 10px;
    background: #fff0f0;
    border: 1px solid red;
    border-radius: 4px;
  }

  a {
    color: #007acc;
    text-decoration: none;
  }
</style>