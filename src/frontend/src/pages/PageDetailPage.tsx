import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { PostView, UserProfile } from "@/types";
import { Visibility } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileText,
  Heart,
  Link2,
  MessageSquare,
  Share2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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

// ─── Post Card ────────────────────────────────────────────────────────────────

function PagePostCard({ post, index }: { post: PostView; index: number }) {
  const { actor } = useAuthenticatedBackend();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();
  const { t } = useLanguage();

  const formattedDate = new Date(
    Number(post.createdAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleLike = () => {
    if (!actor) return;
    const wasLiked = liked;
    setLiked((v) => !v);
    setLikeCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
    const call = wasLiked ? actor.unlikePost(post.id) : actor.likePost(post.id);
    call.catch(() => {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : Math.max(0, c - 1)));
    });
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || !actor || submitting) return;
    setSubmitting(true);
    try {
      await actor.addComment(post.id, text);
      void qc.invalidateQueries({
        queryKey: ["pageComments", post.id.toString()],
      });
      setCommentText("");
      toast.success(t.postComment);
    } catch {
      toast.error(t.actionFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id.toString()}`;
    if (navigator.share) {
      void navigator.share({ title: "Zaren Veto", url }).catch(() => {});
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth"
      data-ocid={`page-detail.post.item.${index + 1}`}
    >
      <div className="px-5 pt-5 pb-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {renderPostContent(post.content)}
        </p>
        {post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border/40">
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full object-cover max-h-80"
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">{formattedDate}</p>
      </div>

      {/* Action bar */}
      <div className="px-3 py-2 border-t border-border/60 flex items-center gap-0.5">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${liked ? "text-[#E0245E]" : "text-muted-foreground hover:text-foreground"}`}
          data-ocid={`page-detail.like_button.${index + 1}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-[#E0245E]" : ""}`} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setShowComment((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          data-ocid={`page-detail.comment_button.${index + 1}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.comment}</span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth ms-auto"
          data-ocid={`page-detail.share_button.${index + 1}`}
        >
          <Share2 className="w-4 h-4" />
          <span>{t.share}</span>
        </button>
      </div>

      {showComment && (
        <div className="px-4 pb-3 border-t border-border/40 pt-3">
          <form
            onSubmit={(e) => void handleComment(e)}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.addComment}
              className="flex-1 text-sm bg-secondary rounded-full px-4 py-2 border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
              disabled={submitting}
              maxLength={500}
              data-ocid={`page-detail.comment_input.${index + 1}`}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 transition-smooth hover:bg-primary/90"
              aria-label={t.postComment}
            >
              {submitting ? (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin block" />
              ) : (
                "→"
              )}
            </button>
          </form>
        </div>
      )}
    </motion.article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PageDetailPage() {
  const { status, profile: myProfile } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const params = useParams({ strict: false }) as { pageId?: string };
  const pageId = params.pageId ?? "";

  const [following, setFollowing] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  const { data: page, isLoading: pageLoading } = useQuery<UserProfile | null>({
    queryKey: ["pageDetail", pageId],
    queryFn: async () => {
      if (!actor || !pageId) return null;
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        return (await actor.getUserProfile(Principal.fromText(pageId))) ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!pageId,
    retry: false,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<PostView[]>({
    queryKey: ["pageDetailPosts", pageId],
    queryFn: async () => {
      if (!actor || !pageId) return [];
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        return (await actor.getUserPosts(Principal.fromText(pageId))) ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!pageId,
    retry: false,
  });

  const isVerified = isVerifiedUser(page?.username ?? "", page?.isVerified);
  const isOwner =
    status === "authenticated" &&
    myProfile !== null &&
    myProfile.id.toText() === pageId;

  const handleFollow = async () => {
    if (!actor) return;
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      if (following) {
        await actor.unfollowUser(Principal.fromText(pageId));
        setFollowing(false);
      } else {
        await actor.followUser(Principal.fromText(pageId));
        setFollowing(true);
      }
      void qc.invalidateQueries({ queryKey: ["pageDetail", pageId] });
    } catch {
      toast.error(t.actionFailed);
    }
  };

  const handlePublish = async () => {
    const content = newPostContent.trim();
    if (!content || publishing || !actor) return;
    setPublishing(true);
    try {
      const result = await actor.createPost(
        content,
        Visibility.everyone,
        [],
        null,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      void qc.invalidateQueries({ queryKey: ["pageDetailPosts", pageId] });
      setNewPostContent("");
      toast.success(t.postPublished);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.failedToPublishPost;
      toast.error(msg);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/pages/${pageId}`;
    const doCopy = () => {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setLinkCopied(true);
      toast.success(t.linkCopied);
      setTimeout(() => setLinkCopied(false), 3000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setLinkCopied(true);
          toast.success(t.linkCopied);
          setTimeout(() => setLinkCopied(false), 3000);
        })
        .catch(doCopy);
    } else {
      doCopy();
    }
  };

  if (status === "initializing" || pageLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto py-16 text-center"
          data-ocid="page-detail.not_found"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Page introuvable
          </h2>
          <Button
            variant="outline"
            onClick={() => void navigate({ to: "/pages" })}
          >
            Retour aux pages
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto space-y-5 pb-8"
        data-ocid="page-detail.page"
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => void navigate({ to: "/pages" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth px-1"
          data-ocid="page-detail.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Toutes les pages
        </button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Cover */}
          <div
            className="w-full h-48 relative overflow-hidden"
            style={{
              background: page.coverPhotoUrl
                ? undefined
                : "linear-gradient(135deg,#0f1c5e 0%,#4169E1 60%,#5c7df5 100%)",
            }}
          >
            {page.coverPhotoUrl && (
              <img
                src={page.coverPhotoUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="px-5 pb-5 pt-0">
            {/* Avatar + actions */}
            <div
              className="flex items-end justify-between gap-3"
              style={{ marginTop: -40 }}
            >
              <div className="w-20 h-20 rounded-full border-4 border-card bg-secondary overflow-hidden flex items-center justify-center shadow-md">
                {page.profilePhotoUrl ? (
                  <img
                    src={page.profilePhotoUrl}
                    alt={page.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-display text-2xl font-bold text-primary">
                    {page.username.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              {!isOwner && (
                <Button
                  variant={following ? "outline" : "default"}
                  size="sm"
                  onClick={() => void handleFollow()}
                  className="gap-2 mb-1"
                  data-ocid="page-detail.follow_button"
                >
                  <Users className="w-3.5 h-3.5" />
                  {following ? t.unfollow : t.follow}
                </Button>
              )}
            </div>

            {/* Name + badge */}
            <div className="mt-3">
              <h1 className="font-display text-2xl font-semibold text-foreground inline-flex items-center gap-1.5">
                <span>{page.username}</span>
                {isVerified && <VerificationBadge size={20} />}
              </h1>
              {page.bio && (
                <p className="text-sm text-muted-foreground mt-1">{page.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/60">
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-display text-xl font-bold text-foreground">
                  {Number(page.followerCount).toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t.profileFollowers}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-display text-xl font-bold text-foreground">
                  {posts.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t.profilePosts}
                </span>
              </div>
            </div>

            {/* Copy link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-smooth border ${
                linkCopied
                  ? "bg-green-600 text-white border-green-500/50"
                  : "bg-[#4169E1] hover:bg-[#3457c8] text-white border-[#4169E1]/70"
              }`}
              data-ocid="page-detail.copy_link_button"
            >
              <Link2 className="w-4 h-4" />
              {linkCopied ? t.linkCopied : t.copyLink}
            </button>
          </div>
        </motion.div>

        {/* Create post (owner only) */}
        {isOwner && (
          <div
            className="bg-card border border-border rounded-xl p-4 space-y-3"
            data-ocid="page-detail.create_post_section"
          >
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={t.whatsOnYourMind}
              rows={3}
              className="bg-secondary border-input resize-none text-sm"
              data-ocid="page-detail.post_input"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                disabled={!newPostContent.trim() || publishing}
                onClick={() => void handlePublish()}
                className="gap-2"
                data-ocid="page-detail.publish_button"
              >
                {publishing ? (
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : null}
                {t.publish}
              </Button>
            </div>
          </div>
        )}

        {/* Posts */}
        {postsLoading ? (
          <div
            className="space-y-4"
            data-ocid="page-detail.posts.loading_state"
          >
            {["a", "b"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl"
            data-ocid="page-detail.posts.empty_state"
          >
            <FileText className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">{t.noPostsYet}</p>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="page-detail.posts_list">
            {posts.map((post, i) => (
              <PagePostCard key={post.id.toString()} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
