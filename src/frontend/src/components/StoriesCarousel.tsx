import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useLanguage } from "@/i18n/LanguageContext";
import type { StoryFeed, StoryView, UserProfile } from "@/types";
import { Visibility } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Eye, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { VerificationBadge } from "./VerificationBadge";

// ─── Story Expiry ─────────────────────────────────────────────────────────────

function StoryExpiry({ story }: { story: StoryView }) {
  const { t } = useLanguage();
  const nowMs = Date.now();
  const expiresMs = Number(story.expiresAt) / 1_000_000;
  const diffMs = expiresMs - nowMs;

  if (diffMs <= 0) {
    return (
      <p className="text-[10px] text-white/60 leading-none mt-0.5">
        {t.storiesExpired}
      </p>
    );
  }
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const label = diffHr >= 1 ? `${diffHr}h` : `${diffMin}m`;

  return (
    <p className="text-[10px] text-white/60 leading-none mt-0.5">
      {t.storiesExpiresIn} {label}
    </p>
  );
}

// ─── Story Viewer Modal ───────────────────────────────────────────────────────

const STORY_DURATION_MS = 5000;

interface StoryViewerProps {
  feeds: StoryFeed[];
  initialFeedIndex: number;
  currentUserId: string | undefined;
  onClose: () => void;
}

