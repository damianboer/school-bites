/**
 * SvelteKit App-level Type Declarations
 *
 * Reference: SvelteKit - Project structure - app.d.ts
 * Source: https://kit.svelte.dev/docs/project-structure#app-d-ts
 *
 * This file provides TypeScript type definitions that are available globally
 * throughout your SvelteKit application. It extends SvelteKit's built-in types
 * with your application-specific types.
 *
 * The `declare global` block allows augmenting the global App namespace
 * that SvelteKit uses for type definitions across the entire application.
 */
declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        userType: string;
        username: string;
      };
    }
  }
}
/**
 * Empty export statement makes this file an ES module
 *
 * Reference: TypeScript - Modules
 * Source: https://www.typescriptlang.org/docs/handbook/modules.html
 *
 * This export {} line is required because:
 * - TypeScript files without imports/exports are considered scripts (global scope)
 * - Files with imports/exports are considered modules (module scope)
 * - We need module scope to use `declare global` for namespace augmentation
 */
export {};