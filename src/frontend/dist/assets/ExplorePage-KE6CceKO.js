import { b as createLucideIcon, a as useLanguage, r as reactExports, j as jsxRuntimeExports, X, S as Skeleton, m as motion, A as AnimatePresence, u as useNavigate } from "./index-CinqF2FC.js";
import { L as Layout, C as Compass, S as Search, g as User, V as VerificationBadge } from "./Layout-B_cAPpUr.js";
import { B as Button } from "./button-CFWNxzA7.js";
import { I as Input } from "./input-Bc61c2Ky.js";
import { a as useAuthenticatedBackend, b as useQuery } from "./index-DXe1TNIQ.js";
import { U as UserCheck } from "./user-check-B_imVyPi.js";
import { H as Heart } from "./heart-BNZdwbhC.js";
import { M as MessageSquare } from "./message-square-B189Vqel.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function useTrendingHashtags() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["trendingHashtags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingHashtags();
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useHashtagPosts(hashtag) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["hashtagPosts", hashtag],
    queryFn: async () => {
      if (!actor || !hashtag) return [];
      return actor.getHashtagPosts(hashtag);
    },
    enabled: !!actor && !isFetching && !!hashtag,
    staleTime: 3e4
  });
}
function useSearchContent(query) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return { users: [], posts: [] };
      return actor.searchContent(query.trim());
    },
    enabled: !!actor && !isFetching && query.trim().length >= 2,
    staleTime: 15e3
  });
}
function formatCount(n) {
  const num = Number(n);
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return String(num);
}
function HashtagPill({
  stat,
  index,
  isActive,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: index * 0.04, duration: 0.25 },
      onClick,
      "data-ocid": `hashtag-pill.item.${index + 1}`,
      className: `flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 border ${isActive ? "bg-[#1877F2] border-[#1877F2] text-white shadow-md shadow-[#1877F2]/30" : "bg-card border-border text-foreground hover:border-[#1877F2]/50 hover:bg-secondary"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-3.5 h-3.5 opacity-70 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[120px]", children: stat.hashtag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-[#1877F2]/15 text-[#1877F2]"}`,
            children: formatCount(stat.postCount)
          }
        )
      ]
    }
  );
}
function PostGridCell({
  post,
  index,
  onClick
}) {
  const [hovered, setHovered] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: index * 0.04, duration: 0.3 },
      className: "relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-card border border-border",
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onClick,
      "data-ocid": `post-grid.item.${index + 1}`,
      children: [
        post.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.imageUrl,
            alt: `Post by ${post.authorName}`,
            className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-secondary p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-4 text-center leading-relaxed", children: post.content }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hovered && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.15 },
            className: "absolute inset-0 bg-black/50 flex items-center justify-center gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-white font-semibold text-sm drop-shadow", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 fill-white" }),
                formatCount(post.isPinned ? 0n : 0n)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-white font-semibold text-sm drop-shadow", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5 fill-white" }),
                formatCount(0n)
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
function UserCard({
  user,
  index
}) {
  var _a;
  const navigate = useNavigate();
  const [followed, setFollowed] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.06, duration: 0.3 },
      className: "flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-[#1877F2]/30 transition-all duration-200",
      "data-ocid": `user-card.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "shrink-0 relative",
            onClick: () => void navigate({ to: `/profile/${user.id.toText()}` }),
            "aria-label": `View profile of ${user.username}`,
            "data-ocid": `user-avatar.item.${index + 1}`,
            children: user.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: user.profilePhotoUrl,
                alt: user.username,
                className: "w-14 h-14 rounded-full object-cover border-2 border-border"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-lg font-bold text-foreground", children: ((_a = user.username[0]) == null ? void 0 : _a.toUpperCase()) ?? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-6 h-6" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => void navigate({ to: `/profile/${user.id.toText()}` }),
                className: "font-semibold text-sm text-foreground truncate hover:underline underline-offset-2",
                children: user.username
              }
            ),
            user.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
          ] }),
          user.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5 leading-snug", children: user.bio }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
            formatCount(user.followerCount),
            " followers"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: followed ? "outline" : "default",
            onClick: () => setFollowed((v) => !v),
            className: "shrink-0 h-8 px-3 text-xs gap-1.5",
            "data-ocid": `follow-button.item.${index + 1}`,
            children: followed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5" }),
              "Following"
            ] }) : "Follow"
          }
        )
      ]
    }
  );
}
function PostModal({
  post,
  onClose
}) {
  var _a;
  const [isLiked, setIsLiked] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      "data-ocid": "post-modal.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          transition: { type: "spring", duration: 0.35 },
          className: "bg-card border border-border rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground border border-border", children: ((_a = post.authorName[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: post.authorName }),
                  post.authorVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors",
                  "aria-label": "Close",
                  "data-ocid": "post-modal.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            post.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: post.imageUrl,
                alt: "Post",
                className: "w-full max-h-80 object-cover"
              }
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: post.content }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsLiked((v) => !v),
                  className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isLiked ? "text-[#E0245E] bg-[#E0245E]/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
                  "data-ocid": "post-modal.like_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${isLiked ? "fill-[#E0245E]" : ""}` }),
                    isLiked ? "Liked" : "Like"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
                  "data-ocid": "post-modal.comment_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
                    "Comment"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
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
  "104c"
];
const GRID_SKELETON_IDS = ["g1", "g2", "g3", "g4", "g5", "g6"];
function TrendingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: TRENDING_SKELETON_WIDTHS.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Skeleton,
    {
      className: "h-9 rounded-full",
      style: { width: `${Number.parseInt(id)}px` }
    },
    id
  )) });
}
function GridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: GRID_SKELETON_IDS.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-xl" }, id)) });
}
function ExplorePage() {
  const { t, isRTL } = useLanguage();
  const [rawQuery, setRawQuery] = reactExports.useState("");
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  const [activeHashtag, setActiveHashtag] = reactExports.useState(null);
  const [selectedPost, setSelectedPost] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const handleQueryChange = reactExports.useCallback((val) => {
    setRawQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(val), 300);
  }, []);
  reactExports.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );
  const isSearching = debouncedQuery.trim().length >= 2;
  const { data: trending, isLoading: trendingLoading } = useTrendingHashtags();
  const { data: hashtagPosts, isLoading: hashtagLoading } = useHashtagPosts(
    activeHashtag ?? ""
  );
  const { data: searchResults, isLoading: searchLoading } = useSearchContent(debouncedQuery);
  const handleHashtagClick = (tag) => {
    setActiveHashtag((prev) => prev === tag ? null : tag);
    setRawQuery("");
    setDebouncedQuery("");
  };
  const handleClearSearch = () => {
    var _a;
    setRawQuery("");
    setDebouncedQuery("");
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  };
  const displayTrending = trending && trending.length > 0 ? trending : [
    { hashtag: "ZarenVeto", postCount: 1240n },
    { hashtag: "privacy", postCount: 892n },
    { hashtag: "digital", postCount: 765n },
    { hashtag: "tech", postCount: 634n },
    { hashtag: "encrypted", postCount: 521n },
    { hashtag: "sovereign", postCount: 489n },
    { hashtag: "web3", postCount: 412n },
    { hashtag: "decentralized", postCount: 387n },
    { hashtag: "icp", postCount: 298n },
    { hashtag: "freedom", postCount: 201n }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto space-y-5",
        dir: isRTL ? "rtl" : "ltr",
        "data-ocid": "explore.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "w-5 h-5 text-[#1877F2]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground leading-tight", children: t.exploreTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t.exploreTypeToSearch })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "explore.search_input", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                ref: inputRef,
                value: rawQuery,
                onChange: (e) => handleQueryChange(e.target.value),
                placeholder: t.exploreSearchPlaceholder,
                className: "ps-10 pe-10 h-11 bg-card border-border focus:border-[#1877F2]/50 transition-colors text-sm",
                "data-ocid": "explore.search_input"
              }
            ),
            rawQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClearSearch,
                className: "absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors",
                "aria-label": "Clear search",
                "data-ocid": "explore.clear_search",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-muted-foreground" })
              }
            )
          ] }),
          isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", "data-ocid": "explore.search_results", children: searchLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 p-3 rounded-xl bg-card border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-14 h-14 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-40" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-lg" })
              ]
            },
            k
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            searchResults && searchResults.users.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "explore.users_section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-[#1877F2]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t.exploreUsers }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
                  searchResults.users.length,
                  " results"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: searchResults.users.slice(0, 6).map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                UserCard,
                {
                  user,
                  index: i
                },
                user.id.toText()
              )) })
            ] }),
            searchResults && searchResults.posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "explore.posts_section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 text-[#1877F2]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t.explorePosts }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
                  searchResults.posts.length,
                  " results"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
                  "data-ocid": "explore.posts_grid",
                  children: searchResults.posts.slice(0, 12).map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PostGridCell,
                    {
                      post,
                      index: i,
                      onClick: () => setSelectedPost(post)
                    },
                    post.id.toString()
                  ))
                }
              )
            ] }),
            searchResults && searchResults.users.length === 0 && searchResults.posts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-16 gap-3 text-center",
                "data-ocid": "explore.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-6 h-6 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t.exploreNoResults }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground max-w-xs", children: [
                    "No results found for “",
                    debouncedQuery,
                    "”"
                  ] })
                ]
              }
            )
          ] }) }),
          !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "explore.trending_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-[#1877F2]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: t.exploreTrendingHashtags }),
                activeHashtag && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setActiveHashtag(null),
                    className: "ms-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
                    "data-ocid": "explore.clear_hashtag",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
                      "Clear"
                    ]
                  }
                )
              ] }),
              trendingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingSkeleton, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-wrap gap-2",
                  "data-ocid": "explore.hashtags_list",
                  children: displayTrending.slice(0, 10).map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    HashtagPill,
                    {
                      stat,
                      index: i,
                      isActive: activeHashtag === stat.hashtag,
                      onClick: () => handleHashtagClick(stat.hashtag)
                    },
                    `hashtag-${stat.hashtag}`
                  ))
                }
              )
            ] }),
            activeHashtag && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "explore.hashtag_posts_section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-4 h-4 text-[#1877F2]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
                  "#",
                  activeHashtag
                ] })
              ] }),
              hashtagLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(GridSkeleton, {}) : hashtagPosts && hashtagPosts.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
                  "data-ocid": "explore.hashtag_posts_grid",
                  children: hashtagPosts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PostGridCell,
                    {
                      post,
                      index: i,
                      onClick: () => setSelectedPost(post)
                    },
                    post.id.toString()
                  ))
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-12 gap-3 text-center bg-card border border-border rounded-xl",
                  "data-ocid": "explore.hashtag_empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-8 h-8 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                      "No posts found for #",
                      activeHashtag
                    ] })
                  ]
                }
              )
            ] }),
            !activeHashtag && !trendingLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.3, duration: 0.4 },
                className: "flex flex-col items-center justify-center py-14 gap-3 text-center rounded-xl border border-dashed border-border bg-card/40",
                "data-ocid": "explore.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "w-7 h-7 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t.exploreTypeToSearch }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs leading-relaxed", children: t.exploreSearchPlaceholder })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedPost && /* @__PURE__ */ jsxRuntimeExports.jsx(
      PostModal,
      {
        post: selectedPost,
        onClose: () => setSelectedPost(null)
      }
    ) })
  ] });
}
export {
  ExplorePage as default
};
