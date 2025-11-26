<script>
  import { goto } from '$app/navigation';

  let formData = {
    username: '',
    password: ''
  };

  let message = '';
  let isLoading = false;

  async function handleLogin() {
    isLoading = true;
    message = '';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        message = 'Login successful! Redirecting...';
        // goto different page by userType
        setTimeout(() => {
          if (result.user.userType === 'admin') {
            goto('/admin');
          } else {
            goto('/booking');
          }
        }, 1000);
      } else {
        message = result.error || 'Login failed';
      }
    } catch (error) {
      message = 'Network error: ' + error.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container">
  <h1>Login to SchoolBites</h1>

  <form on:submit|preventDefault={handleLogin}>
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

    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  </form>

  {#if message}
    <div class:success={!message.includes('error')} class:error={message.includes('error')}>
      {message}
    </div>
  {/if}

  <p>Don't have an account? <a href="/register">Register here</a></p>
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

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
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