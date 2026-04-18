import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StoryFeed, StoryView, UserProfile } from "../types";
import { useAuthenticatedBackend } from "./useAuthenticatedBackend";

export function useStoriesFeed() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<StoryFeed[]>({
    queryKey: ["storiesFeed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoriesFeed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyStories() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<StoryView[]>({
    queryKey: ["myStories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyStories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStoryViewers(storyId: bigint, enabled = false) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<UserProfile[]>({
    queryKey: ["storyViewers", storyId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoryViewers(storyId);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useCreateStory() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<
    StoryView,
    Error,
    { imageUrl: string; textOverlay?: string }
  >({
    mutationFn: async ({ imageUrl, textOverlay }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createStory(imageUrl, textOverlay ?? null);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myStories"] });
      void queryClient.invalidateQueries({ queryKey: ["storiesFeed"] });
    },
  });
}

export function useDeleteStory() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (storyId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteStory(storyId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myStories"] });
      void queryClient.invalidateQueries({ queryKey: ["storiesFeed"] });
    },
  });
}

export function useViewStory() {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (storyId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.viewStory(storyId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storiesFeed"] });
    },
  });
}
