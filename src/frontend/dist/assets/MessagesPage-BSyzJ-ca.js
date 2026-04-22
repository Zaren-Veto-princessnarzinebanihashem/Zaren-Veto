import { u as useNavigate, a as useLanguage, r as reactExports, j as jsxRuntimeExports, S as Skeleton, X } from "./index-Dk-qQMaL.js";
import { L as Layout, S as Search, i as isVerifiedUser, V as VerificationBadge } from "./Layout-BVCNofFM.js";
import { B as Badge } from "./badge-zkOQHpmk.js";
import { B as Button } from "./button-Cry3JQpz.js";
import { I as Input } from "./input-DdnjB3WP.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery } from "./index-BLH4z4M5.js";
import { S as ShieldCheck } from "./shield-check-mBeA4jvO.js";
import { M as MessageSquare } from "./message-square-kTWR77Xv.js";
import { L as Lock } from "./lock-4xpW9oFs.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-BnIgSvnz.js";
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  if (ms === 0) return "";
  try {
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return "";
  }
}
function ConversationCard({ conv }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userId = conv.otherUserId.toString();
  const preview = conv.lastMessagePreview || t.noMessagesYet;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "data-ocid": "conversation-card",
      onClick: () => void navigate({ to: `/messages/${userId}` }),
      className: "w-full text-left group",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-smooth cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-lg text-foreground uppercase", children: conv.otherUsername.charAt(0) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5 text-primary" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 font-semibold text-foreground min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "inline-flex items-center min-w-0",
                style: { gap: "2px" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                    "@",
                    conv.otherUsername
                  ] }),
                  isVerifiedUser(conv.otherUsername) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 16 })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "text-primary border-primary/30 bg-primary/10 flex items-center gap-1 text-xs py-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3 h-3" }),
                    t.encrypted
                  ]
                }
              ),
              conv.lastMessageAt > 0n && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(conv.lastMessageAt) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: preview })
        ] })
      ] })
    }
  );
}
function SearchResultRow({
  user,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": "search-result-row",
      onClick: () => onSelect(user),
      className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors rounded-lg text-left",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-base text-foreground uppercase", children: user.username.charAt(0) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex items-center gap-1 font-medium text-foreground min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center min-w-0",
              style: { gap: "2px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                  "@",
                  user.username
                ] }),
                isVerifiedUser(user.username, user.isVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 15 })
              ]
            }
          ) }),
          user.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.bio })
        ] })
      ]
    }
  );
}
function MessagesPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [debouncedTerm, setDebouncedTerm] = reactExports.useState("");
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  reactExports.useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedTerm(searchTerm), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);
  const { data: conversations, isLoading: convsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8e3
  });
  const { data: searchResults, isFetching: searching } = useQuery({
    queryKey: ["userSearch", debouncedTerm],
    queryFn: async () => {
      if (!actor || !debouncedTerm.trim()) return [];
      return actor.searchUsers(debouncedTerm.trim());
    },
    enabled: !!actor && !isFetching && debouncedTerm.trim().length > 0
  });
  const handleSelectUser = (user) => {
    setSearchTerm("");
    setDebouncedTerm("");
    void navigate({ to: `/messages/${user.id.toString()}` });
  };
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto space-y-3 py-6", children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, k)) }) });
  }
  if (status === "unauthenticated") return null;
  const showSearch = searchTerm.trim().length > 0;
  const convList = conversations ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6",
      "data-ocid": "messages-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-semibold text-foreground", children: t.messagesTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: t.allEncrypted })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-primary border-primary/30 bg-primary/10 flex items-center gap-1.5 px-3 py-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: t.e2eEncrypted })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "search-users-input",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: t.searchUsersPlaceholder,
              className: "pl-9 pr-9 h-11 bg-card border-border focus:border-primary/60 focus:ring-primary/20 w-full"
            }
          ),
          searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setSearchTerm("");
                setDebouncedTerm("");
              },
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          ),
          showSearch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-20 top-full mt-1 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden", children: [
            searching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-sm text-muted-foreground", children: t.searching }),
            !searching && searchResults && searchResults.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-sm text-muted-foreground", children: t.noUsersFound.replace("{term}", debouncedTerm) }),
            !searching && searchResults && searchResults.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SearchResultRow,
              {
                user: u,
                onSelect: handleSelectUser
              },
              u.id.toString()
            ))
          ] })
        ] }),
        convsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["l1", "l2", "l3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, k)) }) : convList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "empty-conversations",
            className: "flex flex-col items-center justify-center py-20 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-8 h-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: t.noConversationsYet }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-xs", children: t.noConversationsDesc }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "start-conversation-cta",
                  variant: "outline",
                  className: "border-primary/40 text-primary hover:bg-primary/10",
                  onClick: () => {
                    const el = document.querySelector(
                      '[data-ocid="search-users-input"]'
                    );
                    el == null ? void 0 : el.focus();
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 mr-2" }),
                    t.findSomeoneToMessage
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: convList.map((conv) => /* @__PURE__ */ jsxRuntimeExports.jsx(ConversationCard, { conv }, conv.conversationId)) })
      ]
    }
  ) });
}
export {
  MessagesPage as default
};
