// src/routes/api/login/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findUserByUsername, verifyPassword } from '$lib/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return json({ error: 'Username and password are required' }, { status: 400 });
    }

    // findUser
    const user = await findUserByUsername(username);
    if (!user) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // ValidPassword
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // create session
    const sessionData = {
      userId: user.id,
      userType: user.userType,
      username: user.username
    };

// Set session cookie
cookies.set('session', JSON.stringify(sessionData), {
  path: '/',
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30 // 30 days
});

// Reference: SvelteKit Cookies API - Setting Cookies
// Source: https://kit.svelte.dev/docs/types#public-types-cookies
// Documentation: https://kit.svelte.dev/docs/load#cookies

    // return login message
    const { password: _, ...userWithoutPassword } = user;
    return json({
      message: 'Login successful',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};