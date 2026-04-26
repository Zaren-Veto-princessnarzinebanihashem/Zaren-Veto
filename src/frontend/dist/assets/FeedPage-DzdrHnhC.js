import { b as createLucideIcon, u as useNavigate, r as reactExports, a as useLanguage, j as jsxRuntimeExports, A as AnimatePresence, m as motion, S as Skeleton, d as useQueryClient, X, e as ue } from "./index-CRJrpZcN.js";
import { L as Layout, N as NotificationBell, i as isVerifiedUser, V as VerificationBadge, G as Globe, U as Users } from "./Layout-1CdJlI07.js";
import { S as StoriesCarousel, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogDescription, d as DialogFooter } from "./dialog-D19pj5Kn.js";
import { B as Button } from "./button-CbhMEDZc.js";
import { I as Input } from "./input-B9zHAdGN.js";
import { L as Label } from "./label-DFGhcx1o.js";
import { T as Textarea } from "./textarea-BZuuetXX.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery, V as Visibility, e as ReactionType, c as useMutation } from "./index-DSDpu3c4.js";
import { P as Plus } from "./plus-DoMiqqyF.js";
import { C as CircleAlert } from "./circle-alert-Dsezs321.js";
import { R as RefreshCw } from "./refresh-cw-DpJrYbhy.js";
import { M as MessageSquare } from "./message-square-CM4zgCA2.js";
import { L as Lock } from "./lock-CCCZokAW.js";
import { P as Pin, C as ChevronUp, a as ChevronDown, B as Bookmark, L as Link2 } from "./pin-Cq_ytgx9.js";
import { H as Heart } from "./heart-BMqGgTtN.js";
import { S as Share2 } from "./share-2-DCmKn8ch.js";
import { T as Trash2 } from "./trash-2-xqzJMx66.js";
import { F as Flag } from "./flag-BH4sm1X6.js";
import { S as Send } from "./send-BI4AjFm5.js";
import "./eye-Cocm2xDb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = createLucideIcon("bookmark-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 18v-2a4 4 0 0 0-4-4H4", key: "5vmcpk" }],
  ["path", { d: "m9 17-5-5 5-5", key: "nvlc11" }]
];
const Reply = createLucideIcon("reply", __iconNode);
function renderPostContent(content) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = Array.from(
    content.matchAll(new RegExp(urlRegex.source, "g"))
  );
  if (matches.length === 0) return content;
  const segments = [];
  let lastIndex = 0;
  for (const match of matches) {
    const url = match[0];
    const start = match.index ?? 0;
    const before = content.slice(lastIndex, start);
    if (before) segments.push(before);
    segments.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-[#1877F2] underline hover:text-blue-400 break-all",
          onClick: (e) => e.stopPropagation(),
          children: url
        },
        start
      )
    );
    lastIndex = start + url.length;
  }
  const tail = content.slice(lastIndex);
  if (tail) segments.push(tail);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: segments });
}
function formatRelativeTime(timestamp) {
  const ms = Number(timestamp) / 1e6;
  const diffMs = Date.now() - ms;
  const diffSec = Math.floor(diffMs / 1e3);
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return new Date(ms).toLocaleDateString();
}
const MAX_CHARS = 500;
const PAGE_SIZE = 10;
const REACTIONS = [
  { type: ReactionType.love, emoji: "❤️", labelKey: "reactionHeart" },
  { type: ReactionType.haha, emoji: "😂", labelKey: "reactionHaha" },
  { type: ReactionType.wow, emoji: "😮", labelKey: "reactionWow" },
  { type: ReactionType.sad, emoji: "😢", labelKey: "reactionSad" },
  { type: ReactionType.angry, emoji: "😡", labelKey: "reactionAngry" }
];
function useFeed() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
}
function useCreatePost() {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async ({
      content,
      visibility,
      pollQuestion,
      pollOptions
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createPost(content, visibility, [], null);
      if (!result || result.__kind__ === "err") {
        throw new Error(
          result && "err" in result ? result.err : t.failedToPublishPost
        );
      }
      const postId = result.ok;
      if (pollQuestion && pollOptions && pollOptions.length >= 2) {
        try {
          await actor.createPoll(postId, pollQuestion, pollOptions);
        } catch {
        }
      }
      return postId;
    },
    onSuccess: () => {
      setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["feed"] });
      }, 0);
      ue.success(t.postPublished);
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : t.failedToPublishPost;
      ue.error(msg);
    }
  });
}
function useEditPost() {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async ({
      postId,
      content
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.editPost(postId, content);
      if (result === false) throw new Error(t.failedToUpdatePost);
      return result;
    },
    onSuccess: () => {
      setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["feed"] });
      }, 0);
      ue.success(t.postUpdated);
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : t.failedToUpdatePost;
      ue.error(msg);
    }
  });
}
function useDeletePost() {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async (postId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["feed"] });
      }, 0);
      ue.success(t.postDeleted);
    },
    onError: () => ue.error(t.failedToDeletePost)
  });
}
function useNotifications() {
  const { actor, isFetching } = useAuthenticatedBackend();
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4,
    refetchInterval: 3e4
  });
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getUnreadCount();
      return Number(count);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
  return { notifications, unreadCount };
}
function useVotePoll(pollId) {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (optionId) => {
      if (!actor) throw new Error("Not connected");
      return actor.votePoll(pollId, optionId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["pollResults", pollId.toString()]
      });
    }
  });
}
function PostPollDisplay({
  postId,
  postIdStr
}) {
  const { actor, isFetching } = useAuthenticatedBackend();
  const { data: results, isLoading } = useQuery({
    queryKey: ["pollResults", postIdStr],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPollResults(postId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
  const voteMutation = useVotePoll(postId);
  if (isLoading || !results || results.options.length === 0) return null;
  const hasVoted = results.myVote !== void 0 && results.myVote !== null;
  const total = Number(results.totalVotes);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mt-3 bg-secondary/50 border border-border rounded-xl p-4 space-y-3",
      "data-ocid": `poll-display-${postIdStr}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3.5 h-3.5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            total,
            " ",
            total === 1 ? "vote" : "votes"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: results.options.map((opt) => {
          const isMyVote = hasVoted && results.myVote === opt.id;
          const pct = total > 0 ? Math.round(Number(opt.votes) / total * 100) : 0;
          return hasVoted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `font-medium ${isMyVote ? "text-primary" : "text-foreground"}`,
                  children: [
                    opt.text,
                    isMyVote && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-1.5 text-[10px] text-primary font-semibold", children: "✓" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-muted-foreground", children: [
                pct,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full rounded-full transition-all duration-500 ${isMyVote ? "bg-primary" : "bg-muted-foreground/40"}`,
                style: { width: `${pct}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground tabular-nums", children: [
              Number(opt.votes),
              " votes"
            ] })
          ] }, opt.id.toString()) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => voteMutation.mutate(opt.id),
              disabled: voteMutation.isPending,
              className: "w-full text-start px-3 py-2.5 rounded-lg border border-border text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-smooth disabled:opacity-60",
              "data-ocid": `poll-vote-${postIdStr}-${opt.id.toString()}`,
              children: opt.text
            },
            opt.id.toString()
          );
        }) })
      ]
    }
  );
}
function RegistrationForm() {
  const { register, isRegistering, registerError } = useCurrentUser();
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const qc = useQueryClient();
  const { t } = useLanguage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      ue.error(t.usernameRequired2);
      return;
    }
    try {
      await register({ username: username.trim(), bio: bio.trim() });
      ue.success(t.welcomeToast);
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    } catch {
      ue.error(t.registrationFailed);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[calc(100vh-4rem)] flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "w-full max-w-md",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground mb-2", children: t.createYourProfile }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-8", children: t.createProfileSubtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => void handleSubmit(e), className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-username", className: "text-sm font-medium", children: [
              t.username,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "reg-username",
                placeholder: t.usernamePlaceholder,
                value: username,
                onChange: (e) => setUsername(e.target.value),
                disabled: isRegistering,
                maxLength: 32,
                required: true,
                "data-ocid": "register-username",
                className: "bg-secondary border-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "reg-bio", className: "text-sm font-medium", children: [
              t.bio,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: t.bioOptional })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "reg-bio",
                placeholder: t.bioPlaceholder,
                value: bio,
                onChange: (e) => setBio(e.target.value),
                disabled: isRegistering,
                rows: 3,
                maxLength: 280,
                "data-ocid": "register-bio",
                className: "bg-secondary border-input resize-none"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
              bio.length,
              "/280"
            ] })
          ] }),
          registerError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: registerError.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isRegistering || !username.trim(),
              className: "w-full h-11",
              "data-ocid": "register-submit",
              children: isRegistering ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                t.joiningLabel
              ] }) : t.joinButton
            }
          )
        ] })
      ] })
    }
  ) });
}
function FeedSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: ["sk1", "sk2", "sk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-5 space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-20" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded-lg" })
        ] })
      ]
    },
    k
  )) });
}
function VisibilityToggle({
  value,
  onChange
}) {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex rounded-lg border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Post visibility" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(Visibility.everyone),
        className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-smooth ${value === Visibility.everyone ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
        "data-ocid": "visibility-everyone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
          t.everyone
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(Visibility.followersOnly),
        className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-smooth ${value === Visibility.followersOnly ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
        "data-ocid": "visibility-followers",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
          t.followersOnly
        ]
      }
    )
  ] });
}
function CreatePostForm() {
  const [content, setContent] = reactExports.useState("");
  const [visibility, setVisibility] = reactExports.useState(Visibility.everyone);
  const [expanded, setExpanded] = reactExports.useState(false);
  const [showPollEditor, setShowPollEditor] = reactExports.useState(false);
  const [pollQuestion, setPollQuestion] = reactExports.useState("");
  const [pollOptions, setPollOptions] = reactExports.useState([
    { id: "opt-0", value: "" },
    { id: "opt-1", value: "" }
  ]);
  const textareaRef = reactExports.useRef(null);
  const createPost = useCreatePost();
  const { t } = useLanguage();
  const charsLeft = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;
  const isEmpty = !content.trim();
  const addPollOption = () => {
    if (pollOptions.length < 4)
      setPollOptions((prev) => [
        ...prev,
        { id: `opt-${prev.length}`, value: "" }
      ]);
  };
  const updatePollOption = (idx, val) => {
    setPollOptions(
      (prev) => prev.map((o, i) => i === idx ? { ...o, value: val } : o)
    );
  };
  const removePollEditor = () => {
    setShowPollEditor(false);
    setPollQuestion("");
    setPollOptions([
      { id: "opt-0", value: "" },
      { id: "opt-1", value: "" }
    ]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty || isOverLimit || createPost.isPending) return;
    const hasPoll = showPollEditor && pollQuestion.trim() && pollOptions.filter((o) => o.value.trim()).length >= 2;
    try {
      await createPost.mutateAsync({
        content: content.trim(),
        visibility,
        pollQuestion: hasPoll ? pollQuestion.trim() : void 0,
        pollOptions: hasPoll ? pollOptions.filter((o) => o.value.trim()).map((o) => o.value.trim()) : void 0
      });
      setContent("");
      setExpanded(false);
      removePollEditor();
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "bg-card border border-border rounded-xl p-5 shadow-sm",
      "data-ocid": "create-post-form",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => void handleSubmit(e), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            ref: textareaRef,
            placeholder: t.whatsOnYourMind,
            value: content,
            onChange: (e) => setContent(e.target.value),
            onFocus: () => setExpanded(true),
            rows: expanded ? 4 : 2,
            maxLength: MAX_CHARS + 50,
            disabled: createPost.isPending,
            "data-ocid": "post-content-input",
            className: "bg-secondary border-input resize-none transition-smooth text-sm leading-relaxed"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && showPollEditor && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "overflow-hidden mt-3",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/60 border border-border rounded-xl p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-4 h-4 text-primary" }),
                  t.pollQuestion ?? "Poll Question"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: removePollEditor,
                    className: "w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: t.pollQuestionPlaceholder ?? "Ask a question…",
                  value: pollQuestion,
                  onChange: (e) => setPollQuestion(e.target.value),
                  className: "bg-card border-input text-sm h-9",
                  "data-ocid": "poll-question-input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pollOptions.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: `${t.pollOption ?? "Option"} ${idx + 1}`,
                  value: opt.value,
                  onChange: (e) => updatePollOption(idx, e.target.value),
                  className: "bg-card border-input text-sm h-9",
                  "data-ocid": `poll-option-input-${idx + 1}`
                },
                opt.id
              )) }),
              pollOptions.length < 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: addPollOption,
                  className: "flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-smooth",
                  "data-ocid": "poll-add-option",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                    t.addPollOption ?? "Add option"
                  ]
                }
              )
            ] })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3 pt-3 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  VisibilityToggle,
                  {
                    value: visibility,
                    onChange: setVisibility
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPollEditor((v) => !v),
                    className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-smooth ${showPollEditor ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
                    "data-ocid": "add-poll-button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3.5 h-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.addPoll ?? "Poll" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-mono tabular-nums ${isOverLimit ? "text-destructive" : charsLeft <= 50 ? "text-yellow-500" : "text-muted-foreground"}`,
                    "aria-live": "polite",
                    children: charsLeft
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => {
                      setExpanded(false);
                      setContent("");
                      removePollEditor();
                    },
                    className: "h-8 px-2 text-muted-foreground hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    disabled: isEmpty || isOverLimit || createPost.isPending,
                    className: "h-8 px-4",
                    "data-ocid": "post-submit",
                    children: createPost.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                      t.publishing
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                      t.publish
                    ] })
                  }
                )
              ] })
            ] })
          }
        ) })
      ] })
    }
  );
}
function CommentItem({
  comment,
  depth = 0
}) {
  var _a;
  const { t } = useLanguage();
  const [showReply, setShowReply] = reactExports.useState(false);
  const [replyText, setReplyText] = reactExports.useState("");
  const handleReply = async () => {
    if (!replyText.trim()) return;
    ue.success(t.postComment);
    setReplyText("");
    setShowReply(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${depth > 0 ? "ms-8 border-s border-border ps-3" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-xs font-semibold text-foreground", children: ((_a = comment.authorName[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary rounded-xl px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center text-xs font-semibold text-foreground",
            style: { gap: "2px" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: comment.authorName }),
              isVerifiedUser(comment.authorName) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed break-words", children: comment.content })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: formatRelativeTime(comment.createdAt) }),
        depth === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowReply(!showReply),
            className: "text-[10px] text-muted-foreground hover:text-foreground font-medium transition-smooth flex items-center gap-1",
            "data-ocid": `reply-toggle-${comment.id.toString()}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "w-3 h-3" }),
              t.replyTo
            ]
          }
        )
      ] }),
      showReply && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: replyText,
            onChange: (e) => setReplyText(e.target.value),
            placeholder: `${t.replyTo} ${comment.authorName}…`,
            className: "h-8 text-xs bg-secondary border-input",
            "data-ocid": `reply-input-${comment.id.toString()}`,
            onKeyDown: (e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleReply();
              }
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: "h-8 px-3",
            onClick: () => void handleReply(),
            disabled: !replyText.trim(),
            "data-ocid": `reply-send-${comment.id.toString()}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3" })
          }
        )
      ] })
    ] })
  ] }) });
}
function CommentSection({
  postId,
  postIdStr
}) {
  const { t, isRTL: isRtl } = useLanguage();
  const [commentText, setCommentText] = reactExports.useState("");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const { actor, isFetching } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { data: comments = [] } = useQuery({
    queryKey: ["comments", postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(postId);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15e3
  });
  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text || !actor || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await actor.addComment(postId, text);
      void qc.invalidateQueries({ queryKey: ["comments", postId.toString()] });
      void qc.invalidateQueries({ queryKey: ["feed"] });
      ue.success(t.postComment);
      setCommentText("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.failedToPublishPost;
      ue.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mt-3 pt-3 border-t border-border",
      dir: isRtl ? "rtl" : "ltr",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: commentText,
                onChange: (e) => setCommentText(e.target.value),
                placeholder: t.addComment,
                className: "h-10 sm:h-8 text-sm sm:text-xs bg-secondary border-input flex-1",
                "data-ocid": `comment-input-${postIdStr}`,
                disabled: isSubmitting,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleAddComment();
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "h-8 px-3 shrink-0",
                onClick: () => void handleAddComment(),
                disabled: !commentText.trim() || isSubmitting,
                "data-ocid": `comment-send-${postIdStr}`,
                children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: comments.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CommentItem, { comment: c, postId }, c.id.toString())) })
      ]
    }
  );
}
function ReactionPicker({
  onReact,
  currentReaction,
  postIdStr
}) {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.85, y: 8 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.85, y: 8 },
      transition: { duration: 0.15 },
      className: "absolute bottom-full mb-2 start-0 bg-card border border-border rounded-2xl shadow-xl p-1.5 flex gap-1 z-30 max-w-[calc(100vw-2rem)]",
      "data-ocid": `reaction-picker-${postIdStr}`,
      children: REACTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onReact(r.type),
          title: t[r.labelKey],
          className: `w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-smooth hover:scale-125 hover:bg-secondary ${currentReaction === r.type ? "bg-primary/20 ring-1 ring-primary/50 scale-110" : ""}`,
          "data-ocid": `react-${r.type}-${postIdStr}`,
          children: r.emoji
        },
        r.type
      ))
    }
  );
}
function ShareDropdown({
  postIdStr,
  onShare,
  onClose
}) {
  const { t } = useLanguage();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  const postUrl = `${window.location.origin}/post/${postIdStr}`;
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Zaren Veto",
          url: postUrl
        });
      } catch {
      }
    }
    onClose();
  };
  const handleCopyLink = () => {
    var _a;
    const doCopy = () => {
      try {
        const el = document.createElement("textarea");
        el.value = postUrl;
        el.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        ue.success(t.linkCopied);
      } catch {
        ue.error(t.actionFailed);
      }
    };
    if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
      navigator.clipboard.writeText(postUrl).then(() => ue.success(t.linkCopied)).catch(doCopy);
    } else {
      doCopy();
    }
    onClose();
  };
  const encodedUrl = encodeURIComponent(postUrl);
  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  if (hasNativeShare) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        ref,
        initial: { opacity: 0, scale: 0.9, y: -4 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -4 },
        transition: { duration: 0.12 },
        className: "absolute bottom-full mb-2 end-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-30 w-48",
        "data-ocid": `share-dropdown-${postIdStr}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth",
              onClick: () => void handleNativeShare(),
              "aria-label": "Share this post",
              "data-ocid": `share-native-${postIdStr}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4 text-muted-foreground" }),
                t.share
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border",
              onClick: handleCopyLink,
              "aria-label": "Copy link",
              "data-ocid": `copy-link-${postIdStr}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4 text-muted-foreground" }),
                t.copyLink
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      ref,
      initial: { opacity: 0, scale: 0.9, y: -4 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: -4 },
      transition: { duration: 0.12 },
      className: "absolute bottom-full mb-2 end-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-30 w-52",
      "data-ocid": `share-dropdown-${postIdStr}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth",
            onClick: () => {
              onShare();
              onClose();
            },
            "aria-label": "Share to feed",
            "data-ocid": `share-to-feed-${postIdStr}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4 text-muted-foreground" }),
              t.shareToFeed
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `https://wa.me/?text=${encodedUrl}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border",
            "aria-label": "Share on WhatsApp",
            "data-ocid": `share-whatsapp-${postIdStr}`,
            onClick: onClose,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 text-[#25D366] flex items-center justify-center font-bold text-xs", children: "W" }),
              "WhatsApp"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `https://t.me/share/url?url=${encodedUrl}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border",
            "aria-label": "Share on Telegram",
            "data-ocid": `share-telegram-${postIdStr}`,
            onClick: onClose,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 text-[#229ED9] flex items-center justify-center font-bold text-xs", children: "T" }),
              "Telegram"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border",
            onClick: handleCopyLink,
            "aria-label": "Copy link",
            "data-ocid": `copy-link-${postIdStr}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4 text-muted-foreground" }),
              t.copyLink
            ]
          }
        )
      ]
    }
  );
}
function PostOptionsMenu({
  postIdStr,
  isOwner,
  isSaved,
  isPinned,
  onEdit,
  onDelete,
  onSave,
  onReport,
  onPin,
  onUnpin,
  onClose
}) {
  const { t } = useLanguage();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      ref,
      initial: { opacity: 0, scale: 0.9, y: -4 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: -4 },
      transition: { duration: 0.12 },
      className: "absolute top-8 end-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-30 w-48",
      "data-ocid": `post-menu-${postIdStr}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth",
            onClick: () => {
              onSave();
              onClose();
            },
            "data-ocid": `save-post-${postIdStr}`,
            children: isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "w-4 h-4 text-primary" }),
              t.unsavePost
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4 text-muted-foreground" }),
              t.savePost
            ] })
          }
        ),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border",
              onClick: () => {
                isPinned ? onUnpin() : onPin();
                onClose();
              },
              "data-ocid": `pin-post-menu-${postIdStr}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-4 h-4 text-muted-foreground" }),
                isPinned ? t.unpinPost ?? "Unpin post" : t.pinPost ?? "Pin post"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border",
              onClick: () => {
                onEdit();
                onClose();
              },
              "data-ocid": `edit-post-menu-${postIdStr}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4 text-muted-foreground" }),
                t.editPost
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-smooth border-t border-border",
              onClick: () => {
                onDelete();
                onClose();
              },
              "data-ocid": `delete-post-menu-${postIdStr}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
                t.deletePost
              ]
            }
          )
        ] }),
        !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-smooth border-t border-border",
            onClick: () => {
              onReport();
              onClose();
            },
            "data-ocid": `report-post-menu-${postIdStr}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4" }),
              t.reportPost
            ]
          }
        )
      ]
    }
  );
}
function ReportDialog({
  open,
  onClose,
  postIdStr
}) {
  const { t } = useLanguage();
  const [selected, setSelected] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const reasons = [
    { key: "spam", label: t.reportSpam },
    { key: "harassment", label: t.reportHarassment },
    { key: "hate_speech", label: t.reportHateSpeech },
    { key: "violence", label: t.reportViolence },
    { key: "misinformation", label: t.reportMisinformation },
    { key: "nudity", label: t.reportNudity },
    { key: "other", label: t.reportOther }
  ];
  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    ue.success(t.reportSubmitted);
    setSelected("");
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-sm",
      "data-ocid": `report-dialog-${postIdStr}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: t.reportTitle }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 py-2", children: reasons.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelected(r.key),
            className: `w-full text-start px-3 py-2.5 rounded-lg text-sm transition-smooth ${selected === r.key ? "bg-primary/15 text-foreground font-medium ring-1 ring-primary/40" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
            "data-ocid": `report-reason-${r.key}`,
            children: r.label
          },
          r.key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: onClose,
              "data-ocid": `report-cancel-${postIdStr}`,
              children: t.cancel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => void handleSubmit(),
              disabled: !selected || submitting,
              "data-ocid": `report-submit-${postIdStr}`,
              children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                t.saving
              ] }) : t.submitReport
            }
          )
        ] })
      ]
    }
  ) });
}
function PostCard({
  post,
  currentUserId,
  index
}) {
  var _a, _b, _c;
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editContent, setEditContent] = reactExports.useState(post.content);
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [showComments, setShowComments] = reactExports.useState(false);
  const [showReactionPicker, setShowReactionPicker] = reactExports.useState(false);
  const [showShareMenu, setShowShareMenu] = reactExports.useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = reactExports.useState(false);
  const [showReportDialog, setShowReportDialog] = reactExports.useState(false);
  const [isLiked, setIsLiked] = reactExports.useState(false);
  const [likeCount, setLikeCount] = reactExports.useState(0);
  const [isSaved, setIsSaved] = reactExports.useState(false);
  const [currentReaction, setCurrentReaction] = reactExports.useState(
    null
  );
  const { t, isRTL: isRtl } = useLanguage();
  const navigate = useNavigate();
  const editPost = useEditPost();
  const deletePost = useDeletePost();
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const postIdStr = post.id.toString();
  const isOwner = currentUserId !== void 0 && currentUserId === post.authorId.toString();
  const isEdited = post.updatedAt > post.createdAt;
  const isVerified = isVerifiedUser(post.authorName ?? "");
  const authorId = (_a = post.authorId) == null ? void 0 : _a.toString();
  const handleAuthorClick = () => {
    if (authorId) {
      void navigate({ to: "/profile/$userId", params: { userId: authorId } });
    }
  };
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await editPost.mutateAsync({
      postId: post.id,
      content: editContent.trim()
    });
    setIsEditing(false);
  };
  const handlePin = async () => {
    if (!actor) return;
    await actor.pinPost(post.id);
    void qc.invalidateQueries({ queryKey: ["feed"] });
    ue.success(t.postPinned ?? "Post pinned");
  };
  const handleUnpin = async () => {
    if (!actor) return;
    await actor.unpinPost();
    void qc.invalidateQueries({ queryKey: ["feed"] });
    ue.success(t.postUnpinned ?? "Post unpinned");
  };
  const handleLike = () => {
    if (!actor) return;
    const wasLiked = isLiked;
    setIsLiked((v) => !v);
    setLikeCount((c) => wasLiked ? Math.max(0, c - 1) : c + 1);
    const call = wasLiked ? actor.unlikePost(post.id) : actor.likePost(post.id);
    call.catch(() => {
      setIsLiked(wasLiked);
      setLikeCount((c) => wasLiked ? c + 1 : Math.max(0, c - 1));
      ue.error(t.failedToPublishPost);
    });
  };
  const handleReact = (type) => {
    if (!actor) return;
    const prev = currentReaction;
    const next = prev === type ? null : type;
    setCurrentReaction(next);
    setShowReactionPicker(false);
    const call = next === null ? actor.removeReaction(post.id) : actor.reactToPost(post.id, type);
    call.catch(() => {
      setCurrentReaction(prev);
      ue.error(t.failedToPublishPost);
    });
  };
  const handleSave = () => {
    setIsSaved((v) => !v);
    ue.success(isSaved ? t.unsavePost : t.savePost);
  };
  const handleShare = () => {
    ue.success(t.shareToFeed);
  };
  const reactionEmoji = currentReaction ? (_b = REACTIONS.find((r) => r.type === currentReaction)) == null ? void 0 : _b.emoji : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.article,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: index * 0.05 },
        className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth",
        "data-ocid": `post-card.item.${index + 1}`,
        dir: isRtl ? "rtl" : "ltr",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 sm:px-5 pt-3 sm:pt-5 pb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleAuthorClick,
                    className: "w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border text-sm font-bold text-foreground hover:opacity-80 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "aria-label": `View ${post.authorName}'s profile`,
                    "data-ocid": `post-author-avatar-${postIdStr}`,
                    children: ((_c = post.authorName[0]) == null ? void 0 : _c.toUpperCase()) ?? "?"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleAuthorClick,
                      className: "inline-flex items-center text-sm font-semibold text-foreground min-w-0 hover:text-primary transition-smooth focus-visible:outline-none",
                      style: { gap: "2px" },
                      "data-ocid": `post-author-name-${postIdStr}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: post.authorName }),
                        isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 16 })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatRelativeTime(post.createdAt) }),
                    isEdited && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
                      "· ",
                      t.edited
                    ] }),
                    post.visibility === Visibility.followersOnly ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 opacity-70", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }),
                      t.followers
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 opacity-60", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
                      t.everyone
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowOptionsMenu((v) => !v),
                    className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                    "aria-label": "Post options",
                    "data-ocid": `post-options-${postIdStr}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showOptionsMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  PostOptionsMenu,
                  {
                    postId: post.id,
                    postIdStr,
                    isOwner,
                    isSaved,
                    onEdit: () => setIsEditing(true),
                    onDelete: () => setShowDeleteDialog(true),
                    onSave: handleSave,
                    onReport: () => setShowReportDialog(true),
                    onPin: () => void handlePin(),
                    onUnpin: () => void handleUnpin(),
                    isPinned: post.isPinned,
                    onClose: () => setShowOptionsMenu(false)
                  }
                ) })
              ] })
            ] }),
            post.isPinned && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-2 -mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-3.5 h-3.5" }),
              t.pinnedPost ?? "Pinned Post"
            ] }),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: editContent,
                  onChange: (e) => setEditContent(e.target.value),
                  rows: 4,
                  maxLength: MAX_CHARS + 50,
                  autoFocus: true,
                  disabled: editPost.isPending,
                  "data-ocid": `edit-textarea-${postIdStr}`,
                  className: "bg-secondary border-input resize-none text-sm leading-relaxed"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono tabular-nums", children: [
                  MAX_CHARS - editContent.length,
                  " ",
                  t.remaining
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: () => {
                        setEditContent(post.content);
                        setIsEditing(false);
                      },
                      disabled: editPost.isPending,
                      className: "h-8",
                      "data-ocid": `cancel-edit-${postIdStr}`,
                      children: t.cancel
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: () => void handleSaveEdit(),
                      disabled: !editContent.trim() || editPost.isPending,
                      className: "h-8",
                      "data-ocid": `save-edit-${postIdStr}`,
                      children: editPost.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                        t.saving
                      ] }) : t.saveChanges
                    }
                  )
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-1", children: renderPostContent(post.content) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PostPollDisplay, { postId: post.id, postIdStr }),
            (isLiked || currentReaction) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2 mb-1", children: [
              isLiked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#E0245E] font-medium flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3 fill-[#E0245E]" }),
                likeCount
              ] }),
              currentReaction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: reactionEmoji })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 sm:px-4 py-2 border-t border-border/60 flex items-center gap-0.5 sm:gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleLike,
                className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${isLiked ? "text-[#E0245E]" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `like-btn-${postIdStr}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${isLiked ? "fill-[#E0245E]" : ""}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: isLiked ? t.liked : t.like }),
                  likeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: likeCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowReactionPicker((v) => !v),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${currentReaction ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
                  "data-ocid": `react-btn-${postIdStr}`,
                  children: [
                    reactionEmoji ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: reactionEmoji }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: "😊" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.react })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showReactionPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReactionPicker,
                {
                  onReact: handleReact,
                  currentReaction,
                  postIdStr
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowComments((v) => !v),
                className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${showComments ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `comment-btn-${postIdStr}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.comment }),
                  showComments ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative ms-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setShowShareMenu((v) => !v),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                  "data-ocid": `share-btn-${postIdStr}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.share })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showShareMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ShareDropdown,
                {
                  postIdStr,
                  onShare: handleShare,
                  onClose: () => setShowShareMenu(false)
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showComments && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              className: "overflow-hidden px-5 pb-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CommentSection, { postId: post.id, postIdStr })
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "delete-confirm-dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: t.deletePostTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground text-sm", children: t.deletePostDesc })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setShowDeleteDialog(false),
                disabled: deletePost.isPending,
                "data-ocid": "delete-cancel",
                children: t.cancel
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => {
                  deletePost.mutate(post.id);
                  setShowDeleteDialog(false);
                },
                disabled: deletePost.isPending,
                "data-ocid": "delete-confirm",
                children: deletePost.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" }),
                  t.deleting
                ] }) : t.deletePost
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReportDialog,
      {
        open: showReportDialog,
        onClose: () => setShowReportDialog(false),
        postIdStr
      }
    )
  ] });
}
function NotificationsPanel({
  notifications,
  onClose
}) {
  const { t, isRTL: isRtl } = useLanguage();
  const getNotifText = (n) => {
    const kind = n.notifType.__kind__;
    const map = {
      like: t.notifLiked,
      comment: t.notifCommented,
      follow: t.notifFollowed,
      mention: t.notifMentioned,
      share: t.notifShared,
      reaction: t.notifLiked,
      friendRequest: t.notifFollowed,
      verified: t.verifiedAccount
    };
    return map[kind] ?? kind;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: isRtl ? -20 : 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: isRtl ? -20 : 20 },
      transition: { duration: 0.25 },
      className: "fixed inset-y-0 end-0 w-full sm:w-96 bg-card border-s border-border shadow-2xl z-50 flex flex-col",
      "data-ocid": "notifications-panel",
      dir: isRtl ? "rtl" : "ltr",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: t.notificationsTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-7 px-2 text-xs text-muted-foreground hover:text-foreground",
                "data-ocid": "mark-all-read",
                children: t.markAllRead
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                "aria-label": "Close",
                "data-ocid": "notifications-close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full gap-3 p-8 text-center",
            "data-ocid": "notifications-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t.notificationsEmpty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: t.notificationsEmptyDesc })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: notifications.map((n, i) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-start gap-3 p-4 ${!n.isRead ? "bg-primary/5" : "hover:bg-secondary/50"} transition-smooth`,
              "data-ocid": `notification.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold text-foreground", children: ((_a = n.actorName[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: n.actorName }),
                    " ",
                    getNotifText(n)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatRelativeTime(n.createdAt) })
                ] }),
                !n.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" })
              ]
            },
            n.id.toString()
          );
        }) }) })
      ]
    }
  );
}
function Bell(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      ...props,
      role: "img",
      "aria-label": "Bell",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
      ]
    }
  );
}
function EmptyFeed() {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45 },
      className: "flex flex-col items-center justify-center py-20 px-6 text-center",
      "data-ocid": "feed-empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-7 h-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-2", children: t.feedIsQuiet }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs leading-relaxed", children: t.feedIsQuietDesc })
      ]
    }
  );
}
function ErrorState({ onRetry }) {
  const { t } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-3 py-10 text-center",
      "data-ocid": "feed-error_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-destructive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.couldNotLoadFeed }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: onRetry,
            className: "h-8 gap-1.5 text-muted-foreground hover:text-foreground",
            "data-ocid": "feed-retry",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
              t.tryAgain
            ]
          }
        )
      ]
    }
  );
}
function FeedPage() {
  var _a;
  const { status, profile } = useCurrentUser();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = reactExports.useState(PAGE_SIZE);
  const [showNotifications, setShowNotifications] = reactExports.useState(false);
  const { t, isRTL: isRtl } = useLanguage();
  const { data: posts, isLoading, isError, refetch } = useFeed();
  const { notifications, unreadCount } = useNotifications();
  reactExports.useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/login" });
    }
  }, [status, navigate]);
  if (status === "initializing")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}) });
  if (status === "registering")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { bare: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RegistrationForm, {}) });
  if (status === "unauthenticated") return null;
  const currentUserId = (_a = profile == null ? void 0 : profile.id) == null ? void 0 : _a.toString();
  const visiblePosts = (posts ?? []).slice(0, visibleCount);
  const hasMore = ((posts == null ? void 0 : posts.length) ?? 0) > visibleCount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto space-y-5",
        "data-ocid": "feed-page",
        dir: isRtl ? "rtl" : "ltr",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: t.yourFeed }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              !isLoading && posts && posts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                posts.length,
                " ",
                posts.length !== 1 ? t.posts : t.post
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                NotificationBell,
                {
                  unreadCount,
                  onClick: () => setShowNotifications(true)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StoriesCarousel,
            {
              currentUserId,
              onCreateStory: () => void navigate({ to: "/stories" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreatePostForm, {}),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}),
          isError && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { onRetry: () => void refetch() }),
          !isLoading && !isError && posts && posts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyFeed, {}),
          !isLoading && !isError && visiblePosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "feed-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visiblePosts.map((post, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              PostCard,
              {
                post,
                currentUserId,
                index
              },
              post.id.toString()
            )) }),
            hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "flex justify-center pt-2",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setVisibleCount((c) => c + PAGE_SIZE),
                    className: "h-9 px-6 border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-smooth",
                    "data-ocid": "load-more",
                    children: t.loadMorePosts
                  }
                )
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showNotifications && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-background/60 backdrop-blur-sm z-40",
          onClick: () => setShowNotifications(false),
          "data-ocid": "notifications-overlay"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NotificationsPanel,
        {
          notifications,
          onClose: () => setShowNotifications(false)
        }
      )
    ] }) })
  ] });
}
export {
  FeedPage as default
};
