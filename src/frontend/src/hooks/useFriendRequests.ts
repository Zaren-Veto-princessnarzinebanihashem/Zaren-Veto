import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FriendRequestView } from "../types";
import { RespondAction } from "../types";
import type { UserId } from "../types";
import { useAuthenticatedBackend } from "./useAuthenticatedBackend";

export function usePendingRequests() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<FriendRequestView[]>({
    queryKey: ["pendingFriendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSentRequests() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<FriendRequestView[]>({
    queryKey: ["sentFriendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFriendRequestStatus(userId: UserId, enabled = true) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<string>({
    queryKey: ["friendRequestStatus", userId.toText()],
    queryFn: async () => {
      if (!actor) return "none";
      return actor.getFriendRequestStatus(userId);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useSendFriendRequest() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, UserId>({
    mutationFn: async (to) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.sendFriendRequest(to);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
      void queryClient.invalidateQueries({ queryKey: ["friendRequestStatus"] });
    },
  });
}

export function useRespondFriendRequest() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<
    boolean,
    Error,
    { requestId: bigint; action: RespondAction }
  >({
    mutationFn: async ({ requestId, action }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.respondFriendRequest(requestId, action);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["pendingFriendRequests"],
      });
      void queryClient.invalidateQueries({ queryKey: ["friendRequestStatus"] });
    },
  });
}

export function useCancelFriendRequest() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.cancelFriendRequest(requestId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sentFriendRequests"] });
      void queryClient.invalidateQueries({ queryKey: ["friendRequestStatus"] });
    },
  });
}

export function useBlockUser() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, UserId>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.blockUser(userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["pendingFriendRequests"],
      });
      void queryClient.invalidateQueries({ queryKey: ["friendRequestStatus"] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, UserId>({
    mutationFn: async (userId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.unblockUser(userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["friendRequestStatus"] });
    },
  });
}

export function useIsBlocked(userId: UserId, enabled = true) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<boolean>({
    queryKey: ["isBlocked", userId.toText()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isBlocked(userId);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

// Re-export RespondAction for convenience
export { RespondAction };
