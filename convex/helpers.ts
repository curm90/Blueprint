import { authComponent } from './auth'
import type { QueryCtx, MutationCtx } from './_generated/server'

/**
 * Get the authenticated user's ID. Throws if not authenticated.
 * Use this in mutations that require auth.
 */
export async function getAuthUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const user = await authComponent.getAuthUser(ctx)
  return user._id
}

/**
 * Get the authenticated user's ID, or null if not authenticated.
 * Use this in queries so they return empty data instead of throwing
 * when auth isn't ready (e.g. during SSR or initial load).
 */
export async function getAuthUserIdOrNull(ctx: QueryCtx): Promise<string | null> {
  try {
    const user = await authComponent.getAuthUser(ctx)
    return user._id
  } catch {
    return null
  }
}
