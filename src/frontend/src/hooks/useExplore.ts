import { useQuery } from "@tanstack/react-query";
import type { HashtagStat, PostView, SearchResults } from "../types";
import { useAuthenticatedBackend } from "./useAuthenticatedBackend";

export function useTrendingHashtags() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<HashtagStat[]>({
    queryKey: ["trendingHashtags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingHashtags();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useHashtagPosts(hashtag: string, enabled = true) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<PostView[]>({
    queryKey: ["hashtagPosts", hashtag],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHashtagPosts(hashtag);
    },
    enabled: !!actor && !isFetching && enabled && hashtag.length > 0,
  });
}

export function useSearchContent(searchQuery: string, enabled = true) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<SearchResults>({
    queryKey: ["searchContent", searchQuery],
    queryFn: async () => {
      if (!actor) return { users: [], posts: [] };
      return actor.searchContent(searchQuery);
    },
    enabled: !!actor && !isFetching && enabled && searchQuery.trim().length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}
