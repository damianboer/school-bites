import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export interface RegisterUserData {
  username: string;
  password: string;
  schoolName: string;
  userType: 'admin' | 'user';
  adminName?: string;
  validMealPlan?: boolean;
}

export interface LoginUserData {
  username: string;
  password: string;
}

export async function findUserByUsername(username: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user || null;
}

export async function createUser(userData: RegisterUserData) {
  const [user] = await db.insert(users).values({
    username: userData.username,
    password: userData.password,
    schoolName: userData.schoolName,
    userType: userData.userType,
    adminName: userData.adminName,
    validMealPlan: userData.validMealPlan || false
  }).returning();

  return user;
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  return password === storedPassword;
}
