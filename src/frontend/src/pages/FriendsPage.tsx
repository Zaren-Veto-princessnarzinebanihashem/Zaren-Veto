import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { FriendRequestView } from "@/types";
import { RespondAction } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, Clock, Send, UserCheck, UserX, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function usePendingRequests() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<FriendRequestView[]>({
    queryKey: ["pendingFriendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

function useSentRequests() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<FriendRequestView[]>({
    queryKey: ["sentFriendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function ReceivedRequestCard({
  request,
  index,
}: { request: FriendRequestView; index: number }) {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();

  const respondMutation = useMutation({
    mutationFn: async (action: RespondAction) => {
      if (!actor) throw new Error("Not connected");
      return actor.respondFriendRequest(request.id, action);
    },
    onSuccess: (_, action) => {
      void qc.invalidateQueries({ queryKey: ["pendingFriendRequests"] });
      if (action === RespondAction.accept)
        toast.success(t.friendsRequestAccepted);
      else if (action === RespondAction.decline)
        toast.success(t.friendsRequestDeclined);
      else toast.success(t.friendsUserBlocked);
    },
    onError: () => toast.error(t.friendsRequestFailed),
  });

  const isVerified = isVerifiedUser(
    request.from.username,
    request.from.isVerified,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-smooth"
      data-ocid={`friends.received.item.${index + 1}`}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-base font-bold text-foreground">
        {request.from.username[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <span
          className="inline-flex items-center font-semibold text-foreground text-sm"
          style={{ gap: "3px" }}
        >
          <span className="truncate">{request.from.username}</span>
          {isVerified && <VerificationBadge size={14} />}
        </span>
        {request.from.bio && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {request.from.bio}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={() => respondMutation.mutate(RespondAction.accept)}
          disabled={respondMutation.isPending}
          className="h-8 px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          data-ocid={`friends.accept_button.${index + 1}`}
        >
          <Check className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.friendsAcceptRequest}</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => respondMutation.mutate(RespondAction.decline)}
          disabled={respondMutation.isPending}
          className="h-8 px-3 gap-1.5"
          data-ocid={`friends.decline_button.${index + 1}`}
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.friendsDeclineRequest}</span>
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => respondMutation.mutate(RespondAction.block)}
          disabled={respondMutation.isPending}
          className="h-8 px-3 gap-1.5"
          data-ocid={`friends.block_button.${index + 1}`}
        >
          <UserX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.friendsBlockUser}</span>
        </Button>
      </div>
    </motion.div>
  );
}

function SentRequestCard({
  request,
  index,
}: { request: FriendRequestView; index: number }) {
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
      toast.success(t.friendsRequestCancelled);
    },
    onError: () => toast.error(t.friendsRequestFailed),
  });

  const isVerified = isVerifiedUser(request.to.username, request.to.isVerified);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-smooth"
      data-ocid={`friends.sent.item.${index + 1}`}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-base font-bold text-foreground">
        {request.to.username[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <span
          className="inline-flex items-center font-semibold text-foreground text-sm"
          style={{ gap: "3px" }}
        >
          <span className="truncate">{request.to.username}</span>
          {isVerified && <VerificationBadge size={14} />}
        </span>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t.friendsPendingRequests}
        </p>
      </div>

      {/* Cancel */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => cancelMutation.mutate()}
        disabled={cancelMutation.isPending}
        className="h-8 px-3 gap-1.5 shrink-0"
        data-ocid={`friends.cancel_button.${index + 1}`}
      >
        <X className="w-3.5 h-3.5" />
        {cancelMutation.isPending ? "…" : t.friendsCancelRequest}
      </Button>
    </motion.div>
  );
}

// ─── Empty States ─────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  message,
}: { icon: React.ElementType; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="friends.empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}

function RequestListSkeleton() {
  return (
    <div className="space-y-3" data-ocid="friends.loading_state">
      {["a", "b", "c"].map((k) => (
        <div
          key={k}
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl"
        >
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-2.5 w-48" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FriendsPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: received, isLoading: loadingReceived } = usePendingRequests();
  const { data: sent, isLoading: loadingSent } = useSentRequests();

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-5 pt-4">
          <Skeleton className="h-8 w-40" />
          <RequestListSkeleton />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") return null;

  const receivedCount = received?.length ?? 0;
  const sentCount = sent?.length ?? 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6" data-ocid="friends.page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {t.friendsTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {receivedCount > 0
                ? `${receivedCount} ${t.friendsPendingRequests}`
                : t.friendsSentRequests}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList
            className="w-full bg-card border border-border rounded-xl p-1 h-auto"
            data-ocid="friends.tabs"
          >
            <TabsTrigger
              value="received"
              className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2"
              data-ocid="friends.received_tab"
            >
              <UserCheck className="w-4 h-4" />
              {t.friendsRequestsReceived}
              {receivedCount > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {receivedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2"
              data-ocid="friends.sent_tab"
            >
              <Send className="w-4 h-4" />
              {t.friendsRequestsSent}
              {sentCount > 0 && (
                <span className="ml-1 min-w-[18px] h-[18px] rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {sentCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Received */}
          <TabsContent value="received" className="mt-4">
            {loadingReceived ? (
              <RequestListSkeleton />
            ) : receivedCount === 0 ? (
              <EmptyState
                icon={UserCheck}
                message={t.friendsNoPendingRequests}
              />
            ) : (
              <div className="space-y-3" data-ocid="friends.received_list">
                <AnimatePresence>
                  {received!.map((req, i) => (
                    <ReceivedRequestCard
                      key={req.id.toString()}
                      request={req}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* Sent */}
          <TabsContent value="sent" className="mt-4">
            {loadingSent ? (
              <RequestListSkeleton />
            ) : sentCount === 0 ? (
              <EmptyState icon={Send} message={t.friendsNoSentRequests} />
            ) : (
              <div className="space-y-3" data-ocid="friends.sent_list">
                <AnimatePresence>
                  {sent!.map((req, i) => (
                    <SentRequestCard
                      key={req.id.toString()}
                      request={req}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
