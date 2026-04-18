import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { AdminStats, ReportView, UserProfile } from "@/types";
import { ResolveAction } from "@/types";
import { ADMIN_USERNAME, isVerifiedUser } from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BadgeCheck,
  Ban,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Flag,
  MessageSquare,
  ShieldOff,
  UserMinus,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color = "primary",
  index,
}: {
  icon: React.ElementType;
  label: string;
  value: bigint | number | string;
  color?: "primary" | "emerald" | "amber" | "destructive" | "blue";
  index: number;
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const display =
    typeof value === "bigint" ? Number(value).toLocaleString() : String(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="bg-card border border-border rounded-xl p-5 space-y-3"
      data-ocid={`admin.stat.item.${index + 1}`}
    >
      <div
        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-foreground tabular-nums">
          {display}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── User Row ─────────────────────────────────────────────────────────────────

function UserRow({ user, index }: { user: UserProfile; index: number }) {
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
      toast.success(t.verificationGranted);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const revokeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.revokeVerification(user.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(t.verificationRevoked);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const suspendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.suspendUser(user.id, 24n);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(t.userSuspended);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const banMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.banUser(user.id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(t.userBanned);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const isPending =
    grantMutation.isPending ||
    revokeMutation.isPending ||
    suspendMutation.isPending ||
    banMutation.isPending;

  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-secondary/40 transition-smooth rounded-lg"
      data-ocid={`admin.users.item.${index + 1}`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-sm font-bold text-foreground">
        {user.username[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <span
          className="inline-flex items-center text-sm font-semibold text-foreground"
          style={{ gap: "3px" }}
        >
          <span className="truncate">{user.username}</span>
          {isVerified && <VerificationBadge size={13} />}
        </span>
        <p className="text-xs text-muted-foreground truncate">
          {Number(user.followerCount).toLocaleString()} followers
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {isVerified ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => revokeMutation.mutate()}
            disabled={isPending}
            className="h-7 px-2 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            data-ocid={`admin.revoke_button.${index + 1}`}
          >
            <ShieldOff className="w-3 h-3" />
            <span className="hidden sm:inline">{t.revoke}</span>
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => grantMutation.mutate()}
            disabled={isPending}
            className="h-7 px-2 text-xs gap-1 text-primary border-primary/30 hover:bg-primary/10"
            data-ocid={`admin.grant_button.${index + 1}`}
          >
            <BadgeCheck className="w-3 h-3" />
            <span className="hidden sm:inline">{t.grant}</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => suspendMutation.mutate()}
          disabled={isPending}
          className="h-7 px-2 text-xs gap-1"
          data-ocid={`admin.suspend_button.${index + 1}`}
        >
          <UserMinus className="w-3 h-3" />
          <span className="hidden sm:inline">{t.suspend}</span>
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => banMutation.mutate()}
          disabled={isPending}
          className="h-7 px-2 text-xs gap-1"
          data-ocid={`admin.ban_button.${index + 1}`}
        >
          <Ban className="w-3 h-3" />
          <span className="hidden sm:inline">{t.ban}</span>
        </Button>
      </div>
    </div>
  );
}

// ─── Report Row ───────────────────────────────────────────────────────────────

function ReportRow({ report, index }: { report: ReportView; index: number }) {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();

  const resolveMutation = useMutation({
    mutationFn: async (action: ResolveAction) => {
      if (!actor) throw new Error();
      return actor.resolveReport(report.id, action);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["adminReports"] });
      toast.success(t.reportResolved);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const isPending = resolveMutation.isPending;

  return (
    <div
      className="p-4 bg-secondary/30 border border-border rounded-xl space-y-3"
      data-ocid={`admin.reports.item.${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
          <Flag className="w-4 h-4 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {t.reportedBy}: {report.reporter.username}
          </p>
          {report.reportedUser && (
            <p className="text-xs text-muted-foreground">
              {t.reportedUser}: {report.reportedUser.username}
            </p>
          )}
          {report.reportedPost && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {t.reportedPost}: "{report.reportedPost.content}"
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-amber-400 font-medium">{report.reason}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => resolveMutation.mutate(ResolveAction.deleteContent)}
          disabled={isPending}
          className="h-7 px-2 text-xs gap-1"
          data-ocid={`admin.delete_content_button.${index + 1}`}
        >
          <XCircle className="w-3 h-3" />
          {t.deleteContent}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => resolveMutation.mutate(ResolveAction.dismiss)}
          disabled={isPending}
          className="h-7 px-2 text-xs gap-1"
          data-ocid={`admin.dismiss_button.${index + 1}`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {t.dismiss}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => resolveMutation.mutate(ResolveAction.suspendUser)}
          disabled={isPending}
          className="h-7 px-2 text-xs gap-1"
          data-ocid={`admin.suspend_user_report_button.${index + 1}`}
        >
          <UserX className="w-3 h-3" />
          {t.suspend}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => resolveMutation.mutate(ResolveAction.banUser)}
          disabled={isPending}
          className="h-7 px-2 text-xs gap-1"
          data-ocid={`admin.ban_user_report_button.${index + 1}`}
        >
          <Ban className="w-3 h-3" />
          {t.ban}
        </Button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { status, profile } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const [userPage] = useState(0n);
  const [reportPage] = useState(0n);

  const isOwner =
    profile !== null &&
    isVerifiedUser(profile?.username ?? "", false) &&
    profile?.username === ADMIN_USERNAME;

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error();
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching && isOwner,
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserProfile[]>({
    queryKey: ["adminUsers", userPage.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers(userPage, 20n);
    },
    enabled: !!actor && !isFetching && isOwner,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery<ReportView[]>({
    queryKey: ["adminReports", reportPage.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports(reportPage, 20n);
    },
    enabled: !!actor && !isFetching && isOwner,
  });

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-5 pt-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <Skeleton key={k} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Access denied for non-owners
  if (!isOwner) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center"
          data-ocid="admin.denied"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
            {t.accessDenied}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            {t.accessDeniedDesc}
          </p>
        </div>
      </Layout>
    );
  }

  const statsList = [
    {
      icon: Users,
      label: t.totalUsers,
      value: stats?.totalUsers ?? 0n,
      color: "primary" as const,
    },
    {
      icon: FileText,
      label: t.totalPosts,
      value: stats?.totalPosts ?? 0n,
      color: "blue" as const,
    },
    {
      icon: BookOpen,
      label: t.totalStories,
      value: stats?.totalStories ?? 0n,
      color: "emerald" as const,
    },
    {
      icon: MessageSquare,
      label: t.totalMessages,
      value: stats?.totalMessages ?? 0n,
      color: "blue" as const,
    },
    {
      icon: BadgeCheck,
      label: t.verifiedUsers,
      value: stats?.verifiedUsers ?? 0n,
      color: "emerald" as const,
    },
    {
      icon: Flag,
      label: t.pendingReports,
      value: stats?.pendingReports ?? 0n,
      color: "destructive" as const,
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 pb-8" data-ocid="admin.page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {t.adminDashboard}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.adminDashboardDesc}
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        {statsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <Skeleton key={k} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {statsList.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList
            className="w-full bg-card border border-border rounded-xl p-1 h-auto"
            data-ocid="admin.tabs"
          >
            <TabsTrigger
              value="users"
              className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2"
              data-ocid="admin.users_tab"
            >
              <Users className="w-4 h-4" />
              {t.usersTab}
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2"
              data-ocid="admin.reports_tab"
            >
              <Flag className="w-4 h-4" />
              {t.reportsTab}
              {stats && stats.pendingReports > 0n && (
                <span className="ml-1 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {Number(stats.pendingReports)}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-4">
            {usersLoading ? (
              <div className="space-y-2">
                {["a", "b", "c", "d"].map((k) => (
                  <div key={k} className="flex items-center gap-3 p-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                    <Skeleton className="h-7 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : !users || users.length === 0 ? (
              <div
                className="flex flex-col items-center py-16 text-center"
                data-ocid="admin.users.empty_state"
              >
                <Users className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">{t.noUsersYet}</p>
              </div>
            ) : (
              <div
                className="bg-card border border-border rounded-xl divide-y divide-border/60 overflow-hidden"
                data-ocid="admin.users_list"
              >
                {users.map((u, i) => (
                  <UserRow key={u.id.toString()} user={u} index={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-4">
            {reportsLoading ? (
              <div className="space-y-3">
                {["a", "b"].map((k) => (
                  <Skeleton key={k} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : !reports || reports.length === 0 ? (
              <div
                className="flex flex-col items-center py-16 text-center"
                data-ocid="admin.reports.empty_state"
              >
                <Flag className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {t.noReportsYet}
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="admin.reports_list">
                {reports.map((r, i) => (
                  <ReportRow key={r.id.toString()} report={r} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
