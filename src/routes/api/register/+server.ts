// src/routes/api/register/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { findUserByUsername, createUser } from '$lib/server/auth';

const RegisterSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),          
  schoolName: z.string().min(1),
  userType: z.enum(['admin', 'user']),
  adminName: z.string().optional(),
  validMealPlan: z.boolean().optional()
});

export const POST: RequestHandler = async ({ request, cookies }) => {
  let data;
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'bad_request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    data = parsed.data;
  } catch (err) {
    throw error(400, { message: 'invalid_json' });
  }

  const existing = await findUserByUsername(data.username);
  if (existing) {
    return json(
      { error: 'username_taken' },
      { status: 409 }
    );
  }

  const user = await createUser(data);

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

  return json(
    {
      id: user.id,
      username: user.username,
      userType: user.userType,
      schoolName: user.schoolName
    },
    { status: 201 }
  );
};
