import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

// Register Type用户注册类型
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


// 根据用户名查找用户
/**
 * Finds a user by username in the database
 * @param username - The username to search for
 * @returns User object if found, null otherwise
 *
 * Reference: Drizzle ORM Basic Queries - Select with WHERE clause
 * Source: https://orm.drizzle.team/docs/select
 *
 * The eq() function creates an equality condition for the WHERE clause
 * Destructuring [user] gets the first result from the returned array
 */
export async function findUserByUsername(username: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user || null;
}

// createUser
export async function createUser(userData: RegisterUserData) {
  const [user] = await db.insert(users).values({
    username: userData.username,
    password: userData.password,
    schoolName: userData.schoolName,
    userType: userData.userType,
    adminName: userData.adminName,
    validMealPlan: userData.validMealPlan || false,
  }).returning();

  return user;
}

// verifyPassword
export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  return password === storedPassword;
}