import { u as useNavigate, a as useLanguage, r as reactExports, j as jsxRuntimeExports, S as Skeleton, m as motion, A as AnimatePresence, d as useQueryClient, e as ue, X } from "./index-CinqF2FC.js";
import { L as Layout, U as Users, i as isVerifiedUser, V as VerificationBadge } from "./Layout-B_cAPpUr.js";
import { B as Button } from "./button-CFWNxzA7.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BCBkdG2F.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery, c as useMutation, R as RespondAction } from "./index-DXe1TNIQ.js";
import { U as UserCheck } from "./user-check-B_imVyPi.js";
import { S as Send } from "./send-Bd6a2Olk.js";
import { C as Check } from "./check-DftDiFuj.js";
import { U as UserX } from "./user-x-Bdi1iOyS.js";
import { C as Clock } from "./clock-C0UamR2i.js";
function usePendingRequests() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["pendingFriendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function useSentRequests() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["sentFriendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function ReceivedRequestCard({
  request,
  index
}) {
  var _a;
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  const respondMutation = useMutation({
    mutationFn: async (action) => {
      if (!actor) throw new Error("Not connected");
      return actor.respondFriendRequest(request.id, action);
    },
    onSuccess: (_, action) => {
      void qc.invalidateQueries({ queryKey: ["pendingFriendRequests"] });
      if (action === RespondAction.accept)
        ue.success(t.friendsRequestAccepted);
      else if (action === RespondAction.decline)
        ue.success(t.friendsRequestDeclined);
      else ue.success(t.friendsUserBlocked);
    },
    onError: () => ue.error(t.friendsRequestFailed)
  });
  const isVerified = isVerifiedUser(
    request.from.username,
    request.from.isVerified
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3, delay: index * 0.05 },
      className: "flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-smooth",
      "data-ocid": `friends.received.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-base font-bold text-foreground", children: ((_a = request.from.username[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center font-semibold text-foreground text-sm",
              style: { gap: "3px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: request.from.username }),
                isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
              ]
            }
          ),
          request.from.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: request.from.bio })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => respondMutation.mutate(RespondAction.accept),
              disabled: respondMutation.isPending,
              className: "h-8 px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0",
              "data-ocid": `friends.accept_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.friendsAcceptRequest })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => respondMutation.mutate(RespondAction.decline),
              disabled: respondMutation.isPending,
              className: "h-8 px-3 gap-1.5",
              "data-ocid": `friends.decline_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.friendsDeclineRequest })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: () => respondMutation.mutate(RespondAction.block),
              disabled: respondMutation.isPending,
              className: "h-8 px-3 gap-1.5",
              "data-ocid": `friends.block_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.friendsBlockUser })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function SentRequestCard({
  request,
  index
}) {
  var _a;
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelFriendRequest(request.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["sentFriendRequests"] });
      ue.success(t.friendsRequestCancelled);
    },
    onError: () => ue.error(t.friendsRequestFailed)
  });
  const isVerified = isVerifiedUser(request.to.username, request.to.isVerified);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3, delay: index * 0.05 },
      className: "flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-smooth",
      "data-ocid": `friends.sent.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-base font-bold text-foreground", children: ((_a = request.to.username[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center font-semibold text-foreground text-sm",
              style: { gap: "3px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: request.to.username }),
                isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            t.friendsPendingRequests
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => cancelMutation.mutate(),
            disabled: cancelMutation.isPending,
            className: "h-8 px-3 gap-1.5 shrink-0",
            "data-ocid": `friends.cancel_button.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
              cancelMutation.isPending ? "…" : t.friendsCancelRequest
            ]
          }
        )
      ]
    }
  );
}
function EmptyState({
  icon: Icon,
  message
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "friends.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-7 h-7 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: message })
      ]
    }
  );
}
function RequestListSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "friends.loading_state", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 p-4 bg-card border border-border rounded-xl",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-48" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-lg" })
      ]
    },
    k
  )) });
}
function FriendsPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: received, isLoading: loadingReceived } = usePendingRequests();
  const { data: sent, isLoading: loadingSent } = useSentRequests();
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-5 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RequestListSkeleton, {})
    ] }) });
  }
  if (status === "unauthenticated") return null;
  const receivedCount = (received == null ? void 0 : received.length) ?? 0;
  const sentCount = (sent == null ? void 0 : sent.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-6", "data-ocid": "friends.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: t.friendsTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: receivedCount > 0 ? `${receivedCount} ${t.friendsPendingRequests}` : t.friendsSentRequests })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "received", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          className: "w-full bg-card border border-border rounded-xl p-1 h-auto",
          "data-ocid": "friends.tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "received",
                className: "flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2",
                "data-ocid": "friends.received_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4" }),
                  t.friendsRequestsReceived,
                  receivedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1", children: receivedCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "sent",
                className: "flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2",
                "data-ocid": "friends.sent_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
                  t.friendsRequestsSent,
                  sentCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 min-w-[18px] h-[18px] rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center px-1", children: sentCount })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "received", className: "mt-4", children: loadingReceived ? /* @__PURE__ */ jsxRuntimeExports.jsx(RequestListSkeleton, {}) : receivedCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: UserCheck,
          message: t.friendsNoPendingRequests
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "friends.received_list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: received.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReceivedRequestCard,
        {
          request: req,
          index: i
        },
        req.id.toString()
      )) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "sent", className: "mt-4", children: loadingSent ? /* @__PURE__ */ jsxRuntimeExports.jsx(RequestListSkeleton, {}) : sentCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Send, message: t.friendsNoSentRequests }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "friends.sent_list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sent.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        SentRequestCard,
        {
          request: req,
          index: i
        },
        req.id.toString()
      )) }) }) })
    ] })
  ] }) });
}
export {
  FriendsPage as default
};
