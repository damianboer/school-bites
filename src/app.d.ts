declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        userType: 'admin' | 'user';
        username: string;
      };
    }
  }
}

export {};