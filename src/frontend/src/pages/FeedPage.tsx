import { Layout } from "@/components/Layout";
import { NotificationBell } from "@/components/NotificationBell";
import { StoriesCarousel } from "@/components/StoriesCarousel";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { CommentView, NotificationView, PostId, PostView } from "@/types";
import { ReactionType, Visibility } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Edit2,
  Flag,
  Globe,
  Heart,
  Link2,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Plus,
  RefreshCw,
  Reply,
  Send,
  Share2,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/** Renders post content with clickable blue URLs */
function renderPostContent(content: string): React.ReactNode {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = Array.from(
    content.matchAll(new RegExp(urlRegex.source, "g")),
  );
  if (matches.length === 0) return content;
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of matches) {
    const url = match[0];
    const start = match.index ?? 0;
    const before = content.slice(lastIndex, start);
    if (before) segments.push(before);
    segments.push(
      <a
        key={start}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1877F2] underline hover:text-blue-400 break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>,
    );
    lastIndex = start + url.length;
  }
  const tail = content.slice(lastIndex);
  if (tail) segments.push(tail);
  return <>{segments}</>;
}

function formatRelativeTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diffMs = Date.now() - ms;
  const diffSec = Math.floor(diffMs / 1000);
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

const REACTIONS: Array<{
  type: ReactionType;
  emoji: string;
  labelKey: keyof import("@/i18n/translations").Translations;
}> = [
  { type: ReactionType.love, emoji: "❤️", labelKey: "reactionHeart" },
  { type: ReactionType.haha, emoji: "😂", labelKey: "reactionHaha" },
  { type: ReactionType.wow, emoji: "😮", labelKey: "reactionWow" },
  { type: ReactionType.sad, emoji: "😢", labelKey: "reactionSad" },
  { type: ReactionType.angry, emoji: "😡", labelKey: "reactionAngry" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useFeed() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<PostView[]>({
    queryKey: ["feed"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeed();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
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
      pollOptions,
    }: {
      content: string;
      visibility: Visibility;
      pollQuestion?: string;
      pollOptions?: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createPost(content, visibility, [], null);
      if (!result || result.__kind__ === "err") {
        throw new Error(
          result && "err" in result ? result.err : t.failedToPublishPost,
        );
      }
      const postId = result.ok;
      // If poll provided, create it attached to post
      if (pollQuestion && pollOptions && pollOptions.length >= 2) {
        try {
          await actor.createPoll(postId, pollQuestion, pollOptions);
        } catch {
          // Poll creation failing shouldn't block the post
        }
      }
      return postId;
    },
    onSuccess: () => {
      // Defer invalidation one tick so React finishes any in-flight state updates
      // before the query refetch triggers a re-render, preventing insertBefore/removeChild errors
      setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["feed"] });
      }, 0);
      toast.success(t.postPublished);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : t.failedToPublishPost;
      toast.error(msg);
    },
  });
}

function useEditPost() {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: { postId: PostId; content: string }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.editPost(postId, content);
      if (result === false) throw new Error(t.failedToUpdatePost);
      return result;
    },
    onSuccess: () => {
      setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["feed"] });
      }, 0);
      toast.success(t.postUpdated);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : t.failedToUpdatePost;
      toast.error(msg);
    },
  });
}

function useDeletePost() {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  const { t } = useLanguage();
  return useMutation({
    mutationFn: async (postId: PostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      setTimeout(() => {
        void qc.invalidateQueries({ queryKey: ["feed"] });
      }, 0);
      toast.success(t.postDeleted);
    },
    onError: () => toast.error(t.failedToDeletePost),
  });
}

function useNotifications() {
  const { actor, isFetching } = useAuthenticatedBackend();
  const { data: notifications = [] } = useQuery<NotificationView[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ["unreadNotifications"],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getUnreadCount();
      return Number(count);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
  return { notifications, unreadCount };
}

function useVotePoll(pollId: bigint) {
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (optionId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.votePoll(pollId, optionId);
    },
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ["pollResults", pollId.toString()],
      });
    },
  });
}

