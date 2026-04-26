import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useLanguage } from "@/i18n/LanguageContext";
import type { PostView, UserProfile } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  Heart,
  ImagePlus,
  MessageSquare,
  Send,
  Share2,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_SIZE = 112; // px — diameter of the circular profile photo
const AVATAR_HALF = AVATAR_SIZE / 2; // 56px — how far it overlaps below cover

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

// ─── Shield Logo ──────────────────────────────────────────────────────────────

function ShieldLogo({ size = 80 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M38 42 L100 18 L162 42 L162 100 C162 144 134 172 100 185 C66 172 38 144 38 100 Z"
        fill="#4169E1"
      />
      <path
        d="M67 72 L133 72 L133 86 L91 122 L133 122 L133 136 L67 136 L67 122 L109 86 L67 86 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

// ─── Camera Upload Button ─────────────────────────────────────────────────────

function CameraUploadButton({
  onFile,
  ocid,
  className,
  title,
  uploading,
}: {
  onFile: (file: File) => void;
  ocid: string;
  className?: string;
  title: string;
  uploading?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          if (ref.current) ref.current.value = "";
        }}
        aria-label={title}
      />
      <button
        type="button"
        title={title}
        aria-label={title}
        data-ocid={ocid}
        disabled={uploading}
        onClick={() => ref.current?.click()}
        className={`transition-smooth ${className ?? ""}`}
      >
        {uploading ? (
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin block" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </button>
    </>
  );
}

// ─── Reaction Emojis ──────────────────────────────────────────────────────────

const REACTIONS = [
  { emoji: "👍", label: "J'aime" },
  { emoji: "❤️", label: "J'adore" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Triste" },
  { emoji: "😡", label: "Grrr" },
];

// ─── Post Card ────────────────────────────────────────────────────────────────

function OfficialPostCard({ post, index }: { post: PostView; index: number }) {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { t } = useLanguage();

  const handleLike = () => {
    if (activeReaction) {
      // Save previous state for revert
      const prevReaction = activeReaction;
      const prevLiked = liked;
      const prevCount = likeCount;
      // Optimistic update
      setActiveReaction(null);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      // Backend call — revert on error
      if (actor) {
        actor.unlikePost(post.id).catch(() => {
          setActiveReaction(prevReaction);
          setLiked(prevLiked);
          setLikeCount(prevCount);
        });
      }
    } else {
      const wasLiked = liked;
      const prevCount = likeCount;
      // Optimistic update
      setLiked((v) => !v);
      setLikeCount((c) => (wasLiked ? Math.max(0, c - 1) : c + 1));
      // Backend call — revert on error
      if (actor) {
        const call = wasLiked
          ? actor.unlikePost(post.id)
          : actor.likePost(post.id);
        call.catch(() => {
          setLiked(wasLiked);
          setLikeCount(prevCount);
        });
      }
    }
    setShowReactions(false);
  };

  const handleReaction = (emoji: string, label: string) => {
    const prevReaction = activeReaction;
    const prevLiked = liked;
    const prevCount = likeCount;
    if (activeReaction === emoji) {
      // Remove reaction — optimistic update
      setActiveReaction(null);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      if (actor) {
        actor.removeReaction(post.id).catch(() => {
          setActiveReaction(prevReaction);
          setLiked(prevLiked);
          setLikeCount(prevCount);
        });
      }
    } else {
      // Set reaction — optimistic update
      if (!activeReaction) setLikeCount((c) => c + 1);
      setActiveReaction(emoji);
      setLiked(true);
      toast.success(label);
      // Backend call — revert on error
      if (actor) {
        actor.likePost(post.id).catch(() => {
          setActiveReaction(prevReaction);
          setLiked(prevLiked);
          setLikeCount(prevCount);
        });
      }
    }
    setShowReactions(false);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/official-page`;
    const encodedUrl = encodeURIComponent(url);
    const hasNativeShare =
      typeof navigator !== "undefined" && typeof navigator.share === "function";

    if (hasNativeShare) {
      void navigator
        .share({ title: "Zaren Veto — Page officielle", url })
        .catch(() => {
          /* user cancelled */
        });
      return;
    }

    // Desktop fallback: open WhatsApp share
    window.open(
      `https://wa.me/?text=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || submittingComment || !actor) return;
    setSubmittingComment(true);
    try {
      await actor.addComment(post.id, text);
      await queryClient.invalidateQueries({
        queryKey: ["officialPostComments", post.id.toString()],
      });
      setCommentText("");
      toast.success(t.postComment);
    } catch {
      toast.error(t.actionFailed);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formattedDate = new Date(
    Number(post.createdAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth"
      data-ocid={`official-page.post.item.${index + 1}`}
    >
      <div className="px-5 pt-5 pb-3">
        {/* Post author header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "#0d1230" }}
          >
            <ShieldLogo size={24} />
          </div>
          <div>
            <p className="inline-flex items-center text-sm font-semibold text-foreground gap-1">
              <span>Zaren Veto</span>
              <VerificationBadge size={15} />
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Post content */}
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {renderPostContent(post.content)}
        </p>

        {/* Post media */}
        {post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border/40">
            <img
              src={post.imageUrl}
              alt="Contenu de la publication"
              className="w-full object-cover max-h-80"
            />
          </div>
        )}

        {/* Reaction summary */}
        {(likeCount > 0 || activeReaction) && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            {activeReaction && <span>{activeReaction}</span>}
            {!activeReaction && liked && <span>👍</span>}
            <span className="tabular-nums">{likeCount}</span>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-3 py-2 border-t border-border/60 flex items-center gap-0.5">
        {/* Like / Reaction button */}
        <div className="relative">
          {showReactions && (
            <div className="reaction-picker absolute bottom-full mb-1 left-0 z-30">
              {REACTIONS.map((r) => (
                <button
                  key={r.emoji}
                  type="button"
                  title={r.label}
                  aria-label={r.label}
                  onClick={() => handleReaction(r.emoji, r.label)}
                  className="text-2xl p-1 rounded-full transition-transform hover:scale-125 hover:-translate-y-1 border-none bg-transparent cursor-pointer"
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleLike}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setTimeout(() => setShowReactions(false), 400)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${
              liked
                ? "text-[#E0245E] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`official-page.like_button.${index + 1}`}
          >
            {activeReaction ? (
              <span className="text-base leading-none">{activeReaction}</span>
            ) : (
              <Heart
                className={`w-4 h-4 ${liked ? "fill-[#E0245E] text-[#E0245E]" : ""}`}
              />
            )}
            <span>
              {liked
                ? activeReaction
                  ? activeReaction === "❤️"
                    ? "J'adore"
                    : "Réaction"
                  : "J'aime"
                : t.like}
            </span>
          </button>
        </div>

        {/* Comment button */}
        <button
          type="button"
          onClick={() => setShowCommentBox((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          data-ocid={`official-page.comment_button.${index + 1}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.comment}</span>
        </button>

        {/* Share button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth ms-auto"
          data-ocid={`official-page.share_button.${index + 1}`}
        >
          <Share2 className="w-4 h-4" />
          <span>{t.share}</span>
        </button>
      </div>

      {/* Comment box — fully functional */}
      {showCommentBox && (
        <div className="px-4 pb-3 border-t border-border/40 pt-3 space-y-2">
          <form
            onSubmit={(e) => void handleSubmitComment(e)}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.addComment}
              className="flex-1 text-sm bg-secondary rounded-full px-4 py-2 border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
              disabled={submittingComment}
              maxLength={500}
              data-ocid={`official-page.comment_input.${index + 1}`}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submittingComment}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 transition-smooth hover:bg-primary/90"
              aria-label={t.postComment}
              data-ocid={`official-page.post_comment_button.${index + 1}`}
            >
              {submittingComment ? (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin block" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </form>
        </div>
      )}
    </motion.article>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useOfficialPage() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<UserProfile | null>({
    queryKey: ["officialPage"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOfficialPage();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

function useOfficialPosts() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<PostView[]>({
    queryKey: ["officialPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOfficialPagePosts(BigInt(0), BigInt(50));
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OfficialPage() {
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const { status, profile: myProfile } = useCurrentUser();
  const { uploadImage } = useImageUpload();
  const postImageRef = useRef<HTMLInputElement>(null);

  const [following, setFollowing] = useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [pageLinkCopied, setPageLinkCopied] = useState(false);

  // ── Copy page link ──────────────────────────────────────────────────────────
  const handleCopyPageLink = () => {
    const url = `${window.location.origin}/official-page`;
    const onSuccess = () => {
      setPageLinkCopied(true);
      toast.success(t.linkCopied);
      setTimeout(() => setPageLinkCopied(false), 3000);
    };
    const fallback = () => {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        onSuccess();
      } catch {
        toast.error(t.actionFailed ?? "Impossible de copier");
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(onSuccess).catch(fallback);
    } else {
      fallback();
    }
  };

  const { data: officialPage, isLoading: pageLoading } = useOfficialPage();
  const officialId = officialPage?.id?.toString() ?? null;
  const { data: posts, isLoading: postsLoading } = useOfficialPosts();

  // Sync photos from backend profile — using separate localStorage keys to decouple from owner's personal profile
  useEffect(() => {
    // Load from localStorage first (official page has its own keys)
    const savedCover = localStorage.getItem("officialPage_cover");
    const savedAvatar = localStorage.getItem("officialPage_avatar");
    if (savedCover) setCoverPhotoUrl(savedCover);
    else if (officialPage?.coverPhotoUrl)
      setCoverPhotoUrl(officialPage.coverPhotoUrl);
    if (savedAvatar) setProfilePhotoUrl(savedAvatar);
    else if (officialPage?.profilePhotoUrl)
      setProfilePhotoUrl(officialPage.profilePhotoUrl);
  }, [officialPage?.coverPhotoUrl, officialPage?.profilePhotoUrl]);

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  // Owner = verified user (Princess Narzine Bani Hashem)
  const isOwner =
    status === "authenticated" &&
    myProfile !== null &&
    isVerifiedUser(myProfile.username, myProfile.isVerified);

  // ── Image uploads — official page uses separate localStorage keys so they never affect the owner's personal profile ──
  const handleCoverFile = async (file: File) => {
    if (uploadingCover) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload returned empty URL");
      setCoverPhotoUrl(url);
      // Store under an official-page-specific key — completely independent of personal profile
      localStorage.setItem("officialPage_cover", url);
      void queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      toast.success(t.coverPhotoUpdated ?? "Photo de couverture mise à jour ✓");
    } catch (err) {
      console.error("Cover upload error:", err);
      toast.error(t.photoUploadFailed ?? "Échec du téléchargement — réessayez");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleProfileFile = async (file: File) => {
    if (uploadingProfilePhoto) return;
    setUploadingProfilePhoto(true);
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload returned empty URL");
      setProfilePhotoUrl(url);
      // Store under an official-page-specific key — completely independent of personal profile
      localStorage.setItem("officialPage_avatar", url);
      void queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      toast.success(t.profilePhotoUpdated ?? "Photo de profil mise à jour ✓");
    } catch (err) {
      console.error("Profile upload error:", err);
      toast.error(t.photoUploadFailed ?? "Échec du téléchargement — réessayez");
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  // ── Post image selection ────────────────────────────────────────────────────
  const handlePostImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setNewPostImage(url);
    } catch {
      toast.error(t.photoUploadFailed);
    } finally {
      if (postImageRef.current) postImageRef.current.value = "";
    }
  };

  // ── Follow ──────────────────────────────────────────────────────────────────
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !officialId) throw new Error("Not available");
      const { Principal } = await import("@icp-sdk/core/principal");
      if (following) {
        return actor.unfollowUser(Principal.fromText(officialId));
      }
      return actor.followUser(Principal.fromText(officialId));
    },
    onSuccess: () => {
      setFollowing((v) => !v);
      void queryClient.invalidateQueries({ queryKey: ["officialPage"] });
    },
    onError: () => toast.error(t.actionFailed),
  });

  // ── Publish post ────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    const content = newPostContent.trim();
    if (!content || publishing) return;
    if (!actor) {
      toast.error("Non authentifié — veuillez vous reconnecter");
      return;
    }
    if (!isOwner) {
      toast.error("Seul(e) la fondatrice peut publier sur cette page");
      return;
    }
    setPublishing(true);
    try {
      const result = await actor.createOfficialPost(
        content,
        newPostImage ?? null,
      );
      if ("__kind__" in result && result.__kind__ === "err") {
        throw new Error(result.err);
      }
      void queryClient.invalidateQueries({ queryKey: ["officialPosts"] });
      setNewPostContent("");
      setNewPostImage(null);
      toast.success(t.postPublished ?? "Publié avec succès ✓");
    } catch (err) {
      console.error("Publish error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.length < 100
          ? msg
          : (t.failedToPublishPost ?? "Échec de la publication"),
      );
    } finally {
      setPublishing(false);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (status === "initializing" || pageLoading) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto space-y-4 px-3"
          data-ocid="official-page.loading_state"
        >
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-52" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const postCount = posts?.length ?? 0;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto space-y-5 pb-8"
        data-ocid="official-page.page"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* ── Page Hero Card ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-2xl shadow-sm"
        >
          {/* ── Cover area (clip = hidden so cover stays inside, avatar overflows) ── */}
          <div
            className="relative w-full rounded-t-2xl"
            style={{
              height: 200,
              overflow: "hidden",
            }}
          >
            {/* Cover photo or gradient default */}
            {coverPhotoUrl ? (
              <img
                src={coverPhotoUrl}
                alt="Couverture de la page"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, #0f1c5e 0%, #2a3fa8 40%, #4169E1 65%, #5c7df5 85%, #2845b8 100%)",
                }}
              >
                {/* Subtle watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
                  <ShieldLogo size={180} />
                </div>
                <div className="absolute top-4 right-6 opacity-[0.12] pointer-events-none">
                  <ShieldLogo size={52} />
                </div>
              </div>
            )}

            {/* Camera button — cover (owner only) */}
            {isOwner && (
              <div className="absolute bottom-3 right-3 z-10">
                <CameraUploadButton
                  onFile={(f) => void handleCoverFile(f)}
                  uploading={uploadingCover}
                  ocid="official-page.cover_photo_upload_button"
                  title={t.changeCoverPhoto}
                  className="flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black/85 backdrop-blur-sm"
                />
              </div>
            )}
          </div>

          {/* ── Avatar (straddles the cover/content boundary) ── */}
          <div className="relative px-5" style={{ marginTop: -AVATAR_HALF }}>
            <div className="relative inline-block">
              <div
                className="rounded-full border-4 border-card shadow-lg overflow-hidden flex items-center justify-center"
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  backgroundColor: "#0d1230",
                  zIndex: 10,
                  position: "relative",
                }}
                data-ocid="official-page.avatar"
              >
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt="Zaren Veto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShieldLogo size={68} />
                )}
              </div>

              {/* Camera — profile photo (owner only) */}
              {isOwner && (
                <div className="absolute bottom-1 right-1 z-20">
                  <CameraUploadButton
                    onFile={(f) => void handleProfileFile(f)}
                    uploading={uploadingProfilePhoto}
                    ocid="official-page.profile_photo_upload_button"
                    title={t.changeProfilePhoto}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-black/75 hover:bg-black/90 border-2 border-card text-white shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Page info ── */}
          <div className="px-5 pb-5 pt-2">
            {/* Follow button row (non-owner) — fully functional with correct labels */}
            {!isOwner && (
              <div className="flex justify-end mb-3">
                <Button
                  variant={following ? "outline" : "default"}
                  size="sm"
                  onClick={() => void followMutation.mutateAsync()}
                  disabled={followMutation.isPending}
                  className="gap-2"
                  data-ocid="official-page.follow_button"
                >
                  {followMutation.isPending ? (
                    <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <Users className="w-3.5 h-3.5" />
                  )}
                  {following ? t.unfollow : t.follow}
                </Button>
              </div>
            )}

            {/* Page name + badge */}
            <h1 className="font-display text-2xl font-bold text-foreground inline-flex items-center gap-1.5">
              <span>Zaren Veto</span>
              <VerificationBadge size={22} />
            </h1>

            {/* Official page description — single label, NO "Personnalité Publique", NO long subtitle */}
            <div className="mt-1.5">
              <p className="text-sm font-semibold" style={{ color: "#4169E1" }}>
                Page officielle
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/60 flex-wrap">
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-display text-xl font-bold text-foreground">
                  19k
                </span>
                <span className="text-xs text-muted-foreground tracking-wide">
                  {t.profileFollowers}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-display text-xl font-bold text-foreground">
                  {postCount}
                </span>
                <span className="text-xs text-muted-foreground tracking-wide">
                  {t.profilePosts}
                </span>
              </div>
              <span
                className="ms-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{
                  color: "#4169E1",
                  borderColor: "#4169E133",
                  background: "#4169E10f",
                }}
              >
                <VerificationBadge size={12} />
                Page Officielle
              </span>
            </div>

            {/* Copy link — full-width prominent button */}
            <button
              type="button"
              onClick={handleCopyPageLink}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-smooth shadow-sm active:scale-[0.98] border ${
                pageLinkCopied
                  ? "bg-green-600 text-white border-green-500/50"
                  : "text-white border-[#4169E1]/70 hover:brightness-110"
              }`}
              style={pageLinkCopied ? {} : { background: "#4169E1" }}
              data-ocid="official-page.copy_link_button"
            >
              {pageLinkCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {pageLinkCopied
                ? (t.linkCopied ?? "Lien copié !")
                : (t.copyLink ?? "Copier le lien de la page")}
            </button>
          </div>
        </motion.div>

        {/* ── Back button ── */}
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth px-1"
          data-ocid="official-page.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToFeed}
        </button>

        {/* ── Create post (owner only) ── */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4 space-y-3"
            data-ocid="official-page.create_post_section"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: "#0d1230" }}
              >
                <ShieldLogo size={22} />
              </div>
              <span className="text-sm font-medium text-foreground">
                Publier sur la page Zaren Veto
              </span>
            </div>

            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={t.whatsOnYourMind}
              rows={3}
              maxLength={500}
              className="bg-secondary border-input resize-none text-sm"
              data-ocid="official-page.post_input"
            />

            {/* Image preview */}
            {newPostImage && (
              <div className="relative inline-block rounded-lg overflow-hidden border border-border/60">
                <img
                  src={newPostImage}
                  alt="Aperçu de la publication"
                  className="max-h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setNewPostImage(null)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-smooth"
                  aria-label="Supprimer la photo"
                  data-ocid="official-page.remove_post_image_button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {newPostContent.length}/500
                </span>
                {/* Image picker button */}
                <>
                  <input
                    ref={postImageRef}
                    type="file"
                    accept="image/*,video/*"
                    className="sr-only"
                    onChange={(e) => void handlePostImageSelect(e)}
                    aria-label="Ajouter une photo ou vidéo"
                  />
                  <button
                    type="button"
                    onClick={() => postImageRef.current?.click()}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-smooth"
                    title="Ajouter une photo ou vidéo"
                    data-ocid="official-page.post_image_button"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                  </button>
                </>
              </div>

              <Button
                size="sm"
                disabled={!newPostContent.trim() || publishing}
                onClick={() => void handlePublish()}
                className="gap-2 min-w-[90px]"
                data-ocid="official-page.publish_button"
              >
                {publishing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Publication…
                  </>
                ) : (
                  t.publish
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Posts feed ── */}
        {postsLoading ? (
          <div
            className="space-y-4"
            data-ocid="official-page.posts_list.loading_state"
          >
            {["a", "b"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4" data-ocid="official-page.posts_list">
            {(!posts || posts.length === 0) && (
              <div
                className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl gap-3"
                data-ocid="official-page.posts_list.empty_state"
              >
                <ShieldLogo size={40} />
                <p className="text-base font-semibold text-foreground">
                  Aucune publication pour l&apos;instant
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {isOwner
                    ? "Publiez le premier message sur la page officielle Zaren Veto."
                    : "Revenez bientôt pour découvrir les actualités de Zaren Veto."}
                </p>
              </div>
            )}
            {posts &&
              posts.length > 0 &&
              posts.map((post, index) => (
                <OfficialPostCard
                  key={post.id.toString()}
                  post={post}
                  index={index}
                />
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