function StoryViewer({
  feeds,
  initialFeedIndex,
  currentUserId,
  onClose,
}: StoryViewerProps) {
  const { t } = useLanguage();
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const [feedIdx, setFeedIdx] = useState(initialFeedIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [viewers, setViewers] = useState<UserProfile[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // track current story identity for timer reset
  const storyKeyRef = useRef(`${feedIdx}-${storyIdx}`);

  const currentFeed = feeds[feedIdx];
  const currentStory = currentFeed?.stories[storyIdx];
  const isOwn = currentStory?.author.id.toString() === currentUserId;

  const goNext = useCallback(() => {
    const feed = feeds[feedIdx];
    if (!feed) return;
    if (storyIdx < feed.stories.length - 1) {
      setStoryIdx((i) => i + 1);
    } else if (feedIdx < feeds.length - 1) {
      setFeedIdx((i) => i + 1);
      setStoryIdx(0);
    } else {
      onClose();
    }
  }, [feedIdx, storyIdx, feeds, onClose]);

  const goPrev = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1);
    } else if (feedIdx > 0) {
      const prevFeed = feeds[feedIdx - 1];
      setFeedIdx((i) => i - 1);
      setStoryIdx(prevFeed ? prevFeed.stories.length - 1 : 0);
    }
  }, [feedIdx, storyIdx, feeds]);

  // Mark viewed
  useEffect(() => {
    if (!actor || !currentStory) return;
    if (!currentStory.viewedByMe) {
      void actor.viewStory(currentStory.id).catch(() => null);
    }
  }, [actor, currentStory]);

  // Progress timer — reset when story/feed changes or pause state changes
  useEffect(() => {
    const key = `${feedIdx}-${storyIdx}`;
    storyKeyRef.current = key;
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      if (storyKeyRef.current !== key) {
        clearInterval(id);
        return;
      }
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        goNext();
      }
    }, 50);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [feedIdx, storyIdx, paused, goNext]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  const deleteStory = useMutation({
    mutationFn: async (storyId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStory(storyId);
    },
    onSuccess: () => {
      toast.success(t.storiesDeleteSuccess);
      void qc.invalidateQueries({ queryKey: ["storiesFeed"] });
      void qc.invalidateQueries({ queryKey: ["myStories"] });
      onClose();
    },
    onError: () => toast.error("Failed to delete story"),
  });

  const handleShowViewers = async () => {
    if (!actor || !currentStory) return;
    setPaused(true);
    const result = await actor.getStoryViewers(currentStory.id).catch(() => []);
    setViewers(result);
    setShowViewers(true);
  };

  if (!currentFeed || !currentStory) return null;

  const storyCount = currentFeed.stories.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      data-ocid="story-viewer"
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 z-10">
        {Array.from({ length: storyCount }).map((_, i) => (
          <div
            key={`progress-${currentFeed.author.id.toString()}-${String(i)}`}
            className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width:
                  i < storyIdx
                    ? "100%"
                    : i === storyIdx
                      ? `${progress}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/70 bg-card shrink-0">
            {currentFeed.author.profilePhotoUrl ? (
              <img
                src={currentFeed.author.profilePhotoUrl}
                alt={currentFeed.author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-sm font-bold text-foreground">
                {currentFeed.author.username[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-white">
              {currentFeed.author.username}
              {isVerifiedUser(
                currentFeed.author.username,
                currentFeed.author.isVerified,
              ) && <VerificationBadge size={14} />}
            </span>
            <StoryExpiry story={currentStory} />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-smooth"
          aria-label="Close"
          data-ocid="story-viewer.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Story image + text overlay */}
      <div
        className="relative w-full max-w-sm h-full max-h-[calc(100vh-2rem)] flex items-center justify-center"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <img
          src={currentStory.imageUrl}
          alt="Story"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
        {currentStory.textOverlay && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center px-6">
            <p className="bg-black/60 text-white text-lg font-semibold px-4 py-2 rounded-xl text-center backdrop-blur-sm max-w-full break-words">
              {currentStory.textOverlay}
            </p>
          </div>
        )}
      </div>

      {/* Tap zones for prev/next */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-0 top-12 bottom-16 w-1/3 z-10 flex items-center justify-start ps-3 opacity-0 hover:opacity-100 transition-smooth"
        aria-label="Previous story"
        data-ocid="story-viewer.pagination_prev"
      >
        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </div>
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-0 top-12 bottom-16 w-1/3 z-10 flex items-center justify-end pe-3 opacity-0 hover:opacity-100 transition-smooth"
        aria-label="Next story"
        data-ocid="story-viewer.pagination_next"
      >
        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* Bottom bar */}
      <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between z-10">
        {isOwn ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => void handleShowViewers()}
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-smooth"
              data-ocid="story-viewer.viewers-button"
            >
              <Eye className="w-4 h-4" />
              <span>{currentStory.viewCount.toString()}</span>
              <span className="text-xs opacity-70">{t.storiesViewers}</span>
            </button>
            <button
              type="button"
              onClick={() => deleteStory.mutate(currentStory.id)}
              disabled={deleteStory.isPending}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm transition-smooth"
              data-ocid="story-viewer.delete_button"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.storiesDelete}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-white/60 text-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>
              {currentStory.viewCount.toString()} {t.storiesViewedBy}
            </span>
          </div>
        )}
        {/* Story position dots */}
        <div className="flex items-center gap-1">
          {Array.from({ length: storyCount }).map((_, i) => (
            <div
              key={`dot-${String(i)}`}
              className={`rounded-full transition-smooth ${i === storyIdx ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* Viewers panel (slide up) */}
      <AnimatePresence>
        {showViewers && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl z-20 max-h-[60%] flex flex-col"
            data-ocid="story-viewers-panel"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground text-sm">
                {t.storiesViewers} ({viewers.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowViewers(false);
                  setPaused(false);
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                aria-label="Close viewers"
                data-ocid="story-viewers-panel.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto divide-y divide-border/50">
              {viewers.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground text-sm">
                  {t.storiesNoStories}
                </p>
              ) : (
                viewers.map((viewer) => (
                  <div
                    key={viewer.id.toString()}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-xs font-bold text-foreground overflow-hidden">
                      {viewer.profilePhotoUrl ? (
                        <img
                          src={viewer.profilePhotoUrl}
                          alt={viewer.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (viewer.username[0]?.toUpperCase() ?? "?")
                      )}
                    </div>
                    <span className="text-sm text-foreground font-medium">
                      {viewer.username}
                    </span>
                    {isVerifiedUser(viewer.username, viewer.isVerified) && (
                      <VerificationBadge size={14} />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

interface StoriesCarouselProps {
  currentUserId: string | undefined;
  onCreateStory: () => void;
}

export function StoriesCarousel({
  currentUserId,
  onCreateStory,
}: StoriesCarouselProps) {
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeFeedIdx, setActiveFeedIdx] = useState(0);

  const { data: feeds = [] } = useQuery<StoryFeed[]>({
    queryKey: ["storiesFeed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoriesFeed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const { data: myStories = [] } = useQuery<StoryView[]>({
    queryKey: ["myStories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyStories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const hasMyStories = myStories.length > 0;

  // Build a synthetic "own" feed entry for the viewer
  const ownFeed: StoryFeed | null =
    hasMyStories && myStories[0]
      ? {
          author: myStories[0].author,
          stories: myStories,
          hasUnviewed: false,
        }
      : null;

  const openOwnStories = () => {
    if (!ownFeed) return;
    setActiveFeedIdx(0);
    setViewerOpen(true);
  };

  const openFeed = (idx: number) => {
    // offset by 1 if we prepend ownFeed
    setActiveFeedIdx(ownFeed ? idx + 1 : idx);
    setViewerOpen(true);
  };

  // Combined feeds for viewer: own first, then others
  const allFeeds: StoryFeed[] = ownFeed ? [ownFeed, ...feeds] : feeds;

  return (
    <>
      <div
        className="bg-card border border-border rounded-xl py-3 px-2 overflow-hidden"
        data-ocid="stories-carousel"
      >
        <div
          className="flex gap-3 overflow-x-auto pb-1 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Own story bubble */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={hasMyStories ? openOwnStories : onCreateStory}
            className="flex flex-col items-center gap-1.5 shrink-0 snap-start"
            data-ocid="stories-carousel.your_story"
          >
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-full overflow-hidden border-2 flex items-center justify-center ${
                  hasMyStories
                    ? "border-[#1877F2]"
                    : "border-border bg-secondary"
                }`}
              >
                {hasMyStories && myStories[0]?.imageUrl ? (
                  <img
                    src={myStories[0].imageUrl}
                    alt="Your story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              {!hasMyStories && (
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#1877F2] border-2 border-card flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium w-14 text-center truncate">
              {t.storiesYourStory}
            </span>
          </motion.button>

          {/* Other users' story feeds */}
          {feeds.map((feed, idx) => {
            const isUnviewed = feed.hasUnviewed;
            const previewStory = feed.stories[0];
            return (
              <motion.button
                key={feed.author.id.toString()}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => openFeed(idx)}
                className="flex flex-col items-center gap-1.5 shrink-0 snap-start"
                data-ocid={`stories-carousel.item.${idx + 1}`}
              >
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                    isUnviewed ? "border-[#1877F2]" : "border-border"
                  }`}
                >
                  {feed.author.profilePhotoUrl ? (
                    <img
                      src={feed.author.profilePhotoUrl}
                      alt={feed.author.username}
                      className="w-full h-full object-cover"
                    />
                  ) : previewStory ? (
                    <img
                      src={previewStory.imageUrl}
                      alt={feed.author.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-sm font-bold text-foreground">
                      {feed.author.username[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium w-14 text-center truncate">
                  {feed.author.username}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Story viewer overlay */}
      <AnimatePresence>
        {viewerOpen && allFeeds.length > 0 && (
          <StoryViewer
            feeds={allFeeds}
            initialFeedIndex={Math.min(activeFeedIdx, allFeeds.length - 1)}
            currentUserId={currentUserId}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// End of StoriesCarousel module