function PostPollDisplay({
  postId,
  postIdStr,
}: { postId: bigint; postIdStr: string }) {
  const { actor, isFetching } = useAuthenticatedBackend();
  // Use postId as pollId since createPoll returns a pollId tied to the post
  // The backend getPollResults is polled by pollId; we use post.id as a proxy
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
    staleTime: 15_000,
  });
  const voteMutation = useVotePoll(postId);

  // Don't show skeleton for polls — most posts won't have them
  if (isLoading || !results || results.options.length === 0) return null;

  const hasVoted = results.myVote !== undefined && results.myVote !== null;
  const total = Number(results.totalVotes);

  return (
    <div
      className="mt-3 bg-secondary/50 border border-border rounded-xl p-4 space-y-3"
      data-ocid={`poll-display-${postIdStr}`}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <BarChart2 className="w-3.5 h-3.5 text-primary" />
        <span>
          {total} {total === 1 ? "vote" : "votes"}
        </span>
      </div>
      <div className="space-y-2">
        {results.options.map((opt) => {
          const isMyVote = hasVoted && results.myVote === opt.id;
          const pct =
            total > 0 ? Math.round((Number(opt.votes) / total) * 100) : 0;
          return hasVoted ? (
            <div key={opt.id.toString()} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-medium ${isMyVote ? "text-primary" : "text-foreground"}`}
                >
                  {opt.text}
                  {isMyVote && (
                    <span className="ms-1.5 text-[10px] text-primary font-semibold">
                      ✓
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isMyVote ? "bg-primary" : "bg-muted-foreground/40"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground tabular-nums">
                {Number(opt.votes)} votes
              </p>
            </div>
          ) : (
            <button
              key={opt.id.toString()}
              type="button"
              onClick={() => voteMutation.mutate(opt.id)}
              disabled={voteMutation.isPending}
              className="w-full text-start px-3 py-2.5 rounded-lg border border-border text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-smooth disabled:opacity-60"
              data-ocid={`poll-vote-${postIdStr}-${opt.id.toString()}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RegistrationForm() {
  const { register, isRegistering, registerError } = useCurrentUser();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const qc = useQueryClient();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error(t.usernameRequired2);
      return;
    }
    try {
      await register({ username: username.trim(), bio: bio.trim() });
      toast.success(t.welcomeToast);
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    } catch {
      toast.error(t.registrationFailed);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
            {t.createYourProfile}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {t.createProfileSubtitle}
          </p>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="reg-username" className="text-sm font-medium">
                {t.username} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reg-username"
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isRegistering}
                maxLength={32}
                required
                data-ocid="register-username"
                className="bg-secondary border-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-bio" className="text-sm font-medium">
                {t.bio}{" "}
                <span className="text-muted-foreground font-normal">
                  {t.bioOptional}
                </span>
              </Label>
              <Textarea
                id="reg-bio"
                placeholder={t.bioPlaceholder}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isRegistering}
                rows={3}
                maxLength={280}
                data-ocid="register-bio"
                className="bg-secondary border-input resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/280
              </p>
            </div>
            {registerError && (
              <p className="text-xs text-destructive">
                {registerError.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={isRegistering || !username.trim()}
              className="w-full h-11"
              data-ocid="register-submit"
            >
              {isRegistering ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t.joiningLabel}
                </span>
              ) : (
                t.joinButton
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {["sk1", "sk2", "sk3"].map((k) => (
        <div
          key={k}
          className="bg-card border border-border rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function VisibilityToggle({
  value,
  onChange,
}: { value: Visibility; onChange: (v: Visibility) => void }) {
  const { t } = useLanguage();
  return (
    <fieldset className="flex rounded-lg border border-border overflow-hidden">
      <legend className="sr-only">Post visibility</legend>
      <button
        type="button"
        onClick={() => onChange(Visibility.everyone)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-smooth ${value === Visibility.everyone ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        data-ocid="visibility-everyone"
      >
        <Globe className="w-3 h-3" />
        {t.everyone}
      </button>
      <button
        type="button"
        onClick={() => onChange(Visibility.followersOnly)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-smooth ${value === Visibility.followersOnly ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        data-ocid="visibility-followers"
      >
        <Users className="w-3 h-3" />
        {t.followersOnly}
      </button>
    </fieldset>
  );
}

function CreatePostForm() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.everyone);
  const [expanded, setExpanded] = useState(false);
  const [showPollEditor, setShowPollEditor] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { id: "opt-0", value: "" },
    { id: "opt-1", value: "" },
  ]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createPost = useCreatePost();
  const { t } = useLanguage();

  const charsLeft = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;
  const isEmpty = !content.trim();

  const addPollOption = () => {
    if (pollOptions.length < 4)
      setPollOptions((prev) => [
        ...prev,
        { id: `opt-${prev.length}`, value: "" },
      ]);
  };

  const updatePollOption = (idx: number, val: string) => {
    setPollOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, value: val } : o)),
    );
  };

  const removePollEditor = () => {
    setShowPollEditor(false);
    setPollQuestion("");
    setPollOptions([
      { id: "opt-0", value: "" },
      { id: "opt-1", value: "" },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isOverLimit || createPost.isPending) return;
    const hasPoll =
      showPollEditor &&
      pollQuestion.trim() &&
      pollOptions.filter((o) => o.value.trim()).length >= 2;
    try {
      await createPost.mutateAsync({
        content: content.trim(),
        visibility,
        pollQuestion: hasPoll ? pollQuestion.trim() : undefined,
        pollOptions: hasPoll
          ? pollOptions.filter((o) => o.value.trim()).map((o) => o.value.trim())
          : undefined,
      });
      // Only clear form on success
      setContent("");
      setExpanded(false);
      removePollEditor();
    } catch {
      // Error is handled by onError in useMutation — do not clear form
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-xl p-5 shadow-sm"
      data-ocid="create-post-form"
    >
      <form onSubmit={(e) => void handleSubmit(e)}>
        <Textarea
          ref={textareaRef}
          placeholder={t.whatsOnYourMind}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setExpanded(true)}
          rows={expanded ? 4 : 2}
          maxLength={MAX_CHARS + 50}
          disabled={createPost.isPending}
          data-ocid="post-content-input"
          className="bg-secondary border-input resize-none transition-smooth text-sm leading-relaxed"
        />

        {/* Poll editor */}
        <AnimatePresence>
          {expanded && showPollEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="bg-secondary/60 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <BarChart2 className="w-4 h-4 text-primary" />
                    {t.pollQuestion ?? "Poll Question"}
                  </div>
                  <button
                    type="button"
                    onClick={removePollEditor}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Input
                  placeholder={t.pollQuestionPlaceholder ?? "Ask a question…"}
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="bg-card border-input text-sm h-9"
                  data-ocid="poll-question-input"
                />
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => (
                    <Input
                      key={opt.id}
                      placeholder={`${t.pollOption ?? "Option"} ${idx + 1}`}
                      value={opt.value}
                      onChange={(e) => updatePollOption(idx, e.target.value)}
                      className="bg-card border-input text-sm h-9"
                      data-ocid={`poll-option-input-${idx + 1}`}
                    />
                  ))}
                </div>
                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={addPollOption}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-smooth"
                    data-ocid="poll-add-option"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t.addPollOption ?? "Add option"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <VisibilityToggle
                    value={visibility}
                    onChange={setVisibility}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPollEditor((v) => !v)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-smooth ${showPollEditor ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                    data-ocid="add-poll-button"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {t.addPoll ?? "Poll"}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono tabular-nums ${isOverLimit ? "text-destructive" : charsLeft <= 50 ? "text-yellow-500" : "text-muted-foreground"}`}
                    aria-live="polite"
                  >
                    {charsLeft}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setExpanded(false);
                      setContent("");
                      removePollEditor();
                    }}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isEmpty || isOverLimit || createPost.isPending}
                    className="h-8 px-4"
                    data-ocid="post-submit"
                  >
                    {createPost.isPending ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t.publishing}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Plus className="w-3 h-3" />
                        {t.publish}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}

// ─── Comment Section ─────────────────────────────────────────────────────────

function CommentItem({
  comment,
  depth = 0,
}: { comment: CommentView; postId: bigint; depth?: number }) {
  const { t } = useLanguage();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim()) return;
    // stub — backend method pending
    toast.success(t.postComment);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className={`${depth > 0 ? "ms-8 border-s border-border ps-3" : ""}`}>
      <div className="flex gap-2.5 py-2">
        <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 text-xs font-semibold text-foreground">
          {comment.authorName[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-secondary rounded-xl px-3 py-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="inline-flex items-center text-xs font-semibold text-foreground"
                style={{ gap: "2px" }}
              >
                <span>{comment.authorName}</span>
                {isVerifiedUser(comment.authorName) && (
                  <VerificationBadge size={14} />
                )}
              </span>
            </div>
            <p className="text-xs text-foreground leading-relaxed break-words">
              {comment.content}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1 px-1">
            <span className="text-[10px] text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {depth === 0 && (
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="text-[10px] text-muted-foreground hover:text-foreground font-medium transition-smooth flex items-center gap-1"
                data-ocid={`reply-toggle-${comment.id.toString()}`}
              >
                <Reply className="w-3 h-3" />
                {t.replyTo}
              </button>
            )}
          </div>
          {showReply && (
            <div className="flex gap-2 mt-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`${t.replyTo} ${comment.authorName}…`}
                className="h-8 text-xs bg-secondary border-input"
                data-ocid={`reply-input-${comment.id.toString()}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleReply();
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8 px-3"
                onClick={() => void handleReply()}
                disabled={!replyText.trim()}
                data-ocid={`reply-send-${comment.id.toString()}`}
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentSection({
  postId,
  postIdStr,
}: { postId: bigint; postIdStr: string }) {
  const { t, isRTL: isRtl } = useLanguage();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actor, isFetching } = useAuthenticatedBackend();
  const qc = useQueryClient();

  const { data: comments = [] } = useQuery<CommentView[]>({
    queryKey: ["comments", postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(postId);
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });

  const handleAddComment = async () => {
    const text = commentText.trim();
    if (!text || !actor || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await actor.addComment(postId, text);
      void qc.invalidateQueries({ queryKey: ["comments", postId.toString()] });
      void qc.invalidateQueries({ queryKey: ["feed"] });
      toast.success(t.postComment);
      setCommentText("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.failedToPublishPost;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="mt-3 pt-3 border-t border-border"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Comment input */}
      <div className="flex gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="flex-1 flex gap-2">
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t.addComment}
            className="h-10 sm:h-8 text-sm sm:text-xs bg-secondary border-input flex-1"
            data-ocid={`comment-input-${postIdStr}`}
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleAddComment();
              }
            }}
          />
          <Button
            size="sm"
            className="h-8 px-3 shrink-0"
            onClick={() => void handleAddComment()}
            disabled={!commentText.trim() || isSubmitting}
            data-ocid={`comment-send-${postIdStr}`}
          >
            {isSubmitting ? (
              <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
      {/* Comment list */}
      <div className="space-y-0.5">
        {comments.map((c) => (
          <CommentItem key={c.id.toString()} comment={c} postId={postId} />
        ))}
      </div>
    </div>
  );
}

// ─── Reaction Picker ─────────────────────────────────────────────────────────

function ReactionPicker({
  onReact,
  currentReaction,
  postIdStr,
}: {
  onReact: (type: ReactionType) => void;
  currentReaction: ReactionType | null;
  postIdStr: string;
}) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full mb-2 start-0 bg-card border border-border rounded-2xl shadow-xl p-1.5 flex gap-1 z-30 max-w-[calc(100vw-2rem)]"
      data-ocid={`reaction-picker-${postIdStr}`}
    >
      {REACTIONS.map((r) => (
        <button
          key={r.type}
          type="button"
          onClick={() => onReact(r.type)}
          title={t[r.labelKey] as string}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-smooth hover:scale-125 hover:bg-secondary ${currentReaction === r.type ? "bg-primary/20 ring-1 ring-primary/50 scale-110" : ""}`}
          data-ocid={`react-${r.type}-${postIdStr}`}
        >
          {r.emoji}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Share Dropdown ───────────────────────────────────────────────────────────

function ShareDropdown({
  postIdStr,
  onShare,
  onClose,
}: { postIdStr: string; onShare: () => void; onClose: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
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
          url: postUrl,
        });
      } catch {
        // User cancelled or share failed — silently ignore
      }
    }
    onClose();
  };

  const handleCopyLink = () => {
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
        toast.success(t.linkCopied);
      } catch {
        toast.error(t.actionFailed);
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(postUrl)
        .then(() => toast.success(t.linkCopied))
        .catch(doCopy);
    } else {
      doCopy();
    }
    onClose();
  };

  const encodedUrl = encodeURIComponent(postUrl);
  const hasNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  // If native share is available (mobile), use it directly instead of dropdown
  if (hasNativeShare) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -4 }}
        transition={{ duration: 0.12 }}
        className="absolute bottom-full mb-2 end-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-30 w-48"
        data-ocid={`share-dropdown-${postIdStr}`}
      >
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth"
          onClick={() => void handleNativeShare()}
          aria-label="Share this post"
          data-ocid={`share-native-${postIdStr}`}
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
          {t.share}
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border"
          onClick={handleCopyLink}
          aria-label="Copy link"
          data-ocid={`copy-link-${postIdStr}`}
        >
          <Link2 className="w-4 h-4 text-muted-foreground" />
          {t.copyLink}
        </button>
      </motion.div>
    );
  }

  // Desktop: show social share options + copy link
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute bottom-full mb-2 end-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-30 w-52"
      data-ocid={`share-dropdown-${postIdStr}`}
    >
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth"
        onClick={() => {
          onShare();
          onClose();
        }}
        aria-label="Share to feed"
        data-ocid={`share-to-feed-${postIdStr}`}
      >
        <Share2 className="w-4 h-4 text-muted-foreground" />
        {t.shareToFeed}
      </button>
      <a
        href={`https://wa.me/?text=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border"
        aria-label="Share on WhatsApp"
        data-ocid={`share-whatsapp-${postIdStr}`}
        onClick={onClose}
      >
        <span className="w-4 h-4 text-[#25D366] flex items-center justify-center font-bold text-xs">
          W
        </span>
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border"
        aria-label="Share on Telegram"
        data-ocid={`share-telegram-${postIdStr}`}
        onClick={onClose}
      >
        <span className="w-4 h-4 text-[#229ED9] flex items-center justify-center font-bold text-xs">
          T
        </span>
        Telegram
      </a>
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border"
        onClick={handleCopyLink}
        aria-label="Copy link"
        data-ocid={`copy-link-${postIdStr}`}
      >
        <Link2 className="w-4 h-4 text-muted-foreground" />
        {t.copyLink}
      </button>
    </motion.div>
  );
}

// ─── Post Options Menu ────────────────────────────────────────────────────────

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
  onClose,
}: {
  postId: bigint;
  postIdStr: string;
  isOwner: boolean;
  isSaved: boolean;
  isPinned: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onReport: () => void;
  onPin: () => void;
  onUnpin: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      transition={{ duration: 0.12 }}
      className="absolute top-8 end-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-30 w-48"
      data-ocid={`post-menu-${postIdStr}`}
    >
      <button
        type="button"
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth"
        onClick={() => {
          onSave();
          onClose();
        }}
        data-ocid={`save-post-${postIdStr}`}
      >
        {isSaved ? (
          <>
            <BookmarkCheck className="w-4 h-4 text-primary" />
            {t.unsavePost}
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4 text-muted-foreground" />
            {t.savePost}
          </>
        )}
      </button>
      {isOwner && (
        <>
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border"
            onClick={() => {
              isPinned ? onUnpin() : onPin();
              onClose();
            }}
            data-ocid={`pin-post-menu-${postIdStr}`}
          >
            <Pin className="w-4 h-4 text-muted-foreground" />
            {isPinned
              ? (t.unpinPost ?? "Unpin post")
              : (t.pinPost ?? "Pin post")}
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth border-t border-border"
            onClick={() => {
              onEdit();
              onClose();
            }}
            data-ocid={`edit-post-menu-${postIdStr}`}
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
            {t.editPost}
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-smooth border-t border-border"
            onClick={() => {
              onDelete();
              onClose();
            }}
            data-ocid={`delete-post-menu-${postIdStr}`}
          >
            <Trash2 className="w-4 h-4" />
            {t.deletePost}
          </button>
        </>
      )}
      {!isOwner && (
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-smooth border-t border-border"
          onClick={() => {
            onReport();
            onClose();
          }}
          data-ocid={`report-post-menu-${postIdStr}`}
        >
          <Flag className="w-4 h-4" />
          {t.reportPost}
        </button>
      )}
    </motion.div>
  );
}

// ─── Report Dialog ────────────────────────────────────────────────────────────

function ReportDialog({
  open,
  onClose,
  postIdStr,
}: { open: boolean; onClose: () => void; postIdStr: string }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { key: "spam", label: t.reportSpam },
    { key: "harassment", label: t.reportHarassment },
    { key: "hate_speech", label: t.reportHateSpeech },
    { key: "violence", label: t.reportViolence },
    { key: "misinformation", label: t.reportMisinformation },
    { key: "nudity", label: t.reportNudity },
    { key: "other", label: t.reportOther },
  ];

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success(t.reportSubmitted);
    setSelected("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-card border-border max-w-sm"
        data-ocid={`report-dialog-${postIdStr}`}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            {t.reportTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 py-2">
          {reasons.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setSelected(r.key)}
              className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition-smooth ${selected === r.key ? "bg-primary/15 text-foreground font-medium ring-1 ring-primary/40" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              data-ocid={`report-reason-${r.key}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid={`report-cancel-${postIdStr}`}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!selected || submitting}
            data-ocid={`report-submit-${postIdStr}`}
          >
            {submitting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {t.saving}
              </span>
            ) : (
              t.submitReport
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  currentUserId,
  index,
}: { post: PostView; currentUserId: string | undefined; index: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    null,
  );
  const { t, isRTL: isRtl } = useLanguage();
  const navigate = useNavigate();

  const editPost = useEditPost();
  const deletePost = useDeletePost();
  const { actor } = useAuthenticatedBackend();
  const qc = useQueryClient();

  const postIdStr = post.id.toString();
  const isOwner =
    currentUserId !== undefined && currentUserId === post.authorId.toString();
  const isEdited = post.updatedAt > post.createdAt;
  const isVerified = isVerifiedUser(post.authorName ?? "");

  // Author profile navigation — any user can click to visit a profile
  const authorId = post.authorId?.toString();
  const handleAuthorClick = () => {
    if (authorId) {
      void navigate({ to: "/profile/$userId", params: { userId: authorId } });
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await editPost.mutateAsync({
      postId: post.id,
      content: editContent.trim(),
    });
    setIsEditing(false);
  };

  const handlePin = async () => {
    if (!actor) return;
    await actor.pinPost(post.id);
    void qc.invalidateQueries({ queryKey: ["feed"] });
    toast.success(t.postPinned ?? "Post pinned");
  };

  const handleUnpin = async () => {
    if (!actor) return;
    await actor.unpinPost();
    void qc.invalidateQueries({ queryKey: ["feed"] });
    toast.success(t.postUnpinned ?? "Post unpinned");
  };

  const handleLike = () => {
    if (!actor) return;
    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked((v) => !v);
    setLikeCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    // Backend call — fire and forget, revert on error
    const call = wasLiked ? actor.unlikePost(post.id) : actor.likePost(post.id);
    call.catch(() => {
      setIsLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
      toast.error(t.failedToPublishPost);
    });
  };

  const handleReact = (type: ReactionType) => {
    if (!actor) return;
    const prev = currentReaction;
    const next = prev === type ? null : type;
    setCurrentReaction(next);
    setShowReactionPicker(false);
    // Backend call — fire and forget
    const call =
      next === null
        ? actor.removeReaction(post.id)
        : actor.reactToPost(post.id, type);
    call.catch(() => {
      setCurrentReaction(prev);
      toast.error(t.failedToPublishPost);
    });
  };

  const handleSave = () => {
    setIsSaved((v) => !v);
    toast.success(isSaved ? t.unsavePost : t.savePost);
  };

  const handleShare = () => {
    if (!actor) return;
    // Repost within Zaren Veto
    actor
      .sharePost(post.id)
      .then(() => {
        setTimeout(() => {
          void qc.invalidateQueries({ queryKey: ["feed"] });
        }, 0);
        toast.success(t.shareToFeed);
      })
      .catch(() => {
        toast.error(t.failedToPublishPost);
      });
  };

  const reactionEmoji = currentReaction
    ? REACTIONS.find((r) => r.type === currentReaction)?.emoji
    : null;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth"
        data-ocid={`post-card.item.${index + 1}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="px-3 sm:px-5 pt-3 sm:pt-5 pb-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleAuthorClick}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border text-sm font-bold text-foreground hover:opacity-80 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`View ${post.authorName}'s profile`}
                data-ocid={`post-author-avatar-${postIdStr}`}
              >
                {post.authorName[0]?.toUpperCase() ?? "?"}
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    onClick={handleAuthorClick}
                    className="inline-flex items-center text-sm font-semibold text-foreground min-w-0 hover:text-primary transition-smooth focus-visible:outline-none"
                    style={{ gap: "2px" }}
                    data-ocid={`post-author-name-${postIdStr}`}
                  >
                    <span className="truncate">{post.authorName}</span>
                    {isVerified && <VerificationBadge size={16} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  {isEdited && <span className="opacity-60">· {t.edited}</span>}
                  {post.visibility === Visibility.followersOnly ? (
                    <span className="flex items-center gap-0.5 opacity-70">
                      <Lock className="w-2.5 h-2.5" />
                      {t.followers}
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 opacity-60">
                      <Globe className="w-2.5 h-2.5" />
                      {t.everyone}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Options menu */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowOptionsMenu((v) => !v)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                aria-label="Post options"
                data-ocid={`post-options-${postIdStr}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showOptionsMenu && (
                  <PostOptionsMenu
                    postId={post.id}
                    postIdStr={postIdStr}
                    isOwner={isOwner}
                    isSaved={isSaved}
                    onEdit={() => setIsEditing(true)}
                    onDelete={() => setShowDeleteDialog(true)}
                    onSave={handleSave}
                    onReport={() => setShowReportDialog(true)}
                    onPin={() => void handlePin()}
                    onUnpin={() => void handleUnpin()}
                    isPinned={post.isPinned}
                    onClose={() => setShowOptionsMenu(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Pinned indicator */}
          {post.isPinned && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-2 -mt-1">
              <Pin className="w-3.5 h-3.5" />
              {t.pinnedPost ?? "Pinned Post"}
            </div>
          )}

          {/* Content */}
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                maxLength={MAX_CHARS + 50}
                autoFocus
                disabled={editPost.isPending}
                data-ocid={`edit-textarea-${postIdStr}`}
                className="bg-secondary border-input resize-none text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono tabular-nums">
                  {MAX_CHARS - editContent.length} {t.remaining}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditContent(post.content);
                      setIsEditing(false);
                    }}
                    disabled={editPost.isPending}
                    className="h-8"
                    data-ocid={`cancel-edit-${postIdStr}`}
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void handleSaveEdit()}
                    disabled={!editContent.trim() || editPost.isPending}
                    className="h-8"
                    data-ocid={`save-edit-${postIdStr}`}
                  >
                    {editPost.isPending ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t.saving}
                      </span>
                    ) : (
                      t.saveChanges
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words mb-1">
              {renderPostContent(post.content)}
            </p>
          )}

          {/* Poll display */}
          <PostPollDisplay postId={post.id} postIdStr={postIdStr} />

          {/* Reaction summary */}
          {(isLiked || currentReaction) && (
            <div className="flex items-center gap-1.5 mt-2 mb-1">
              {isLiked && (
                <span className="text-xs text-[#E0245E] font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-[#E0245E]" />
                  {likeCount}
                </span>
              )}
              {currentReaction && (
                <span className="text-sm">{reactionEmoji}</span>
              )}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="px-2 sm:px-4 py-2 border-t border-border/60 flex items-center gap-0.5 sm:gap-1">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${isLiked ? "text-[#E0245E]" : "text-muted-foreground hover:text-foreground"}`}
            data-ocid={`like-btn-${postIdStr}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-[#E0245E]" : ""}`} />
            <span className="hidden sm:inline">
              {isLiked ? t.liked : t.like}
            </span>
            {likeCount > 0 && <span className="tabular-nums">{likeCount}</span>}
          </button>

          {/* React */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowReactionPicker((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${currentReaction ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid={`react-btn-${postIdStr}`}
            >
              {reactionEmoji ? (
                <span className="text-base leading-none">{reactionEmoji}</span>
              ) : (
                <span className="text-base leading-none">😊</span>
              )}
              <span className="hidden sm:inline">{t.react}</span>
            </button>
            <AnimatePresence>
              {showReactionPicker && (
                <ReactionPicker
                  onReact={handleReact}
                  currentReaction={currentReaction}
                  postIdStr={postIdStr}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${showComments ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            data-ocid={`comment-btn-${postIdStr}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">{t.comment}</span>
            {showComments ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {/* Share */}
          <div className="relative ms-auto">
            <button
              type="button"
              onClick={() => setShowShareMenu((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
              data-ocid={`share-btn-${postIdStr}`}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t.share}</span>
            </button>
            <AnimatePresence>
              {showShareMenu && (
                <ShareDropdown
                  postIdStr={postIdStr}
                  onShare={handleShare}
                  onClose={() => setShowShareMenu(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Comment section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden px-5 pb-4"
            >
              <CommentSection postId={post.id} postIdStr={postIdStr} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>

      {/* Delete dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="delete-confirm-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {t.deletePostTitle}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {t.deletePostDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deletePost.isPending}
              data-ocid="delete-cancel"
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deletePost.mutate(post.id);
                setShowDeleteDialog(false);
              }}
              disabled={deletePost.isPending}
              data-ocid="delete-confirm"
            >
              {deletePost.isPending ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                  {t.deleting}
                </span>
              ) : (
                t.deletePost
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReportDialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        postIdStr={postIdStr}
      />
    </>
  );
}

// ─── Notifications Panel ──────────────────────────────────────────────────────

function NotificationsPanel({
  notifications,
  onClose,
}: { notifications: NotificationView[]; onClose: () => void }) {
  const { t, isRTL: isRtl } = useLanguage();

  const getNotifText = (n: NotificationView) => {
    const kind = n.notifType.__kind__;
    const map: Record<string, string> = {
      like: t.notifLiked,
      comment: t.notifCommented,
      follow: t.notifFollowed,
      mention: t.notifMentioned,
      share: t.notifShared,
      reaction: t.notifLiked,
      friendRequest: t.notifFollowed,
      verified: t.verifiedAccount,
    };
    return map[kind] ?? kind;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRtl ? -20 : 20 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-y-0 end-0 w-full sm:w-96 bg-card border-s border-border shadow-2xl z-50 flex flex-col"
      data-ocid="notifications-panel"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h2 className="font-display text-base font-semibold text-foreground">
          {t.notificationsTitle}
        </h2>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              data-ocid="mark-all-read"
            >
              {t.markAllRead}
            </Button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
            aria-label="Close"
            data-ocid="notifications-close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center"
            data-ocid="notifications-empty"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {t.notificationsEmpty}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.notificationsEmptyDesc}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n, i) => (
              <div
                key={n.id.toString()}
                className={`flex items-start gap-3 p-4 ${!n.isRead ? "bg-primary/5" : "hover:bg-secondary/50"} transition-smooth`}
                data-ocid={`notification.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs font-bold text-foreground">
                  {n.actorName[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{n.actorName}</span>{" "}
                    {getNotifText(n)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// needed for empty state icon
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      aria-label="Bell"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function EmptyFeed() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      data-ocid="feed-empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-5">
        <MessageSquare className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
        {t.feedIsQuiet}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {t.feedIsQuietDesc}
      </p>
    </motion.div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useLanguage();
  return (
    <div
      className="flex flex-col items-center gap-3 py-10 text-center"
      data-ocid="feed-error_state"
    >
      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-destructive" />
      </div>
      <p className="text-sm text-muted-foreground">{t.couldNotLoadFeed}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        data-ocid="feed-retry"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        {t.tryAgain}
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FeedPage() {
  const { status, profile } = useCurrentUser();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showNotifications, setShowNotifications] = useState(false);
  const { t, isRTL: isRtl } = useLanguage();

  const { data: posts, isLoading, isError, refetch } = useFeed();
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/login" });
    }
  }, [status, navigate]);

  if (status === "initializing")
    return (
      <Layout>
        <FeedSkeleton />
      </Layout>
    );
  if (status === "registering")
    return (
      <Layout bare>
        <RegistrationForm />
      </Layout>
    );
  if (status === "unauthenticated") return null;

  const currentUserId = profile?.id?.toString();
  const visiblePosts = (posts ?? []).slice(0, visibleCount);
  const hasMore = (posts?.length ?? 0) > visibleCount;

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto space-y-5"
        data-ocid="feed-page"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {t.yourFeed}
          </h1>
          <div className="flex items-center gap-3">
            {!isLoading && posts && posts.length > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {posts.length} {posts.length !== 1 ? t.posts : t.post}
              </span>
            )}
            <NotificationBell
              unreadCount={unreadCount}
              onClick={() => setShowNotifications(true)}
            />
          </div>
        </div>

        {/* Stories carousel */}
        <StoriesCarousel
          currentUserId={currentUserId}
          onCreateStory={() => void navigate({ to: "/stories" })}
        />

        {/* Create post */}
        <CreatePostForm />

        {/* Feed states */}
        {isLoading && <FeedSkeleton />}
        {isError && <ErrorState onRetry={() => void refetch()} />}
        {!isLoading && !isError && posts && posts.length === 0 && <EmptyFeed />}

        {!isLoading && !isError && visiblePosts.length > 0 && (
          <div className="space-y-4" data-ocid="feed-list">
            <AnimatePresence>
              {visiblePosts.map((post, index) => (
                <PostCard
                  key={post.id.toString()}
                  post={post}
                  currentUserId={currentUserId}
                  index={index}
                />
              ))}
            </AnimatePresence>
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center pt-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="h-9 px-6 border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-smooth"
                  data-ocid="load-more"
                >
                  {t.loadMorePosts}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Notifications panel overlay */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              onClick={() => setShowNotifications(false)}
              data-ocid="notifications-overlay"
            />
            <NotificationsPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
            />
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
