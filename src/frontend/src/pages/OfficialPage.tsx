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
  Camera,
  Check,
  Copy,
  Globe,
  Heart,
  MessageSquare,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

// ─── Post Card ────────────────────────────────────────────────────────────────

function OfficialPostCard({ post, index }: { post: PostView; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { t } = useLanguage();

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleShare = () => {
    void navigator.clipboard.writeText(
      `${window.location.origin}/post/${post.id.toString()}`,
    );
    toast.success(t.linkCopied);
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <ShieldLogo size={24} />
          </div>
          <div>
            <p
              className="inline-flex items-center text-sm font-semibold text-foreground"
              style={{ gap: "3px" }}
            >
              <span>Zaren Veto</span>
              <VerificationBadge size={16} />
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          {post.content}
        </p>
      </div>

      <div className="px-4 py-2 border-t border-border/60 flex items-center gap-1">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`}
          data-ocid={`official-page.like.${index + 1}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
          {likeCount > 0 && <span className="tabular-nums">{likeCount}</span>}
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          data-ocid={`official-page.comment.${index + 1}`}
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth ms-auto"
          data-ocid={`official-page.share.${index + 1}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
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

  const [following, setFollowing] = useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [pageLinkCopied, setPageLinkCopied] = useState(false);

  const handleCopyPageLink = () => {
    const url = `${window.location.origin}/official-page`;
    const doFallback = () => {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setPageLinkCopied(true);
        toast.success(t.linkCopied);
        setTimeout(() => setPageLinkCopied(false), 3000);
      } catch {
        toast.error(t.actionFailed ?? "Copy failed");
      }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setPageLinkCopied(true);
          toast.success(t.linkCopied);
          setTimeout(() => setPageLinkCopied(false), 3000);
        })
        .catch(doFallback);
    } else {
      doFallback();
    }
  };

  const { data: officialPage, isLoading: pageLoading } = useOfficialPage();
  const officialId = officialPage?.id?.toString() ?? null;
  const { data: posts, isLoading: postsLoading } = useOfficialPosts();

  // Sync photos from backend profile
  useEffect(() => {
    if (officialPage?.coverPhotoUrl)
      setCoverPhotoUrl(officialPage.coverPhotoUrl);
    if (officialPage?.profilePhotoUrl)
      setProfilePhotoUrl(officialPage.profilePhotoUrl);
  }, [officialPage?.coverPhotoUrl, officialPage?.profilePhotoUrl]);

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  // Determine if the current user is the owner/admin of the official page
  const isOwner =
    status === "authenticated" &&
    myProfile !== null &&
    isVerifiedUser(myProfile.username, myProfile.isVerified);

  const handleCoverFile = async (file: File) => {
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setCoverPhotoUrl(url);
      if (actor && isOwner) await actor.updateCoverPhoto(url);
      queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      toast.success(t.coverPhotoUpdated);
    } catch {
      toast.error(t.photoUploadFailed);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleProfileFile = async (file: File) => {
    setUploadingProfilePhoto(true);
    try {
      const url = await uploadImage(file);
      setProfilePhotoUrl(url);
      if (actor && isOwner) await actor.updateProfilePhoto(url);
      queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      toast.success(t.profilePhotoUpdated);
    } catch {
      toast.error(t.photoUploadFailed);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !officialId) throw new Error();
      const { Principal } = await import("@icp-sdk/core/principal");
      if (following) {
        return actor.unfollowUser(Principal.fromText(officialId));
      }
      return actor.followUser(Principal.fromText(officialId));
    },
    onSuccess: () => {
      setFollowing((v) => !v);
      queryClient.invalidateQueries({ queryKey: ["officialPage"] });
    },
    onError: () => toast.error(t.actionFailed),
  });

  const handlePublish = async () => {
    const content = newPostContent.trim();
    if (!content) return;
    setPublishing(true);
    try {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.createOfficialPost(content, null);
      if (result.__kind__ === "err") throw new Error(result.err);
      queryClient.invalidateQueries({ queryKey: ["officialPosts"] });
      setNewPostContent("");
      toast.success(t.postPublished);
    } catch {
      toast.error(t.failedToPublishPost);
    } finally {
      setPublishing(false);
    }
  };

  if (status === "initializing" || pageLoading) {
    return (
      <Layout>
        <div
          className="max-w-2xl mx-auto space-y-4"
          data-ocid="official-page.loading_state"
        >
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-52" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const postCount = posts?.length ?? 0;

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto space-y-6"
        data-ocid="official-page.page"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* ── Page Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border rounded-2xl shadow-sm"
          style={{ overflow: "visible" }}
        >
          {/* Cover photo */}
          <div
            className="relative w-full rounded-t-2xl"
            style={{ height: 210, overflow: "visible" }}
          >
            {coverPhotoUrl ? (
              <img
                src={coverPhotoUrl}
                alt="Cover"
                className="w-full h-full object-cover rounded-t-2xl"
                style={{ height: 210 }}
              />
            ) : (
              <div
                className="w-full h-full rounded-t-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #1a237e 0%, #4169E1 40%, #5c85f5 70%, #2a3a8f 100%)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <ShieldLogo size={200} />
                </div>
                <div className="absolute top-4 right-6 opacity-15">
                  <ShieldLogo size={56} />
                </div>
              </div>
            )}

            {/* Camera — cover (owner only) */}
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

            {/* Circular avatar — straddles cover bottom edge */}
            <div className="absolute left-5 z-10" style={{ bottom: -56 }}>
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full border-4 border-card overflow-hidden shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: "#0d1230" }}
                  data-ocid="official-page.avatar"
                >
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt="Zaren Veto"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ShieldLogo size={72} />
                  )}
                </div>

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
          </div>

          {/* Content below cover */}
          <div className="px-5 pb-6" style={{ paddingTop: 68 }}>
            {/* Actions row */}
            <div className="flex items-center justify-end mb-4">
              {!isOwner && (
                <Button
                  variant={following ? "outline" : "default"}
                  size="sm"
                  onClick={() => void followMutation.mutateAsync()}
                  disabled={followMutation.isPending}
                  className="gap-2 transition-smooth"
                  data-ocid="official-page.follow_button"
                >
                  {followMutation.isPending ? (
                    <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <Users className="w-3.5 h-3.5" />
                  )}
                  {following ? t.following : t.follow}
                </Button>
              )}
            </div>

            {/* Name + badge */}
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold text-foreground">
                <span
                  className="inline-flex items-center"
                  style={{ gap: "4px" }}
                >
                  <span>Zaren Veto</span>
                  <VerificationBadge size={24} />
                </span>
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Page officielle · Application
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                The official page of Zaren Veto — Your private social network.
                Digital sovereignty, end-to-end encryption, and zero tracking.
              </p>
              <div className="flex items-center gap-4 flex-wrap mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  zarenveto.com
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Privacy-first social network
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-5 pt-4 border-t border-border/60 flex-wrap">
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-display text-xl font-semibold text-foreground">
                  19k
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t.profileFollowers}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-display text-xl font-semibold text-foreground">
                  {postCount}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t.profilePosts}
                </span>
              </div>
              <span className="ms-auto inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full">
                <VerificationBadge size={12} />
                Page Officielle
              </span>
            </div>

            {/* Copy page link — full-width prominent button */}
            <button
              type="button"
              onClick={handleCopyPageLink}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-smooth shadow-sm active:scale-[0.98] ${
                pageLinkCopied
                  ? "bg-green-600 text-white border border-green-500/60"
                  : "bg-[#4169E1] hover:bg-[#3457c8] text-white border border-[#4169E1]/80"
              }`}
              data-ocid="official-page.copy_link_button"
            >
              {pageLinkCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {pageLinkCopied ? t.linkCopied : t.copyLink}
            </button>
          </div>
        </motion.div>

        {/* ── Back button ── */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
            data-ocid="official-page.back_button"
          >
            ← {t.backToFeed}
          </button>
          <p className="text-xs text-muted-foreground">
            Zaren Veto · Page officielle
          </p>
        </div>

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
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <ShieldLogo size={22} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {t.whatsOnYourMind}
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

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {newPostContent.length}/500
              </span>
              <Button
                size="sm"
                disabled={!newPostContent.trim() || publishing}
                onClick={() => void handlePublish()}
                className="gap-2"
                data-ocid="official-page.publish_button"
              >
                {publishing ? (
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : null}
                {t.publish}
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
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4" data-ocid="official-page.posts_list">
            {(!posts || posts.length === 0) && (
              <div
                className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl"
                data-ocid="official-page.posts_list.empty_state"
              >
                <ShieldLogo size={40} />
                <p className="text-sm text-muted-foreground mt-4">
                  {t.noPostsYet}
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
