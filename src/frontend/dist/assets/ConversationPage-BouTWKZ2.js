import { b as createLucideIcon, u as useNavigate, f as useParams, d as useQueryClient, r as reactExports, P as Principal, j as jsxRuntimeExports, S as Skeleton, e as ue, A as AnimatePresence, m as motion } from "./index-CvIOltKC.js";
import { L as Layout, i as isVerifiedUser, V as VerificationBadge } from "./Layout-B9hj0KjP.js";
import { B as Badge } from "./badge-BaEGFVw6.js";
import { B as Button } from "./button-D8P5m97v.js";
import { T as Textarea } from "./textarea-CtAPxEeQ.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery, c as useMutation } from "./index-jDDIPp20.js";
import { A as ArrowLeft } from "./arrow-left-z1ZYzBE8.js";
import { S as ShieldCheck } from "./shield-check-B00LTCHV.js";
import { L as Lock } from "./lock-DxaJhVmU.js";
import { S as Send } from "./send-DOlGNUpF.js";
import { C as Check } from "./check-ISwKLAqX.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode);
function encodeMessage(text) {
  return new TextEncoder().encode(text);
}
function decodeMessage(data) {
  try {
    return new TextDecoder("utf-8").decode(data);
  } catch {
    return "[unable to decode]";
  }
}
function formatTime(ts) {
  const ms = Number(ts / 1000000n);
  if (ms === 0) return "";
  try {
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return "";
  }
}
const MSG_REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍"];
function MessageBubble({
  msg,
  isSent,
  onReact
}) {
  const [showReactions, setShowReactions] = reactExports.useState(false);
  const text = decodeMessage(msg.encryptedContent);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `flex ${isSent ? "justify-end" : "justify-start"} group relative`,
      "data-ocid": `message.item.${msg.id.toString()}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 max-w-[85%] sm:max-w-[72%]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `relative min-w-[80px] rounded-2xl px-3 sm:px-4 py-2.5 shadow-sm cursor-pointer select-text ${isSent ? "bg-primary text-primary-foreground rounded-br-sm metallic-border" : "bg-card border border-border text-card-foreground rounded-bl-sm"}`,
            onDoubleClick: () => setShowReactions((v) => !v),
            onContextMenu: (e) => {
              e.preventDefault();
              setShowReactions((v) => !v);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed break-words", children: text }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-1 mt-1 ${isSent ? "justify-end" : "justify-start"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5 opacity-60" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-60", children: formatTime(msg.createdAt) }),
                    isSent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-0.5", children: msg.isRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3 h-3 opacity-70" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 opacity-40" }) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showReactions && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.85, y: 4 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.85, y: 4 },
            transition: { duration: 0.15 },
            className: `flex gap-1 bg-card border border-border rounded-2xl shadow-xl p-1.5 z-20 ${isSent ? "self-end" : "self-start"}`,
            "data-ocid": `message.reaction_picker.${msg.id.toString()}`,
            children: [
              MSG_REACTIONS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    onReact(msg.id, emoji);
                    setShowReactions(false);
                  },
                  className: "w-8 h-8 rounded-xl flex items-center justify-center text-base hover:scale-125 hover:bg-secondary transition-smooth",
                  "aria-label": emoji,
                  children: emoji
                },
                emoji
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowReactions(false),
                  className: "w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth text-xs font-bold",
                  "aria-label": "Close",
                  children: "✕"
                }
              )
            ]
          }
        ) })
      ] })
    }
  );
}
function ConversationPage() {
  var _a;
  const { status, profile } = useCurrentUser();
  const navigate = useNavigate();
  const { userId } = useParams({ strict: false });
  const { actor, isFetching } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const [draft, setDraft] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const textareaRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  let otherUserPrincipal = null;
  try {
    otherUserPrincipal = Principal.fromText(userId);
  } catch {
    otherUserPrincipal = null;
  }
  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ["messages", userId],
    queryFn: async () => {
      if (!actor || !otherUserPrincipal) return [];
      return actor.getMessages(otherUserPrincipal);
    },
    enabled: !!actor && !isFetching && !!otherUserPrincipal,
    refetchInterval: 5e3
  });
  const { data: otherProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!actor || !otherUserPrincipal) return null;
      return actor.getUserProfile(otherUserPrincipal);
    },
    enabled: !!actor && !isFetching && !!otherUserPrincipal
  });
  reactExports.useEffect(() => {
    var _a2;
    if (!messages || !actor) return;
    const myId2 = (_a2 = profile == null ? void 0 : profile.id) == null ? void 0 : _a2.toString();
    const unread = messages.filter(
      (m) => !m.isRead && m.senderId.toString() !== myId2
    );
    for (const m of unread) {
      void actor.markMessageRead(m.id);
    }
  }, [messages, actor, profile]);
  reactExports.useEffect(() => {
    var _a2;
    if (messages) {
      (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const sendMutation = useMutation({
    mutationFn: async (text) => {
      if (!actor || !otherUserPrincipal) throw new Error("Not connected");
      const encoded = encodeMessage(text);
      return actor.sendMessage(otherUserPrincipal, encoded);
    },
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({ queryKey: ["messages", userId] });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setTimeout(() => {
        var _a2;
        (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: () => {
      ue.error("Failed to send message. Please try again.");
    }
  });
  const handleReact = async (messageId, emoji) => {
    if (!actor) return;
    const emojiToType = {
      "❤️": "love",
      "😂": "haha",
      "😮": "wow",
      "😢": "sad",
      "😡": "angry",
      "👍": "like"
    };
    const reactionType = emojiToType[emoji] ?? "like";
    try {
      await actor.reactToMessage(
        messageId,
        reactionType
      );
      void queryClient.invalidateQueries({ queryKey: ["messages", userId] });
    } catch {
      ue.error("Failed to react");
    }
  };
  const handleSend = () => {
    const text = draft.trim();
    if (!text || sendMutation.isPending) return;
    sendMutation.mutate(text);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[70vh] w-full rounded-xl" }) });
  }
  if (status === "unauthenticated") return null;
  const displayName = (otherProfile == null ? void 0 : otherProfile.username) ? `@${otherProfile.username}` : `@${userId.slice(0, 8)}…`;
  const msgList = messages ?? [];
  const myId = (_a = profile == null ? void 0 : profile.id) == null ? void 0 : _a.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto flex flex-col",
      style: { height: "calc(100dvh - 3.5rem)" },
      "data-ocid": "conversation-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 pb-3 border-b border-border shrink-0 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "back-to-messages",
              variant: "ghost",
              size: "icon",
              onClick: () => void navigate({ to: "/messages" }),
              className: "shrink-0 w-10 h-10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-base text-foreground uppercase", children: ((otherProfile == null ? void 0 : otherProfile.username) ?? userId).charAt(0) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h2",
              {
                className: "flex items-center font-semibold text-foreground min-w-0 text-sm sm:text-base",
                style: { gap: "2px" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: displayName }),
                  (otherProfile == null ? void 0 : otherProfile.username) && isVerifiedUser(
                    otherProfile.username,
                    otherProfile.isVerified
                  ) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 16 })
                ]
              }
            ),
            (otherProfile == null ? void 0 : otherProfile.bio) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: otherProfile.bio })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              "data-ocid": "encryption-badge",
              variant: "outline",
              className: "text-primary border-primary/30 bg-primary/10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs font-medium hidden xs:inline", children: "End-to-End" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "message-thread",
            className: "flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin overscroll-contain",
            children: [
              msgsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["m1", "m2", "m3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-3/5 rounded-2xl" }, k)) }) : msgList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "empty-messages",
                  className: "flex flex-col items-center justify-center h-full text-center py-16",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-7 h-7 text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-2", children: "No messages yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground max-w-xs", children: [
                      "Send a message to start your encrypted conversation with",
                      " ",
                      displayName,
                      "."
                    ] })
                  ]
                }
              ) : msgList.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                MessageBubble,
                {
                  msg,
                  isSent: msg.senderId.toString() === myId,
                  onReact: handleReact
                },
                msg.id.toString()
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "send-message-form",
            className: "pt-3 border-t border-border shrink-0",
            style: { paddingBottom: "env(safe-area-inset-bottom)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 sm:gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      ref: textareaRef,
                      "data-ocid": "message-input",
                      value: draft,
                      onChange: (e) => setDraft(e.target.value),
                      onKeyDown: handleKeyDown,
                      placeholder: "Type a message…",
                      rows: 1,
                      className: "resize-none bg-card border-border focus:border-primary/60 focus:ring-primary/20 min-h-[44px] max-h-32 overflow-y-auto pr-4",
                      style: { fieldSizing: "content" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 bottom-2.5 flex items-center gap-1 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 text-muted-foreground opacity-60" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "send-message-btn",
                    onClick: handleSend,
                    disabled: !draft.trim() || sendMutation.isPending,
                    className: "shrink-0 h-11 w-11 sm:w-auto sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 metallic-border transition-smooth rounded-xl",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only sm:not-sr-only sm:ml-1", children: "Send" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3 h-3 text-primary/70" }),
                "Encrypted — only you and ",
                displayName,
                " can read. Double-tap a message to react."
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
export {
  ConversationPage as default
};
