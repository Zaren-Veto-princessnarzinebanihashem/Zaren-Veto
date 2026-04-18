import { Layout } from "@/components/Layout";
import { StoriesCarousel } from "@/components/StoriesCarousel";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useLanguage } from "@/i18n/LanguageContext";
import type { StoryView } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookImage,
  Camera,
  Clock,
  Eye,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatExpiry(story: StoryView): string {
  const nowMs = Date.now();
  const expiresMs = Number(story.expiresAt) / 1_000_000;
  const diffMs = expiresMs - nowMs;
  if (diffMs <= 0) return "Expired";
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  return diffHr >= 1 ? `${diffHr}h` : `${diffMin}m`;
}

// ─── Create Story Modal ───────────────────────────────────────────────────────

function CreateStoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { actor } = useAuthenticatedBackend();
  const { uploadImage, uploading } = useImageUpload();
  const qc = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textOverlay, setTextOverlay] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createStory = useMutation({
    mutationFn: async ({
      imageUrl,
      text,
    }: {
      imageUrl: string;
      text: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStory(imageUrl, text);
    },
    onSuccess: () => {
      toast.success(t.storiesCreated);
      void qc.invalidateQueries({ queryKey: ["storiesFeed"] });
      void qc.invalidateQueries({ queryKey: ["myStories"] });
      handleClose();
    },
    onError: () => toast.error(t.storiesLoadFailed),
  });

  const handleClose = () => {
    setImagePreview(null);
    setTextOverlay("");
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await uploadImage(file).catch(() => null);
    if (dataUrl) setImagePreview(dataUrl);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!imagePreview) return;
    await createStory.mutateAsync({
      imageUrl: imagePreview,
      text: textOverlay.trim() || null,
    });
  };

  const isPending = uploading || createStory.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="create-story-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-base flex items-center gap-2">
            <BookImage className="w-4 h-4 text-primary" />
            {t.storiesCreate}
          </DialogTitle>
        </DialogHeader>

        {/* Image picker */}
        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden bg-secondary aspect-[9/16] max-h-64">
              <img
                src={imagePreview}
                alt="Story preview"
                className="w-full h-full object-cover"
              />
              {textOverlay && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                  <p className="bg-black/60 text-white text-sm font-semibold px-3 py-1.5 rounded-lg text-center backdrop-blur-sm max-w-full break-words">
                    {textOverlay}
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-smooth"
                aria-label="Remove image"
                data-ocid="create-story.remove-image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-smooth"
                aria-label="Change image"
                data-ocid="create-story.change-image"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
              className="w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-smooth"
              data-ocid="create-story.upload_button"
            >
              {uploading ? (
                <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground">
                {t.storiesAddImage}
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void handleFileSelect(e)}
            data-ocid="create-story.file-input"
          />

          {/* Text overlay input */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {t.storiesAddTextOverlay}
            </Label>
            <Input
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value)}
              placeholder={t.storiesAddTextOverlay}
              maxLength={120}
              className="bg-secondary border-input text-sm"
              data-ocid="create-story.text-overlay-input"
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {textOverlay.length}/120
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            data-ocid="create-story.cancel_button"
          >
            {t.cancel}
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!imagePreview || isPending}
            data-ocid="create-story.submit_button"
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                {t.publishing}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                {t.storiesPost}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── My Story Card ────────────────────────────────────────────────────────────

function MyStoryCard({
  story,
  index,
  onDelete,
}: {
  story: StoryView;
  index: number;
  onDelete: (id: bigint) => void;
}) {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);
  const expiry = formatExpiry(story);
  const isExpired = expiry === "Expired";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.06 }}
        className="relative bg-card border border-border rounded-xl overflow-hidden group"
        data-ocid={`my-story.item.${index + 1}`}
      >
        <div className="aspect-[9/16] max-h-52 overflow-hidden bg-secondary">
          <img
            src={story.imageUrl}
            alt="Story"
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          {story.textOverlay && (
            <div className="absolute bottom-10 left-0 right-0 flex justify-center px-3">
              <p className="bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-lg text-center backdrop-blur-sm max-w-full truncate">
                {story.textOverlay}
              </p>
            </div>
          )}
        </div>

        {/* Meta bar */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
            <span
              className={`text-xs font-medium ${isExpired ? "text-destructive" : "text-muted-foreground"}`}
            >
              {t.storiesExpiresIn} {expiry}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {story.viewCount.toString()}
            </span>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              aria-label="Delete story"
              data-ocid={`my-story.delete_button.${index + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent
          className="bg-card border-border max-w-xs"
          data-ocid="delete-story-dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base">
              {t.storiesDeleteConfirm}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowConfirm(false)}
              data-ocid="delete-story.cancel_button"
            >
              {t.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(story.id);
                setShowConfirm(false);
              }}
              data-ocid="delete-story.confirm_button"
            >
              {t.storiesDelete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StoriesPage() {
  const { status, profile } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const { t, isRTL: isRtl } = useLanguage();
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/login" });
    }
  }, [status, navigate]);

  const { data: myStories = [], isLoading } = useQuery<StoryView[]>({
    queryKey: ["myStories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyStories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const deleteStory = useMutation({
    mutationFn: async (storyId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStory(storyId);
    },
    onSuccess: () => {
      toast.success(t.storiesDeleteSuccess);
      void qc.invalidateQueries({ queryKey: ["myStories"] });
      void qc.invalidateQueries({ queryKey: ["storiesFeed"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }
  if (status === "unauthenticated") return null;

  const currentUserId = profile?.id.toString();

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto space-y-6"
        dir={isRtl ? "rtl" : "ltr"}
        data-ocid="stories-page"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              {t.storiesCreate}
            </h1>
            {profile && (
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                <span>{profile.username}</span>
                {isVerifiedUser(profile.username, profile.isVerified) && (
                  <VerificationBadge size={14} />
                )}
              </p>
            )}
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2"
            data-ocid="stories-create_button"
          >
            <Plus className="w-4 h-4" />
            {t.storiesCreate}
          </Button>
        </div>

        {/* Stories carousel (shows feed from followed users) */}
        <StoriesCarousel
          currentUserId={currentUserId}
          onCreateStory={() => setCreateOpen(true)}
        />

        {/* My stories section */}
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            {t.storiesYourStory}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {["sk1", "sk2", "sk3"].map((k) => (
                <Skeleton
                  key={k}
                  className="aspect-[9/16] max-h-52 rounded-xl"
                />
              ))}
            </div>
          ) : myStories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="stories.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                <BookImage className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-2">
                {t.storiesNoStories}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {t.storiesCreateStory}
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="gap-2"
                data-ocid="stories.create-first_button"
              >
                <Camera className="w-4 h-4" />
                {t.storiesCreate}
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 gap-3" data-ocid="my-stories-list">
              <AnimatePresence>
                {myStories.map((story, i) => (
                  <MyStoryCard
                    key={story.id.toString()}
                    story={story}
                    index={i}
                    onDelete={(id) => deleteStory.mutate(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Create story modal */}
      <CreateStoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </Layout>
  );
}
