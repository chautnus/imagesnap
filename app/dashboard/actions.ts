"use server";

/**
 * SILENCER ACTION
 * Prevents "Server Action Not Found" on stale manifest POSTs.
 */
export async function stalePostAction() {
  return { success: true };
}
