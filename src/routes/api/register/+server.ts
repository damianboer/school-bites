import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUser, findUserByUsername } from '$lib/auth';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password, schoolName, userType, adminName, validMealPlan } = await request.json();

    // verify missing fields
    if (!username || !password || !schoolName || !userType) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // verify adminName 验证用户类型特定字段
    if (userType === 'admin' && !adminName) {
      return json({ error: 'Admin name is required for admin users' }, { status: 400 });
    }

    // verify existing User name
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return json({ error: 'Username already exists' }, { status: 409 });
    }

    // createUser
    const user = await createUser({
      username,
      password,
      schoolName,
      userType,
      adminName,
      validMealPlan
    });

    // return user json返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return json({
      message: 'User registered successfully',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};