import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../../login/$types';
import { findUserByUsername, verifyPassword } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  let body: { username?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return json(
      { error: 'Missing username or password', reason: 'missing_credentials' },
      { status: 400 }
    );
  }

  const user = await findUserByUsername(username);
  if (!user) {
    console.log('[login] user not found:', username);
    return json(
      { error: 'Invalid username or password', reason: 'user_not_found' },
      { status: 401 }
    );
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    console.log('[login] bad password for user:', username);
    return json(
      { error: 'Invalid username or password', reason: 'bad_password' },
      { status: 401 }
    );
  }

  cookies.set(
    'session',
    JSON.stringify({
      id: user.id,
      userType: user.userType, 
      username: user.username
    }),
    {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    }
  );

  return json({
    user: {
      id: user.id,
      username: user.username,
      userType: user.userType,
      schoolName: user.schoolName,
      validMealPlan: user.validMealPlan
    }
  });
};
