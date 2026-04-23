import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useLanguage } from "@/i18n/LanguageContext";
import type { CommentView, PostView, UserProfile } from "@/types";
import { ReactionType, Visibility } from "@/types";
import {
  OWNER_PROFILE_LINE1,
  OWNER_PROFILE_LINE2,
  isVerifiedUser,
} from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Bookmark,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  ImagePlus,
  Link2,
  Lock,
  MapPin,
  MessageSquare,
  Pin,
  Send,
  Share2,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Reaction definitions ─────────────────────────────────────────────────────

const REACTIONS: Array<{ type: ReactionType; emoji: string }> = [
  { type: ReactionType.love, emoji: "❤️" },
  { type: ReactionType.haha, emoji: "😂" },
  { type: ReactionType.wow, emoji: "😮" },
  { type: ReactionType.sad, emoji: "😢" },
  { type: ReactionType.angry, emoji: "😡" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useUserProfile(userId: string | undefined) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId ?? ""],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        const result = await actor.getUserProfile(Principal.fromText(userId));
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    retry: false,
  });
}

function useUserPosts(userId: string | undefined) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<PostView[]>({
    queryKey: ["userPosts", userId ?? ""],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        return (await actor.getUserPosts(Principal.fromText(userId))) ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    retry: false,
  });
}

function useIsFollowing(userId: string | undefined) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<boolean>({
    queryKey: ["isFollowing", userId ?? ""],
    queryFn: async () => {
      if (!actor || !userId) return false;
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        return (await actor.isFollowing(Principal.fromText(userId))) ?? false;
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    retry: false,
  });
}

function useFriendRequestStatus(userId: string | undefined, enabled: boolean) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<string>({
    queryKey: ["friendStatus", userId ?? ""],
    queryFn: async () => {
      if (!actor || !userId) return "none";
      try {
        const { Principal } = await import("@icp-sdk/core/principal");
        const result = await actor.getFriendRequestStatus(
          Principal.fromText(userId),
        );
        return result ?? "none";
      } catch {
        return "none";
      }
    },
    enabled: !!actor && !isFetching && !!userId && enabled,
    retry: false,
  });
}

