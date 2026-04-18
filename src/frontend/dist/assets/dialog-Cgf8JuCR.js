import { b as createLucideIcon, a as useLanguage, r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence, d as useQueryClient, e as ue, X, c as cn } from "./index-DAQ2-jUM.js";
import { a as useAuthenticatedBackend, b as useQuery, c as useMutation, f as useComposedRefs } from "./useCurrentUser-CLqn61Zi.js";
import { i as isVerifiedUser, V as VerificationBadge, a as useControllableState, b as useId, d as Presence, P as Primitive, c as composeEventHandlers, h as Portal$1, j as hideOthers, f as createContextScope, k as ReactRemoveScroll, l as useFocusGuards, F as FocusScope, D as DismissableLayer, m as createSlot, n as createContext2 } from "./Layout-BNg2Wjue.js";
import { E as Eye } from "./eye-Cgw6umzJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function StoryExpiry({ story }) {
  const { t } = useLanguage();
  const nowMs = Date.now();
  const expiresMs = Number(story.expiresAt) / 1e6;
  const diffMs = expiresMs - nowMs;
  if (diffMs <= 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/60 leading-none mt-0.5", children: t.storiesExpired });
  }
  const diffMin = Math.floor(diffMs / 6e4);
  const diffHr = Math.floor(diffMin / 60);
  const label = diffHr >= 1 ? `${diffHr}h` : `${diffMin}m`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/60 leading-none mt-0.5", children: [
    t.storiesExpiresIn,
    " ",
    label
  ] });
}
const STORY_DURATION_MS = 5e3;
function StoryViewer({
  feeds,
  initialFeedIndex,
  currentUserId,
  onClose
}) {
  var _a;
  const { t } = useLanguage();
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const [feedIdx, setFeedIdx] = reactExports.useState(initialFeedIndex);
  const [storyIdx, setStoryIdx] = reactExports.useState(0);
  const [progress, setProgress] = reactExports.useState(0);
  const [paused, setPaused] = reactExports.useState(false);
  const [showViewers, setShowViewers] = reactExports.useState(false);
  const [viewers, setViewers] = reactExports.useState([]);
  const timerRef = reactExports.useRef(null);
  const storyKeyRef = reactExports.useRef(`${feedIdx}-${storyIdx}`);
  const currentFeed = feeds[feedIdx];
  const currentStory = currentFeed == null ? void 0 : currentFeed.stories[storyIdx];
  const isOwn = (currentStory == null ? void 0 : currentStory.author.id.toString()) === currentUserId;
  const goNext = reactExports.useCallback(() => {
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
  const goPrev = reactExports.useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1);
    } else if (feedIdx > 0) {
      const prevFeed = feeds[feedIdx - 1];
      setFeedIdx((i) => i - 1);
      setStoryIdx(prevFeed ? prevFeed.stories.length - 1 : 0);
    }
  }, [feedIdx, storyIdx, feeds]);
  reactExports.useEffect(() => {
    if (!actor || !currentStory) return;
    if (!currentStory.viewedByMe) {
      void actor.viewStory(currentStory.id).catch(() => null);
    }
  }, [actor, currentStory]);
  reactExports.useEffect(() => {
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
      const pct = Math.min(elapsed / STORY_DURATION_MS * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        goNext();
      }
    }, 50);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [feedIdx, storyIdx, paused, goNext]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);
  const deleteStory = useMutation({
    mutationFn: async (storyId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStory(storyId);
    },
    onSuccess: () => {
      ue.success(t.storiesDeleteSuccess);
      void qc.invalidateQueries({ queryKey: ["storiesFeed"] });
      void qc.invalidateQueries({ queryKey: ["myStories"] });
      onClose();
    },
    onError: () => ue.error("Failed to delete story")
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/95",
      "data-ocid": "story-viewer",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 flex gap-1 p-3 z-10", children: Array.from({ length: storyCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-white rounded-full transition-none",
                style: {
                  width: i < storyIdx ? "100%" : i === storyIdx ? `${progress}%` : "0%"
                }
              }
            )
          },
          `progress-${currentFeed.author.id.toString()}-${String(i)}`
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full overflow-hidden border-2 border-white/70 bg-card shrink-0", children: currentFeed.author.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: currentFeed.author.profilePhotoUrl,
                alt: currentFeed.author.username,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-secondary text-sm font-bold text-foreground", children: ((_a = currentFeed.author.username[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-sm font-semibold text-white", children: [
                currentFeed.author.username,
                isVerifiedUser(
                  currentFeed.author.username,
                  currentFeed.author.isVerified
                ) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StoryExpiry, { story: currentStory })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-smooth",
              "aria-label": "Close",
              "data-ocid": "story-viewer.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative w-full max-w-sm h-full max-h-[calc(100vh-2rem)] flex items-center justify-center",
            onMouseDown: () => setPaused(true),
            onMouseUp: () => setPaused(false),
            onTouchStart: () => setPaused(true),
            onTouchEnd: () => setPaused(false),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: currentStory.imageUrl,
                  alt: "Story",
                  className: "w-full h-full object-contain select-none",
                  draggable: false
                }
              ),
              currentStory.textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-24 left-0 right-0 flex justify-center px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bg-black/60 text-white text-lg font-semibold px-4 py-2 rounded-xl text-center backdrop-blur-sm max-w-full break-words", children: currentStory.textOverlay }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: goPrev,
            className: "absolute left-0 top-12 bottom-16 w-1/3 z-10 flex items-center justify-start ps-3 opacity-0 hover:opacity-100 transition-smooth",
            "aria-label": "Previous story",
            "data-ocid": "story-viewer.pagination_prev",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-black/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-white" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: goNext,
            className: "absolute right-0 top-12 bottom-16 w-1/3 z-10 flex items-center justify-end pe-3 opacity-0 hover:opacity-100 transition-smooth",
            "aria-label": "Next story",
            "data-ocid": "story-viewer.pagination_next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-black/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 text-white" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 left-4 right-4 flex items-center justify-between z-10", children: [
          isOwn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => void handleShowViewers(),
                className: "flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-smooth",
                "data-ocid": "story-viewer.viewers-button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: currentStory.viewCount.toString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-70", children: t.storiesViewers })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => deleteStory.mutate(currentStory.id),
                disabled: deleteStory.isPending,
                className: "flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm transition-smooth",
                "data-ocid": "story-viewer.delete_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.storiesDelete })
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-white/60 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              currentStory.viewCount.toString(),
              " ",
              t.storiesViewedBy
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: storyCount }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `rounded-full transition-smooth ${i === storyIdx ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/40"}`
            },
            `dot-${String(i)}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showViewers && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { y: "100%" },
            animate: { y: 0 },
            exit: { y: "100%" },
            transition: { type: "spring", damping: 30, stiffness: 300 },
            className: "absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl z-20 max-h-[60%] flex flex-col",
            "data-ocid": "story-viewers-panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground text-sm", children: [
                  t.storiesViewers,
                  " (",
                  viewers.length,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowViewers(false);
                      setPaused(false);
                    },
                    className: "w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                    "aria-label": "Close viewers",
                    "data-ocid": "story-viewers-panel.close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto divide-y divide-border/50", children: viewers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-6 text-center text-muted-foreground text-sm", children: t.storiesNoStories }) : viewers.map((viewer) => {
                var _a2;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-3 px-4 py-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-xs font-bold text-foreground overflow-hidden", children: viewer.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: viewer.profilePhotoUrl,
                          alt: viewer.username,
                          className: "w-full h-full object-cover"
                        }
                      ) : ((_a2 = viewer.username[0]) == null ? void 0 : _a2.toUpperCase()) ?? "?" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-medium", children: viewer.username }),
                      isVerifiedUser(viewer.username, viewer.isVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
                    ]
                  },
                  viewer.id.toString()
                );
              }) })
            ]
          }
        ) })
      ]
    }
  );
}
function StoriesCarousel({
  currentUserId,
  onCreateStory
}) {
  var _a;
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const [viewerOpen, setViewerOpen] = reactExports.useState(false);
  const [activeFeedIdx, setActiveFeedIdx] = reactExports.useState(0);
  const { data: feeds = [] } = useQuery({
    queryKey: ["storiesFeed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoriesFeed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4,
    refetchInterval: 6e4
  });
  const { data: myStories = [] } = useQuery({
    queryKey: ["myStories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyStories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
  const hasMyStories = myStories.length > 0;
  const ownFeed = hasMyStories && myStories[0] ? {
    author: myStories[0].author,
    stories: myStories,
    hasUnviewed: false
  } : null;
  const openOwnStories = () => {
    if (!ownFeed) return;
    setActiveFeedIdx(0);
    setViewerOpen(true);
  };
  const openFeed = (idx) => {
    setActiveFeedIdx(ownFeed ? idx + 1 : idx);
    setViewerOpen(true);
  };
  const allFeeds = ownFeed ? [ownFeed, ...feeds] : feeds;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border border-border rounded-xl py-3 px-2 overflow-hidden",
        "data-ocid": "stories-carousel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-3 overflow-x-auto pb-1 px-1 snap-x snap-mandatory",
            style: { scrollbarWidth: "none" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.button,
                {
                  whileTap: { scale: 0.95 },
                  type: "button",
                  onClick: hasMyStories ? openOwnStories : onCreateStory,
                  className: "flex flex-col items-center gap-1.5 shrink-0 snap-start",
                  "data-ocid": "stories-carousel.your_story",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-14 h-14 rounded-full overflow-hidden border-2 flex items-center justify-center ${hasMyStories ? "border-[#1877F2]" : "border-border bg-secondary"}`,
                          children: hasMyStories && ((_a = myStories[0]) == null ? void 0 : _a.imageUrl) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: myStories[0].imageUrl,
                              alt: "Your story",
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 text-muted-foreground" }) })
                        }
                      ),
                      !hasMyStories && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#1877F2] border-2 border-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 text-white" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium w-14 text-center truncate", children: t.storiesYourStory })
                  ]
                }
              ),
              feeds.map((feed, idx) => {
                var _a2;
                const isUnviewed = feed.hasUnviewed;
                const previewStory = feed.stories[0];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    whileTap: { scale: 0.95 },
                    type: "button",
                    onClick: () => openFeed(idx),
                    className: "flex flex-col items-center gap-1.5 shrink-0 snap-start",
                    "data-ocid": `stories-carousel.item.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `w-14 h-14 rounded-full overflow-hidden border-2 ${isUnviewed ? "border-[#1877F2]" : "border-border"}`,
                          children: feed.author.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: feed.author.profilePhotoUrl,
                              alt: feed.author.username,
                              className: "w-full h-full object-cover"
                            }
                          ) : previewStory ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: previewStory.imageUrl,
                              alt: feed.author.username,
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-secondary text-sm font-bold text-foreground", children: ((_a2 = feed.author.username[0]) == null ? void 0 : _a2.toUpperCase()) ?? "?" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium w-14 text-center truncate", children: feed.author.username })
                    ]
                  },
                  feed.author.id.toString()
                );
              })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: viewerOpen && allFeeds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StoryViewer,
      {
        feeds: allFeeds,
        initialFeedIndex: Math.min(activeFeedIdx, allFeeds.length - 1),
        currentUserId,
        onClose: () => setViewerOpen(false)
      }
    ) })
  ] });
}
var DIALOG_NAME = "Dialog";
var [createDialogContext] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog$1 = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog$1.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal$1 = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeDialog, forceMount, children: reactExports.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children: child }) })) });
};
DialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay$1.displayName = OVERLAY_NAME;
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent$1.displayName = CONTENT_NAME;
var DialogContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a;
          event.preventDefault();
          (_a = context.triggerRef.current) == null ? void 0 : _a.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a, _b;
          (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a, _b;
          (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription$1.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    var _a;
    const describedById = (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog$1;
var Portal = DialogPortal$1;
var Overlay = DialogOverlay$1;
var Content = DialogContent$1;
var Title = DialogTitle$1;
var Description = DialogDescription$1;
var Close = DialogClose;
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
export {
  Dialog as D,
  Plus as P,
  StoriesCarousel as S,
  Trash2 as T,
  DialogContent as a,
  DialogHeader as b,
  DialogTitle as c,
  DialogFooter as d,
  DialogDescription as e
};
