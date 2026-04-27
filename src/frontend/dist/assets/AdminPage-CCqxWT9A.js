import { b as createLucideIcon, a as useLanguage, r as reactExports, j as jsxRuntimeExports, S as Skeleton, m as motion, d as useQueryClient, e as ue } from "./index-CvIOltKC.js";
import { i as isVerifiedUser, A as ADMIN_USERNAME, L as Layout, U as Users, B as BookOpen, V as VerificationBadge } from "./Layout-B9hj0KjP.js";
import { B as Button } from "./button-D8P5m97v.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DnS8XCMb.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery, c as useMutation, e as ResolveAction } from "./index-jDDIPp20.js";
import { C as CircleAlert } from "./circle-alert-BFMo9b6G.js";
import { F as FileText } from "./file-text-BmS__72b.js";
import { M as MessageSquare } from "./message-square-I_6x42ok.js";
import { a as BadgeCheck, B as Ban } from "./ban-Bn_3--hP.js";
import { F as Flag } from "./flag-fctvlZl0.js";
import { U as UserMinus } from "./user-minus-BlSmJfZ0.js";
import { U as UserX } from "./user-x-Ba4mVEPd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode);
function StatCard({
  icon: Icon,
  label,
  value,
  color = "primary",
  index
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  };
  const display = typeof value === "bigint" ? Number(value).toLocaleString() : String(value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "bg-card border border-border rounded-xl p-5 space-y-3",
      "data-ocid": `admin.stat.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground tabular-nums", children: display }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
        ] })
      ]
    }
  );
}
function UserRow({ user, index }) {
  var _a;
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  const isVerified = isVerifiedUser(user.username, user.isVerified);
  const grantMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.grantVerification(user.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(t.verificationGranted);
    },
    onError: () => ue.error(t.actionFailed)
  });
  const revokeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.revokeVerification(user.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(t.verificationRevoked);
    },
    onError: () => ue.error(t.actionFailed)
  });
  const suspendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.suspendUser(user.id, 24n);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(t.userSuspended);
    },
    onError: () => ue.error(t.actionFailed)
  });
  const banMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.banUser(user.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      ue.success(t.userBanned);
    },
    onError: () => ue.error(t.actionFailed)
  });
  const isPending = grantMutation.isPending || revokeMutation.isPending || suspendMutation.isPending || banMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 p-3 hover:bg-secondary/40 transition-smooth rounded-lg",
      "data-ocid": `admin.users.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-sm font-bold text-foreground", children: ((_a = user.username[0]) == null ? void 0 : _a.toUpperCase()) ?? "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center text-sm font-semibold text-foreground",
              style: { gap: "3px" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: user.username }),
                isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 13 })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
            Number(user.followerCount).toLocaleString(),
            " followers"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
          isVerified ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => revokeMutation.mutate(),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10",
              "data-ocid": `admin.revoke_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.revoke })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => grantMutation.mutate(),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1 text-primary border-primary/30 hover:bg-primary/10",
              "data-ocid": `admin.grant_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.grant })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => suspendMutation.mutate(),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1",
              "data-ocid": `admin.suspend_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.suspend })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: () => banMutation.mutate(),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1",
              "data-ocid": `admin.ban_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: t.ban })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ReportRow({ report, index }) {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  const resolveMutation = useMutation({
    mutationFn: async (action) => {
      if (!actor) throw new Error();
      return actor.resolveReport(report.id, action);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminReports"] });
      ue.success(t.reportResolved);
    },
    onError: () => ue.error(t.actionFailed)
  });
  const isPending = resolveMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 bg-secondary/30 border border-border rounded-xl space-y-3",
      "data-ocid": `admin.reports.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground truncate", children: [
              t.reportedBy,
              ": ",
              report.reporter.username
            ] }),
            report.reportedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              t.reportedUser,
              ": ",
              report.reportedUser.username
            ] }),
            report.reportedPost && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: [
              t.reportedPost,
              ': "',
              report.reportedPost.content,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400 font-medium", children: report.reason }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => resolveMutation.mutate(ResolveAction.deleteContent),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1",
              "data-ocid": `admin.delete_content_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
                t.deleteContent
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => resolveMutation.mutate(ResolveAction.dismiss),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1",
              "data-ocid": `admin.dismiss_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
                t.dismiss
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => resolveMutation.mutate(ResolveAction.suspendUser),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1",
              "data-ocid": `admin.suspend_user_report_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "w-3 h-3" }),
                t.suspend
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: () => resolveMutation.mutate(ResolveAction.banUser),
              disabled: isPending,
              className: "h-7 px-2 text-xs gap-1",
              "data-ocid": `admin.ban_user_report_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-3 h-3" }),
                t.ban
              ]
            }
          )
        ] })
      ]
    }
  );
}
function AdminPage() {
  const { status, profile } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const [userPage] = reactExports.useState(0n);
  const [reportPage] = reactExports.useState(0n);
  const isOwner = profile !== null && isVerifiedUser((profile == null ? void 0 : profile.username) ?? "", false) && (profile == null ? void 0 : profile.username) === ADMIN_USERNAME;
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error();
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching && isOwner
  });
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers", userPage.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers(userPage, 20n);
    },
    enabled: !!actor && !isFetching && isOwner
  });
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["adminReports", reportPage.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports(reportPage, 20n);
    },
    enabled: !!actor && !isFetching && isOwner
  });
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-5 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, k)) })
    ] }) });
  }
  if (!isOwner) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "admin.denied",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-8 h-8 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold text-foreground mb-2", children: t.accessDenied }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: t.accessDeniedDesc })
        ]
      }
    ) });
  }
  const statsList = [
    {
      icon: Users,
      label: t.totalUsers,
      value: (stats == null ? void 0 : stats.totalUsers) ?? 0n,
      color: "primary"
    },
    {
      icon: FileText,
      label: t.totalPosts,
      value: (stats == null ? void 0 : stats.totalPosts) ?? 0n,
      color: "blue"
    },
    {
      icon: BookOpen,
      label: t.totalStories,
      value: (stats == null ? void 0 : stats.totalStories) ?? 0n,
      color: "emerald"
    },
    {
      icon: MessageSquare,
      label: t.totalMessages,
      value: (stats == null ? void 0 : stats.totalMessages) ?? 0n,
      color: "blue"
    },
    {
      icon: BadgeCheck,
      label: t.verifiedUsers,
      value: (stats == null ? void 0 : stats.verifiedUsers) ?? 0n,
      color: "emerald"
    },
    {
      icon: Flag,
      label: t.pendingReports,
      value: (stats == null ? void 0 : stats.pendingReports) ?? 0n,
      color: "destructive"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6 pb-8", "data-ocid": "admin.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: t.adminDashboard }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.adminDashboardDesc })
          ] })
        ]
      }
    ),
    statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: statsList.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...s, index: i }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "users", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TabsList,
        {
          className: "w-full bg-card border border-border rounded-xl p-1 h-auto",
          "data-ocid": "admin.tabs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "users",
                className: "flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2",
                "data-ocid": "admin.users_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
                  t.usersTab
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "reports",
                className: "flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2",
                "data-ocid": "admin.reports_tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4" }),
                  t.reportsTab,
                  stats && stats.pendingReports > 0n && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1", children: Number(stats.pendingReports) })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "users", className: "mt-4", children: usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-20" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 rounded-lg" })
      ] }, k)) }) : !users || users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center py-16 text-center",
          "data-ocid": "admin.users.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.noUsersYet })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "bg-card border border-border rounded-xl divide-y divide-border/60 overflow-hidden",
          "data-ocid": "admin.users_list",
          children: users.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserRow, { user: u, index: i }, u.id.toString()))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "reports", className: "mt-4", children: reportsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a", "b"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-xl" }, k)) }) : !reports || reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center py-16 text-center",
          "data-ocid": "admin.reports.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-8 h-8 text-muted-foreground mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.noReportsYet })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "admin.reports_list", children: reports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReportRow, { report: r, index: i }, r.id.toString())) }) })
    ] })
  ] }) });
}
export {
  AdminPage as default
};