function usePostComments(postId: bigint, enabled: boolean) {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery<CommentView[]>({
    queryKey: ["postComments", postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return (await actor.getComments(postId)) ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && enabled,
    retry: false,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-0" data-ocid="profile.loading_state">
      <div className="w-full h-56 bg-muted/60 rounded-t-2xl" />
      <div className="bg-card border border-border border-t-0 rounded-b-2xl px-6 pb-6">
        <div
          className="flex items-end justify-between mb-4"
          style={{ marginTop: -40 }}
        >
          <Skeleton className="w-[120px] h-[120px] rounded-full border-4 border-background" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-4" />
        <div className="flex gap-8 pt-4 border-t border-border/60">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

function StatBlock({
  value,
  label,
}: { value: bigint | number | string; label: string }) {
  const display =
    typeof value === "string" ? value : Number(value).toLocaleString();
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
      <span className="font-display text-xl font-semibold text-foreground">
        {display}
      </span>
      <span className="text-xs text-muted-foreground tracking-wide whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  const isPublic = visibility === Visibility.everyone;
  const { t } = useLanguage();
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 text-xs font-normal px-2.5 py-1 ${isPublic ? "border-primary/40 text-primary bg-primary/10" : "border-border text-muted-foreground bg-muted/40"}`}
      data-ocid="profile.visibility-badge"
    >
      {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
      {isPublic ? t.everyone : t.followersOnly}
    </Badge>
  );
}

function ShieldBadgeSVG({ size = 60 }: { size?: number }) {
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

// ─── Upload progress indicator ────────────────────────────────────────────────

function UploadProgressOverlay({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-inherit z-10">
      <span className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2 block" />
      <span className="text-white text-xs font-medium">{label}</span>
    </div>
  );
}

interface PhotoUploadButtonProps {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  label: string;
  ocid: string;
  icon?: React.ReactNode;
  className?: string;
}

function PhotoUploadButton({
  onUpload,
  uploading,
  label,
  ocid,
  icon,
  className = "",
}: PhotoUploadButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await onUpload(file);
    } catch {
      // error toast is shown by the caller
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/*"
        className="sr-only"
        onChange={(e) => void handleChange(e)}
        disabled={uploading}
        aria-label={label}
      />
      <button
        type="button"
        aria-label={label}
        data-ocid={ocid}
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className={`transition-smooth ${className}`}
      >
        {uploading ? (
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin block" />
        ) : (
          (icon ?? <Camera className="w-4 h-4" />)
        )}
      </button>
    </>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

interface AboutSectionProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

function AboutSection({ profile, isOwnProfile }: AboutSectionProps) {
  const isOwnerVerified = isVerifiedUser(profile.username, profile.isVerified);
  const [editing, setEditing] = useState(false);
  // For the verified owner, never show aboutBio (the two hardcoded blue lines are the canonical text)
  const [bio, setBio] = useState(
    isOwnerVerified ? "" : (profile.aboutBio ?? ""),
  );
  const [location, setLocation] = useState(profile.aboutLocation ?? "");
  const [work, setWork] = useState(profile.aboutWork ?? "");
  const [education, setEducation] = useState(profile.aboutEducation ?? "");
  const [website, setWebsite] = useState(profile.aboutWebsite ?? "");
  const [saving, setSaving] = useState(false);
  const { actor } = useAuthenticatedBackend();
  const { t } = useLanguage();

  const hasInfo =
    profile.aboutBio ||
    profile.aboutLocation ||
    profile.aboutWork ||
    profile.aboutEducation ||
    profile.aboutWebsite;

  if (!hasInfo && !isOwnProfile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!actor) throw new Error();
      await actor.updateAbout(
        bio.trim() || null,
        location.trim() || null,
        work.trim() || null,
        education.trim() || null,
        website.trim() || null,
      );
      toast.success(t.aboutUpdated);
      setEditing(false);
    } catch {
      toast.error(t.actionFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-xl p-5 space-y-4"
      data-ocid="profile.about_section"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-foreground">
          {t.aboutMe}
        </h2>
        {isOwnProfile && !editing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(true)}
            className="h-8 px-3 gap-1.5"
            data-ocid="profile.edit_about_button"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {t.editAbout}
          </Button>
        )}
      </div>

      {editing ? (
        <form
          onSubmit={(e) => void handleSave(e)}
          className="space-y-3"
          data-ocid="profile.about_form"
        >
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              {t.bio}
            </Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={280}
              className="bg-secondary border-input resize-none text-sm"
              placeholder={t.bioPlaceholder}
              data-ocid="profile.about_bio_input"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                {t.location}
              </Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-secondary border-input h-9 text-sm"
                placeholder="City, Country"
                data-ocid="profile.about_location_input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                {t.work}
              </Label>
              <Input
                value={work}
                onChange={(e) => setWork(e.target.value)}
                className="bg-secondary border-input h-9 text-sm"
                placeholder="Company or job title"
                data-ocid="profile.about_work_input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                {t.education}
              </Label>
              <Input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="bg-secondary border-input h-9 text-sm"
                placeholder="School or university"
                data-ocid="profile.about_education_input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                {t.website}
              </Label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="bg-secondary border-input h-9 text-sm"
                placeholder="https://yoursite.com"
                data-ocid="profile.about_website_input"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="gap-1.5"
              data-ocid="profile.about_save_button"
            >
              {saving ? (
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              {saving ? t.savingBtn : t.saveChangesBtn}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
              disabled={saving}
              className="gap-1.5"
              data-ocid="profile.about_cancel_button"
            >
              <X className="w-3.5 h-3.5" />
              {t.cancelBtn}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-2.5">
          {profile.aboutBio &&
            !isOwnerVerified &&
            !isVerifiedUser(profile.username, profile.isVerified) && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.aboutBio}
              </p>
            )}
          {profile.aboutWork && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
              {profile.aboutWork}
            </div>
          )}
          {profile.aboutEducation && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
              {profile.aboutEducation}
            </div>
          )}
          {profile.aboutLocation && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              {profile.aboutLocation}
            </div>
          )}
          {profile.aboutWebsite && (
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <a
                href={profile.aboutWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {profile.aboutWebsite}
              </a>
            </div>
          )}
          {!hasInfo && isOwnProfile && (
            <p className="text-sm text-muted-foreground italic">
              {t.noAboutYet}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Profile Hero ─────────────────────────────────────────────────────────────

interface ProfileHeroProps {
  profile: UserProfile;
  isOwnProfile: boolean;
  coverPhotoUrl: string | null;
  profilePhotoUrl: string | null;
  onCoverUpload: (file: File) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
  uploadingCover: boolean;
  uploadingAvatar: boolean;
  actionSlot: React.ReactNode;
  isVerified: boolean;
  followerCount?: string | bigint | number;
  showOfficialPageLink?: boolean;
}

function ProfileHero({
  profile,
  isOwnProfile,
  coverPhotoUrl,
  profilePhotoUrl,
  onCoverUpload,
  onAvatarUpload,
  uploadingCover,
  uploadingAvatar,
  actionSlot,
  isVerified,
  followerCount,
  showOfficialPageLink = false,
}: ProfileHeroProps) {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [linkCopied, setLinkCopied] = useState(false);
  const initials = profile.username.slice(0, 2).toUpperCase();
  const displayFollowers = followerCount ?? profile.followerCount;

  // Safe profile ID — null-checked to prevent routing errors
  const profileId = profile.id != null ? profile.id.toString() : null;

  const handleCopyProfileLink = () => {
    if (!profileId) {
      toast.error("Profile link not available");
      return;
    }
    const url = `${window.location.origin}/profile/${encodeURIComponent(profileId)}`;

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
        setLinkCopied(true);
        toast.success(t.linkCopied);
        setTimeout(() => setLinkCopied(false), 3000);
      } catch {
        toast.error(t.actionFailed ?? "Copy failed");
      }
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setLinkCopied(true);
          toast.success(t.linkCopied);
          setTimeout(() => setLinkCopied(false), 3000);
        })
        .catch(doFallback);
    } else {
      doFallback();
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Cover */}
      <div
        className="relative w-full aspect-[2/1] sm:aspect-[16/9]"
        style={{ maxHeight: "224px" }}
      >
        {coverPhotoUrl ? (
          <img
            src={coverPhotoUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-background flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="font-display text-3xl font-bold text-primary/40">
                {initials}
              </span>
            </div>
          </div>
        )}
        {/* Upload progress overlay on cover */}
        {uploadingCover && <UploadProgressOverlay label="Uploading…" />}
        {isOwnProfile && !uploadingCover && (
          <div className="absolute bottom-3 right-3">
            <PhotoUploadButton
              onUpload={onCoverUpload}
              uploading={uploadingCover}
              label={t.changeCoverPhoto}
              ocid="profile.cover_photo_upload_button"
              className="flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black/85 backdrop-blur-sm"
              icon={
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  {t.changeCoverPhoto}
                </span>
              }
            />
          </div>
        )}
      </div>

      {/* Avatar + actions */}
      <div className={`px-6 pb-6 ${isRTL ? "rtl" : ""}`}>
        <div
          className={`flex items-end ${isRTL ? "flex-row-reverse justify-end" : "justify-between"} flex-wrap gap-2`}
          style={{ marginTop: -44 }}
        >
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 sm:w-[120px] sm:h-[120px] rounded-full border-4 border-background overflow-hidden shadow-md flex items-center justify-center relative"
              style={{ backgroundColor: "#0d0f1a" }}
              data-ocid="profile.avatar"
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShieldBadgeSVG size={72} />
              )}
              {/* Upload progress overlay on avatar */}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                </div>
              )}
            </div>
            {isOwnProfile && !uploadingAvatar && (
              <PhotoUploadButton
                onUpload={onAvatarUpload}
                uploading={uploadingAvatar}
                label={t.changeProfilePhoto}
                ocid="profile.avatar_upload_button"
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center bg-black/75 hover:bg-black/90 border-2 border-background text-white shadow-md z-10"
                icon={<Camera className="w-4 h-4" />}
              />
            )}
            <div
              className="absolute bottom-1 left-1 w-7 h-7 rounded-full flex items-center justify-center bg-background shadow-sm border border-border/40 pointer-events-none z-10"
              aria-hidden="true"
            >
              <ShieldBadgeSVG size={18} />
            </div>
          </div>
          <div className="pb-1 flex-shrink-0">{actionSlot}</div>
        </div>

        {/* Name + verification badge */}
        <div className="mt-3 space-y-1">
          <div
            className={`flex items-center gap-2 flex-wrap ${isRTL ? "flex-row-reverse justify-end" : ""}`}
          >
            <h1 className="font-display text-2xl font-semibold text-foreground">
              <span className="inline-flex items-center" style={{ gap: "3px" }}>
                <span>{profile.username}</span>
                {isVerified && <VerificationBadge size={22} />}
              </span>
            </h1>
            <VisibilityBadge visibility={profile.visibility} />
          </div>

          {/* User bio — only show if set AND NOT the owner (owner has 2 fixed blue lines instead) */}
          {profile.bio &&
            !isVerified &&
            !isVerifiedUser(profile.username, profile.isVerified) && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg break-words">
                {profile.bio}
              </p>
            )}

          {/* Owner-only blue profile lines — EXACTLY two lines, no duplicates ever */}
          {isVerified && (
            <div
              className="mt-1 flex flex-col gap-0.5"
              data-ocid="profile.owner_bio_lines"
            >
              <p
                className="text-sm font-semibold leading-snug"
                style={{ color: "#4169E1" }}
              >
                {OWNER_PROFILE_LINE1}
              </p>
              <p
                className="text-sm font-medium leading-snug"
                style={{ color: "#4169E1" }}
              >
                {OWNER_PROFILE_LINE2}
              </p>
            </div>
          )}

          {showOfficialPageLink && (
            <button
              type="button"
              onClick={() => void navigate({ to: "/official-page" })}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-smooth mt-1"
              data-ocid="profile.official_page_link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Zaren Veto — Page officielle
            </button>
          )}
        </div>

        {/* Stats row */}
        <div
          className={`flex items-center gap-4 sm:gap-8 mt-5 pt-4 border-t border-border/60 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <StatBlock value={profile.postCount} label={t.profilePosts} />
          <div
            className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <StatBlock value={displayFollowers} label={t.profileFollowers} />
          </div>
          <StatBlock
            value={profile.followingCount}
            label={t.profileFollowing}
          />
        </div>

        {/* Copy profile link — full-width prominent button */}
        <button
          type="button"
          onClick={handleCopyProfileLink}
          disabled={!profileId}
          className={`mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-smooth shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            linkCopied
              ? "bg-green-600 text-white border border-green-500/60"
              : "bg-[#4169E1] hover:bg-[#3457c8] text-white border border-[#4169E1]/80"
          }`}
          data-ocid="profile.copy_link_button"
        >
          {linkCopied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
          {linkCopied ? t.linkCopied : t.copyLink}
        </button>
      </div>
    </div>
  );
}

// ─── Edit Profile Form ────────────────────────────────────────────────────────

function EditProfileForm({
  profile,
  onCancel,
  onSave,
}: {
  profile: UserProfile;
  onCancel: () => void;
  onSave: (u: string, b: string, v: Visibility) => Promise<void>;
}) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [visibility, setVisibility] = useState<Visibility>(profile.visibility);
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error(t.usernameIsRequired);
      return;
    }
    setSaving(true);
    try {
      await onSave(username.trim(), bio.trim(), visibility);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={(e) => void handleSave(e)}
      className="space-y-4 pt-4 border-t border-border mt-4"
      data-ocid="profile.edit_form"
    >
      <div className="space-y-1.5">
        <Label
          htmlFor="edit-username"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
        >
          {t.username} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={saving}
          maxLength={32}
          required
          className="bg-secondary border-input"
          data-ocid="profile.username_input"
        />
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="edit-bio"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
        >
          {t.bio}
        </Label>
        <Textarea
          id="edit-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={saving}
          rows={3}
          maxLength={280}
          className="bg-secondary border-input resize-none"
          placeholder={t.bioPlaceholder}
          data-ocid="profile.bio_input"
        />
        <p className="text-xs text-muted-foreground text-right">
          {bio.length}/280
        </p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t.postVisibility}
        </Label>
        <div className="flex gap-2" data-ocid="profile.visibility_toggle">
          <button
            type="button"
            onClick={() => setVisibility(Visibility.everyone)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm transition-smooth ${visibility === Visibility.everyone ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
          >
            <Globe className="w-4 h-4" />
            {t.everyone}
          </button>
          <button
            type="button"
            onClick={() => setVisibility(Visibility.followersOnly)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm transition-smooth ${visibility === Visibility.followersOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
          >
            <Lock className="w-4 h-4" />
            {t.followersOnly}
          </button>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={saving || !username.trim()}
          size="sm"
          className="gap-1.5"
          data-ocid="profile.save_button"
        >
          {saving ? (
            <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          {saving ? t.savingBtn : t.saveChangesBtn}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={saving}
          className="gap-1.5"
          data-ocid="profile.cancel_button"
        >
          <X className="w-3.5 h-3.5" />
          {t.cancelBtn}
        </Button>
      </div>
    </motion.form>
  );
}

// ─── Inline comment section ───────────────────────────────────────────────────

function InlineComments({
  postId,
  index,
}: {
  postId: bigint;
  index: number;
}) {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: comments = [], isLoading } = usePostComments(postId, true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      if (!actor) throw new Error("Not authenticated");
      await actor.addComment(postId, text);
      await queryClient.invalidateQueries({
        queryKey: ["postComments", postId.toString()],
      });
      setCommentText("");
      toast.success(t.postComment);
    } catch {
      toast.error(t.actionFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="px-4 py-3 border-t border-border/60 space-y-3"
      data-ocid={`profile.comment_section.${index + 1}`}
    >
      {/* Comment input */}
      <form
        onSubmit={(e) => void handleSubmit(e)}
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
          data-ocid={`profile.comment_input.${index + 1}`}
        />
        <button
          type="submit"
          disabled={!commentText.trim() || submitting}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 transition-smooth hover:bg-primary/90"
          aria-label={t.postComment}
          data-ocid={`profile.comment_submit.${index + 1}`}
        >
          {submitting ? (
            <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin block" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>

      {/* Comment list */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((k) => (
            <div key={k} className="flex gap-2">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <Skeleton className="h-7 flex-1 rounded-xl" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-1">
          {t.noPostsYet === "No posts yet"
            ? "No comments yet"
            : "Aucun commentaire"}
        </p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {comments.map((c) => (
            <div key={c.id.toString()} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {c.authorName.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 bg-secondary rounded-xl px-3 py-1.5">
                <span className="text-xs font-semibold text-foreground mr-1.5">
                  {c.authorName}
                </span>
                <span className="text-xs text-foreground/80 break-words">
                  {c.content}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Posts Section ────────────────────────────────────────────────────────────

function PostCard({
  post,
  index,
  isOwner,
  onPin,
  onUnpin,
  onDelete,
}: {
  post: PostView;
  index: number;
  isOwner: boolean;
  onPin?: (id: bigint) => void;
  onUnpin?: () => void;
  onDelete?: (id: bigint) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    null,
  );
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { t } = useLanguage();
  const formattedDate = new Date(
    Number(post.createdAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const reactionEmoji = currentReaction
    ? REACTIONS.find((r) => r.type === currentReaction)?.emoji
    : null;

  const handleLike = () => {
    setIsLiked((v) => !v);
    setLikeCount((c) => (isLiked ? c - 1 : c + 1));
  };

  const handleReact = (type: ReactionType) => {
    setCurrentReaction((prev) => (prev === type ? null : type));
    setShowReactionPicker(false);
  };

  const handleShare = () => {
    const postId = post.id != null ? post.id.toString() : "";
    void navigator.clipboard
      .writeText(`${window.location.origin}/post/${postId}`)
      .then(() => toast.success(t.linkCopied))
      .catch(() => toast.error(t.actionFailed));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth relative"
      data-ocid={`profile.post.item.${index + 1}`}
    >
      {/* Pinned label */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium px-5 pt-4 pb-0">
          <Pin className="w-3.5 h-3.5" />
          {t.pinnedPost}
        </div>
      )}

      {/* Post image */}
      {post.imageUrl && (
        <div className="border-b border-border/40">
          <img
            src={post.imageUrl}
            alt="Contenu du post"
            className="w-full object-cover max-h-72"
          />
        </div>
      )}

      {/* Post body */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-foreground leading-relaxed flex-1 min-w-0 break-words">
            {post.content}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {post.visibility === Visibility.followersOnly && (
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            {isOwner && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu((v) => !v)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
                  aria-label="Post options"
                  data-ocid={`profile.post_options.${index + 1}`}
                >
                  <span className="font-bold leading-none">···</span>
                </button>
                {showMenu && (
                  <div className="absolute top-8 right-0 bg-card border border-border rounded-xl shadow-xl z-20 w-44 overflow-hidden">
                    {post.isPinned ? (
                      <button
                        type="button"
                        onClick={() => {
                          onUnpin?.();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth"
                      >
                        <Pin className="w-4 h-4 text-muted-foreground" />
                        {t.unpinPost}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onPin?.(post.id);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-smooth"
                      >
                        <Pin className="w-4 h-4 text-muted-foreground" />
                        {t.pinPost}
                      </button>
                    )}
                    {/* Delete option — red, destructive */}
                    <button
                      type="button"
                      onClick={() => {
                        onDelete?.(post.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-smooth border-t border-border/60"
                      data-ocid={`profile.post_delete.${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.deletePost}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{formattedDate}</p>
      </div>

      {/* Interaction action bar */}
      <div className="px-3 py-2 border-t border-border/60 flex items-center gap-0.5">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${isLiked ? "text-[#E0245E]" : "text-muted-foreground hover:text-foreground"}`}
          data-ocid={`profile.post_like.${index + 1}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-[#E0245E]" : ""}`} />
          <span className="hidden sm:inline">{isLiked ? t.liked : t.like}</span>
          {likeCount > 0 && <span className="tabular-nums">{likeCount}</span>}
        </button>

        {/* React (emoji picker) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowReactionPicker((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${currentReaction ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            data-ocid={`profile.post_react.${index + 1}`}
          >
            <span className="text-base leading-none">
              {reactionEmoji ?? "😊"}
            </span>
            <span className="hidden sm:inline">{t.react}</span>
          </button>
          {showReactionPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 start-0 bg-card border border-border rounded-2xl shadow-xl p-1.5 flex gap-1 z-30"
              data-ocid={`profile.reaction_picker.${index + 1}`}
            >
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => handleReact(r.type)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-smooth hover:scale-125 hover:bg-secondary ${currentReaction === r.type ? "bg-primary/20 ring-1 ring-primary/50 scale-110" : ""}`}
                  data-ocid={`profile.react_${r.type}.${index + 1}`}
                >
                  {r.emoji}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Comment toggle */}
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${showComments ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          data-ocid={`profile.post_comment.${index + 1}`}
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
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth ms-auto"
          data-ocid={`profile.post_share.${index + 1}`}
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t.share}</span>
        </button>
      </div>

      {/* Full inline comments */}
      {showComments && <InlineComments postId={post.id} index={index} />}
    </motion.div>
  );
}

function PostsSection({
  posts,
  isLoading,
  isOwner,
  onPin,
  onUnpin,
  onDelete,
}: {
  posts: PostView[] | undefined;
  isLoading: boolean;
  isOwner: boolean;
  onPin: (id: bigint) => void;
  onUnpin: () => void;
  onDelete: (id: bigint) => void;
}) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="profile.posts_list.loading_state">
        {["a", "b", "c"].map((k) => (
          <div
            key={k}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-24 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl"
        data-ocid="profile.posts_list.empty_state"
      >
        <FileText className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">{t.noPostsYet}</p>
      </div>
    );
  }

  // Show pinned post first
  const sorted = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-4" data-ocid="profile.posts_list">
      {sorted.map((post, index) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          index={index}
          isOwner={isOwner}
          onPin={onPin}
          onUnpin={onUnpin}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function SavedPostsSection() {
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const { data: savedPosts, isLoading } = useQuery<PostView[]>({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return (await actor.getSavedPosts()) ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="profile.saved_list.loading_state">
        {["a", "b"].map((k) => (
          <div
            key={k}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl"
        data-ocid="profile.saved_list.empty_state"
      >
        <Bookmark className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">{t.noPostsYet}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="profile.saved_list">
      {savedPosts.map((post, index) => (
        <PostCard
          key={post.id.toString()}
          post={post}
          index={index}
          isOwner={false}
          onDelete={() => {}}
        />
      ))}
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function UserNotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-24 text-center"
      data-ocid="profile.not_found"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <UserMinus className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="font-display text-xl font-semibold text-foreground mb-2">
        {t.userNotFound}
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        {t.userNotFoundDesc}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => void navigate({ to: "/" })}
        className="metallic-border"
        data-ocid="profile.go_home_button"
      >
        {t.backToFeed}
      </Button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { status, profile: myProfile } = useCurrentUser();
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Safely extract userId — may be undefined if route param is missing
  const params = useParams({ strict: false }) as { userId?: string };
  const userId = params.userId ?? "";

  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [publishingPost, setPublishingPost] = useState(false);
  const postImageRef = useRef<HTMLInputElement>(null);

  const { uploadImage } = useImageUpload();

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  const isOwnProfile =
    status === "authenticated" &&
    myProfile !== null &&
    !!userId &&
    myProfile.id.toString() === userId;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isError: profileError,
  } = useUserProfile(userId || undefined);

  const { data: posts, isLoading: postsLoading } = useUserPosts(
    userId || undefined,
  );
  const { data: isFollowingUser, isLoading: followLoading } = useIsFollowing(
    isOwnProfile ? undefined : userId || undefined,
  );
  const { data: friendStatus } = useFriendRequestStatus(
    userId || undefined,
    !isOwnProfile,
  );

  // Sync photo URLs from profile data
  useEffect(() => {
    if (userProfile?.coverPhotoUrl) setCoverPhotoUrl(userProfile.coverPhotoUrl);
    if (userProfile?.profilePhotoUrl)
      setProfilePhotoUrl(userProfile.profilePhotoUrl);
  }, [userProfile?.coverPhotoUrl, userProfile?.profilePhotoUrl]);

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const persistentUrl = await uploadImage(file);
      if (!actor) throw new Error("Not authenticated");
      await actor.updateProfilePhoto(persistentUrl);
      setProfilePhotoUrl(persistentUrl);
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      toast.success(t.profilePhotoUpdated);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.photoUploadFailed;
      toast.error(message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const persistentUrl = await uploadImage(file);
      if (!actor) throw new Error("Not authenticated");
      await actor.updateCoverPhoto(persistentUrl);
      setCoverPhotoUrl(persistentUrl);
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      await queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      toast.success(t.coverPhotoUpdated);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.photoUploadFailed;
      toast.error(message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle post image selection
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

  const updateMutation = useMutation({
    mutationFn: async ({
      username,
      bio,
      visibility,
    }: { username: string; bio: string; visibility: Visibility }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateProfile(username, bio, visibility);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      void queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      setEditing(false);
      toast.success(t.profileUpdated);
    },
    onError: () => toast.error(t.failedToUpdateProfile),
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !userId) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.followUser(Principal.fromText(userId));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["isFollowing", userId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      toast.success(t.follow);
    },
    onError: () => toast.error("Failed to follow user"),
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !userId) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.unfollowUser(Principal.fromText(userId));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["isFollowing", userId],
      });
      void queryClient.invalidateQueries({
        queryKey: ["userProfile", userId],
      });
      toast.success(t.unfollow);
    },
    onError: () => toast.error("Failed to unfollow user"),
  });

  const friendRequestMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !userId) throw new Error("Not authenticated");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.sendFriendRequest(Principal.fromText(userId));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["friendStatus", userId],
      });
      toast.success(t.friendRequestSent);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const handleProfilePostPublish = async () => {
    const content = newPostContent.trim();
    if (!content) return;
    setPublishingPost(true);
    try {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.createPost(
        content,
        Visibility.everyone,
        [],
        newPostImage ?? null,
      );
      if ("__kind__" in result && result.__kind__ === "err") {
        throw new Error((result as { err: string }).err);
      }
      await queryClient.invalidateQueries({
        queryKey: ["userPosts", userId],
      });
      setNewPostContent("");
      setNewPostImage(null);
      toast.success(t.postPublished);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t.failedToPublishPost;
      toast.error(message);
    } finally {
      setPublishingPost(false);
    }
  };

  const pinMutation = useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error();
      return actor.pinPost(postId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      toast.success(t.postPinned);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const unpinMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      return actor.unpinPost();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      toast.success(t.postUnpinned);
    },
    onError: () => toast.error(t.actionFailed),
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      toast.success(t.postDeleted);
    },
    onError: () => toast.error(t.failedToDeletePost),
  });

  // ── Show loading while auth / profile data is initializing ──
  if (status === "initializing" || profileLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") return null;

  // ── Show error if profile not found or ID is invalid ──
  if (
    !userId ||
    profileError ||
    userProfile === null ||
    userProfile === undefined
  ) {
    return (
      <Layout>
        <UserNotFound />
      </Layout>
    );
  }

  const isVerified = isVerifiedUser(
    userProfile.username ?? "",
    userProfile.isVerified,
  );
  const followPending = followMutation.isPending || unfollowMutation.isPending;

  const getFriendButtonLabel = () => {
    if (friendStatus === "accepted") return t.addFriend;
    if (friendStatus === "pending" || friendStatus === "sent")
      return t.pendingRequest;
    if (friendStatus === "blocked") return t.blocked;
    return t.addFriend;
  };

  const actionSlot = isOwnProfile ? (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setEditing((v) => !v)}
      className="gap-2 metallic-border hover:metallic-border-active transition-smooth"
      data-ocid="profile.edit_profile_button"
    >
      {editing ? (
        <X className="w-3.5 h-3.5" />
      ) : (
        <Edit3 className="w-3.5 h-3.5" />
      )}
      {editing ? t.cancelBtn : t.editProfile}
    </Button>
  ) : (
    !followLoading && (
      <div className="flex gap-2">
        <Button
          variant={isFollowingUser ? "outline" : "default"}
          size="sm"
          disabled={followPending}
          onClick={() =>
            isFollowingUser
              ? void unfollowMutation.mutateAsync()
              : void followMutation.mutateAsync()
          }
          className="gap-2 transition-smooth"
          data-ocid="profile.follow_unfollow_button"
        >
          {followPending ? (
            <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : isFollowingUser ? (
            <UserMinus className="w-3.5 h-3.5" />
          ) : (
            <UserPlus className="w-3.5 h-3.5" />
          )}
          {followPending ? "…" : isFollowingUser ? t.unfollow : t.follow}
        </Button>
        {friendStatus !== "accepted" && friendStatus !== "blocked" && (
          <Button
            variant="outline"
            size="sm"
            disabled={
              friendRequestMutation.isPending ||
              friendStatus === "pending" ||
              friendStatus === "sent"
            }
            onClick={() => void friendRequestMutation.mutateAsync()}
            className="gap-2 transition-smooth"
            data-ocid="profile.friend_request_button"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {getFriendButtonLabel()}
          </Button>
        )}
      </div>
    )
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6" data-ocid="profile.page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileHero
            profile={userProfile}
            isOwnProfile={isOwnProfile}
            coverPhotoUrl={coverPhotoUrl}
            profilePhotoUrl={profilePhotoUrl}
            onCoverUpload={handleCoverUpload}
            onAvatarUpload={handleAvatarUpload}
            uploadingCover={uploadingCover}
            uploadingAvatar={uploadingAvatar}
            actionSlot={actionSlot}
            isVerified={isVerified}
            followerCount={isVerified ? "19k" : userProfile.followerCount}
            showOfficialPageLink={isVerified}
          />
          {isOwnProfile && editing && (
            <div className="bg-card border border-border border-t-0 rounded-b-xl px-6 pb-6">
              <EditProfileForm
                profile={userProfile}
                onCancel={() => setEditing(false)}
                onSave={async (username, bio, visibility) => {
                  await updateMutation.mutateAsync({
                    username,
                    bio,
                    visibility,
                  });
                }}
              />
            </div>
          )}
        </motion.div>

        {/* About section */}
        <AboutSection profile={userProfile} isOwnProfile={isOwnProfile} />

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList
            className="w-full bg-card border border-border rounded-xl p-1 h-auto"
            data-ocid="profile.tabs"
          >
            <TabsTrigger
              value="posts"
              className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2"
              data-ocid="profile.posts_tab"
            >
              <FileText className="w-4 h-4" />
              {t.profilePosts}
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger
                value="saved"
                className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg py-2"
                data-ocid="profile.saved_tab"
              >
                <Bookmark className="w-4 h-4" />
                {t.savePost}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-4 space-y-4">
            {/* Create post form — only on own profile */}
            {isOwnProfile && (
              <div
                className="bg-card border border-border rounded-xl p-4 space-y-3"
                data-ocid="profile.create_post_section"
              >
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={t.whatsOnYourMind ?? "Quoi de neuf ?"}
                  rows={3}
                  maxLength={500}
                  className="bg-secondary border-input resize-none text-sm"
                  data-ocid="profile.create_post_input"
                />

                {/* Image preview */}
                {newPostImage && (
                  <div className="relative inline-block rounded-lg overflow-hidden border border-border/60">
                    <img
                      src={newPostImage}
                      alt="Aperçu du post"
                      className="max-h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setNewPostImage(null)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-smooth"
                      aria-label="Remove image"
                      data-ocid="profile.remove_post_image_button"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between">
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
                        aria-label="Add image or video"
                      />
                      <button
                        type="button"
                        onClick={() => postImageRef.current?.click()}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-smooth"
                        title="Add image or video"
                        data-ocid="profile.post_image_button"
                      >
                        <ImagePlus className="w-3.5 h-3.5" />
                      </button>
                    </>
                  </div>
                  <Button
                    size="sm"
                    disabled={!newPostContent.trim() || publishingPost}
                    onClick={() => void handleProfilePostPublish()}
                    className="gap-2"
                    data-ocid="profile.create_post_submit_button"
                  >
                    {publishingPost ? (
                      <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : null}
                    {t.publish}
                  </Button>
                </div>
              </div>
            )}
            <PostsSection
              posts={posts ?? []}
              isLoading={postsLoading}
              isOwner={isOwnProfile}
              onPin={(id) => pinMutation.mutate(id)}
              onUnpin={() => unpinMutation.mutate()}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </TabsContent>
          {isOwnProfile && (
            <TabsContent value="saved" className="mt-4">
              <SavedPostsSection />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
