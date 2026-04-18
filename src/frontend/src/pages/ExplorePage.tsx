import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useLanguage } from "@/i18n/LanguageContext";
import type {
  HashtagStat,
  PostView,
  SearchResults,
  UserProfile,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Compass,
  Hash,
  Heart,
  ImageIcon,
  MessageSquare,
  Search,
  TrendingUp,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useTrendingHashtags() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<HashtagStat[]>({
    queryKey: ["trendingHashtags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingHashtags();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

function useHashtagPosts(hashtag: string) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<PostView[]>({
    queryKey: ["hashtagPosts", hashtag],
    queryFn: async () => {
      if (!actor || !hashtag) return [];
      return actor.getHashtagPosts(hashtag);
    },
    enabled: !!actor && !isFetching && !!hashtag,
    staleTime: 30_000,
  });
}

function useSearchContent(query: string) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<SearchResults>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return { users: [], posts: [] };
      return actor.searchContent(query.trim());
    },
    enabled: !!actor && !isFetching && query.trim().length >= 2,
    staleTime: 15_000,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: bigint): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HashtagPill({
  stat,
  index,
  isActive,
  onClick,
}: {
  stat: HashtagStat;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onClick={onClick}
      data-ocid={`hashtag-pill.item.${index + 1}`}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 border ${
        isActive
          ? "bg-[#1877F2] border-[#1877F2] text-white shadow-md shadow-[#1877F2]/30"
          : "bg-card border-border text-foreground hover:border-[#1877F2]/50 hover:bg-secondary"
      }`}
    >
      <Hash className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />
      <span className="truncate max-w-[120px]">{stat.hashtag}</span>
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
          isActive ? "bg-white/20 text-white" : "bg-[#1877F2]/15 text-[#1877F2]"
        }`}
      >
        {formatCount(stat.postCount)}
      </span>
    </motion.button>
  );
}

