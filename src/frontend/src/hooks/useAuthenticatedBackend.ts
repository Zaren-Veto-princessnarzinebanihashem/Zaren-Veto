import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend.d.ts";

/**
 * Returns the authenticated backend actor.
 * actor is null while identity is initializing or unavailable.
 */
export function useAuthenticatedBackend(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  return useActor(createActor);
}
