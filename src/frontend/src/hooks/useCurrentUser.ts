import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../types";
import { useAuthenticatedBackend } from "./useAuthenticatedBackend";

export type UserStatus =
  | "initializing"
  | "unauthenticated"
  | "registering"
  | "authenticated";

export function useCurrentUser() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useAuthenticatedBackend();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } =
    useQuery<UserProfile | null>({
      queryKey: ["myProfile"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMyProfile();
      },
      enabled: !!actor && !isFetching,
      retry: false,
    });

  // Basic registration (username + bio only, no password validation)
  const registerMutation = useMutation({
    mutationFn: async ({
      username,
      bio,
    }: { username: string; bio: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.register(username, bio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // Registration with password — calls backend registerWithPassword(username, password, bio)
  const registerWithPasswordMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      bio,
    }: { username: string; password: string; bio: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.registerWithPassword(username, password, bio);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  let status: UserStatus = "initializing";

  if (isInitializing || isFetching || isProfileLoading) {
    status = "initializing";
  } else if (!identity) {
    status = "unauthenticated";
  } else if (profile === null || profile === undefined) {
    status = "registering";
  } else {
    status = "authenticated";
  }

  return {
    status,
    profile: profile ?? null,
    identity,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    registerWithPassword: registerWithPasswordMutation.mutateAsync,
    isRegisteringWithPassword: registerWithPasswordMutation.isPending,
    registerWithPasswordError: registerWithPasswordMutation.error,
  };
}