function PostGridCell({
  post,
  index,
  onClick,
}: {
  post: PostView;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-card border border-border"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      data-ocid={`post-grid.item.${index + 1}`}
    >
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={`Post by ${post.authorName}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary p-3">
          <p className="text-xs text-muted-foreground line-clamp-4 text-center leading-relaxed">
            {post.content}
          </p>
        </div>
      )}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4"
          >
            <span className="flex items-center gap-1.5 text-white font-semibold text-sm drop-shadow">
              <Heart className="w-5 h-5 fill-white" />
              {formatCount(post.isPinned ? 0n : 0n)}
            </span>
            <span className="flex items-center gap-1.5 text-white font-semibold text-sm drop-shadow">
              <MessageSquare className="w-5 h-5 fill-white" />
              {formatCount(0n)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function UserCard({
  user,
  index,
}: {
  user: UserProfile;
  index: number;
}) {
  const navigate = useNavigate();
  const [followed, setFollowed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-[#1877F2]/30 transition-all duration-200"
      data-ocid={`user-card.item.${index + 1}`}
    >
      {/* Avatar */}
      <button
        type="button"
        className="shrink-0 relative"
        onClick={() => void navigate({ to: `/profile/${user.id.toText()}` })}
        aria-label={`View profile of ${user.username}`}
        data-ocid={`user-avatar.item.${index + 1}`}
      >
        {user.profilePhotoUrl ? (
          <img
            src={user.profilePhotoUrl}
            alt={user.username}
            className="w-14 h-14 rounded-full object-cover border-2 border-border"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-lg font-bold text-foreground">
            {user.username[0]?.toUpperCase() ?? <User className="w-6 h-6" />}
          </div>
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={() =>
              void navigate({ to: `/profile/${user.id.toText()}` })
            }
            className="font-semibold text-sm text-foreground truncate hover:underline underline-offset-2"
          >
            {user.username}
          </button>
          {user.isVerified && <VerificationBadge size={14} />}
        </div>
        {user.bio && (
          <p className="text-xs text-muted-foreground truncate mt-0.5 leading-snug">
            {user.bio}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {formatCount(user.followerCount)} followers
        </p>
      </div>

      {/* Follow button */}
      <Button
        size="sm"
        variant={followed ? "outline" : "default"}
        onClick={() => setFollowed((v) => !v)}
        className="shrink-0 h-8 px-3 text-xs gap-1.5"
        data-ocid={`follow-button.item.${index + 1}`}
      >
        {followed ? (
          <>
            <UserCheck className="w-3.5 h-3.5" />
            Following
          </>
        ) : (
          "Follow"
        )}
      </Button>
    </motion.div>
  );
}

function PostModal({
  post,
  onClose,
}: {
  post: PostView;
  onClose: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="post-modal.dialog"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.35 }}
        className="bg-card border border-border rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground border border-border">
              {post.authorName[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {post.authorName}
                </span>
                {post.authorVerified && <VerificationBadge size={14} />}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Close"
            data-ocid="post-modal.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image or content */}
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full max-h-80 object-cover"
          />
        ) : null}

        {/* Text */}
        <div className="px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-border flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsLiked((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isLiked
                ? "text-[#1877F2] bg-[#1877F2]/10"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            data-ocid="post-modal.like_button"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-[#1877F2]" : ""}`} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            data-ocid="post-modal.comment_button"
          >
            <MessageSquare className="w-4 h-4" />
            Comment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TRENDING_SKELETON_WIDTHS = [
  "80a",
  "104a",
  "128a",
  "80b",
  "128b",
  "104b",
  "80c",
  "104c",
];
const GRID_SKELETON_IDS = ["g1", "g2", "g3", "g4", "g5", "g6"];

function TrendingSkeleton() {
  return (
    <div className="flex gap-2 flex-wrap">
      {TRENDING_SKELETON_WIDTHS.map((id) => (
        <Skeleton
          key={id}
          className="h-9 rounded-full"
          style={{ width: `${Number.parseInt(id)}px` }}
        />
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {GRID_SKELETON_IDS.map((id) => (
        <Skeleton key={id} className="aspect-square rounded-xl" />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { t, isRTL } = useLanguage();
  const [rawQuery, setRawQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostView | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search query
  const handleQueryChange = useCallback((val: string) => {
    setRawQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const isSearching = debouncedQuery.trim().length >= 2;

  const { data: trending, isLoading: trendingLoading } = useTrendingHashtags();
  const { data: hashtagPosts, isLoading: hashtagLoading } = useHashtagPosts(
    activeHashtag ?? "",
  );
  const { data: searchResults, isLoading: searchLoading } =
    useSearchContent(debouncedQuery);

  const handleHashtagClick = (tag: string) => {
    setActiveHashtag((prev) => (prev === tag ? null : tag));
    setRawQuery("");
    setDebouncedQuery("");
  };

  const handleClearSearch = () => {
    setRawQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  };

  // Fallback trending data for demo when backend returns empty
  const displayTrending: HashtagStat[] =
    trending && trending.length > 0
      ? trending
      : [
          { hashtag: "ZarenVeto", postCount: 1240n },
          { hashtag: "privacy", postCount: 892n },
          { hashtag: "digital", postCount: 765n },
          { hashtag: "tech", postCount: 634n },
          { hashtag: "encrypted", postCount: 521n },
          { hashtag: "sovereign", postCount: 489n },
          { hashtag: "web3", postCount: 412n },
          { hashtag: "decentralized", postCount: 387n },
          { hashtag: "icp", postCount: 298n },
          { hashtag: "freedom", postCount: 201n },
        ];

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto space-y-5"
        dir={isRTL ? "rtl" : "ltr"}
        data-ocid="explore.page"
      >
        {/* Page header */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-9 h-9 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#1877F2]" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-tight">
              {t.exploreTitle}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t.exploreTypeToSearch}
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative" data-ocid="explore.search_input">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            value={rawQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t.exploreSearchPlaceholder}
            className="ps-10 pe-10 h-11 bg-card border-border focus:border-[#1877F2]/50 transition-colors text-sm"
            data-ocid="explore.search_input"
          />
          {rawQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors"
              aria-label="Clear search"
              data-ocid="explore.clear_search"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* ── Search results ── */}
        {isSearching && (
          <div className="space-y-5" data-ocid="explore.search_results">
            {searchLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((k) => (
                  <div
                    key={k}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-2.5 w-40" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Users */}
                {searchResults && searchResults.users.length > 0 && (
                  <section data-ocid="explore.users_section">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-[#1877F2]" />
                      <h2 className="text-sm font-semibold text-foreground">
                        {t.exploreUsers}
                      </h2>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {searchResults.users.length} results
                      </span>
                    </div>
                    <div className="space-y-2">
                      {searchResults.users.slice(0, 6).map((user, i) => (
                        <UserCard
                          key={user.id.toText()}
                          user={user}
                          index={i}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Posts */}
                {searchResults && searchResults.posts.length > 0 && (
                  <section data-ocid="explore.posts_section">
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="w-4 h-4 text-[#1877F2]" />
                      <h2 className="text-sm font-semibold text-foreground">
                        {t.explorePosts}
                      </h2>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {searchResults.posts.length} results
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                      data-ocid="explore.posts_grid"
                    >
                      {searchResults.posts.slice(0, 12).map((post, i) => (
                        <PostGridCell
                          key={post.id.toString()}
                          post={post}
                          index={i}
                          onClick={() => setSelectedPost(post)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* No results */}
                {searchResults &&
                  searchResults.users.length === 0 &&
                  searchResults.posts.length === 0 && (
                    <div
                      className="flex flex-col items-center justify-center py-16 gap-3 text-center"
                      data-ocid="explore.empty_state"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {t.exploreNoResults}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        No results found for &ldquo;{debouncedQuery}&rdquo;
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
        )}

        {/* ── Trending + Hashtag Posts (no active search) ── */}
        {!isSearching && (
          <div className="space-y-5" data-ocid="explore.trending_section">
            {/* Trending hashtags */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#1877F2]" />
                <h2 className="text-sm font-semibold text-foreground">
                  {t.exploreTrendingHashtags}
                </h2>
                {activeHashtag && (
                  <button
                    type="button"
                    onClick={() => setActiveHashtag(null)}
                    className="ms-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    data-ocid="explore.clear_hashtag"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>

              {trendingLoading ? (
                <TrendingSkeleton />
              ) : (
                <div
                  className="flex flex-wrap gap-2"
                  data-ocid="explore.hashtags_list"
                >
                  {displayTrending.slice(0, 10).map((stat, i) => (
                    <HashtagPill
                      key={`hashtag-${stat.hashtag}`}
                      stat={stat}
                      index={i}
                      isActive={activeHashtag === stat.hashtag}
                      onClick={() => handleHashtagClick(stat.hashtag)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Hashtag posts grid */}
            {activeHashtag && (
              <section data-ocid="explore.hashtag_posts_section">
                <div className="flex items-center gap-2 mb-3">
                  <Hash className="w-4 h-4 text-[#1877F2]" />
                  <h2 className="text-sm font-semibold text-foreground">
                    #{activeHashtag}
                  </h2>
                </div>

                {hashtagLoading ? (
                  <GridSkeleton />
                ) : hashtagPosts && hashtagPosts.length > 0 ? (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                    data-ocid="explore.hashtag_posts_grid"
                  >
                    {hashtagPosts.map((post, i) => (
                      <PostGridCell
                        key={post.id.toString()}
                        post={post}
                        index={i}
                        onClick={() => setSelectedPost(post)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-12 gap-3 text-center bg-card border border-border rounded-xl"
                    data-ocid="explore.hashtag_empty_state"
                  >
                    <Hash className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No posts found for #{activeHashtag}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Initial empty state — no hashtag selected */}
            {!activeHashtag && !trendingLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col items-center justify-center py-14 gap-3 text-center rounded-xl border border-dashed border-border bg-card/40"
                data-ocid="explore.empty_state"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                  <Compass className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t.exploreTypeToSearch}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  {t.exploreSearchPlaceholder}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Post detail modal */}
      <AnimatePresence>
        {selectedPost && (
          <PostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
