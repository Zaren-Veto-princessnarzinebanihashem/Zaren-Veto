import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminStats, ReportView, UserProfile } from "../types";
import { ResolveAction } from "../types";
import type { UserId } from "../types";
import { useAuthenticatedBackend } from "./useAuthenticatedBackend";

export function useAdminStats() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useAllUsers(page: bigint, pageSize: bigint) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<UserProfile[]>({
    queryKey: ["allUsers", page.toString(), pageSize.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers(page, pageSize);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReports(page: bigint, pageSize: bigint) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<ReportView[]>({
    queryKey: ["reports", page.toString(), pageSize.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports(page, pageSize);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGrantVerification() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, UserId>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.grantVerification(userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      void queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useRevokeVerification() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, UserId>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.revokeVerification(userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      void queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useResolveReport() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<
    boolean,
    Error,
    { reportId: bigint; action: ResolveAction }
  >({
    mutationFn: async ({ reportId, action }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.resolveReport(reportId, action);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
      void queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useSuspendUser() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, { userId: UserId; durationHours: bigint }>(
    {
      mutationFn: async ({ userId, durationHours }) => {
        if (!actor) throw new Error("Not authenticated");
        return actor.suspendUser(userId, durationHours);
      },
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      },
    },
  );
}

export function useBanUser() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, UserId>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.banUser(userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      void queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// Re-export ResolveAction for convenience
export { ResolveAction };
