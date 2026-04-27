import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { UserProfile } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Check,
  Globe,
  LayoutGrid,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

const PAGE_CATEGORIES = [
  { value: "business", label: "Entreprise" },
  { value: "artist", label: "Artiste" },
  { value: "community", label: "Communauté" },
  { value: "brand", label: "Marque" },
  { value: "public_figure", label: "Personnalité publique" },
  { value: "other", label: "Autre" },
];

// ─── Page Card ────────────────────────────────────────────────────────────────

function PageCard({
  page,
  index,
  onFollow,
  following,
}: {
  page: UserProfile;
  index: number;
  onFollow: (id: string, isFollowing: boolean) => void;
  following: boolean;
}) {
  const navigate = useNavigate();
  const isVerified = isVerifiedUser(page.username, page.isVerified);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-smooth cursor-pointer"
      data-ocid={`pages.item.${index + 1}`}
      onClick={() => void navigate({ to: `/pages/${page.id.toText()}` })}
    >
      {/* Cover strip */}
      <div
        className="h-20 w-full relative overflow-hidden"
        style={{
          background: page.coverPhotoUrl
            ? undefined
            : "linear-gradient(135deg,#0f1c5e 0%,#4169E1 60%,#5c7df5 100%)",
        }}
      >
        {page.coverPhotoUrl && (
          <img
            src={page.coverPhotoUrl}
            alt={page.username}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar (overlapping) */}
      <div className="relative px-4" style={{ marginTop: -28 }}>
        <div className="w-14 h-14 rounded-full border-3 border-card bg-secondary overflow-hidden flex items-center justify-center shadow">
          {page.profilePhotoUrl ? (
            <img
              src={page.profilePhotoUrl}
              alt={page.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <LayoutGrid className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="px-4 pt-1 pb-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="font-semibold text-foreground text-sm leading-tight truncate inline-flex items-center gap-1"
              data-ocid={`pages.name.${index + 1}`}
            >
              <span className="truncate">{page.username}</span>
              {isVerified && <VerificationBadge size={13} />}
            </h3>
            {page.bio && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {page.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>
              {Number(page.followerCount).toLocaleString()}{" "}
              {Number(page.followerCount) === 1 ? "abonné" : "abonnés"}
            </span>
          </div>
          <Button
            size="sm"
            variant={following ? "outline" : "default"}
            className="h-7 text-xs px-3"
            data-ocid={`pages.follow_button.${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              onFollow(page.id.toText(), following);
            }}
          >
            {following ? "Suivi(e)" : "Suivre"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Create Page Modal ────────────────────────────────────────────────────────

function CreatePageModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { actor } = useAuthenticatedBackend();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Le nom de la page est requis.");
      return;
    }
    if (!actor) {
      toast.error("Non connecté");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Register a page using existing backend methods (pages use the profile system)
      // We create the page as a new account type via registerWithPassword-like logic
      // Since pages use the same UserProfile system, we call createPage if available
      // Otherwise fall back to a page stub
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendActor = actor as any;
      if (typeof backendActor.createPage === "function") {
        const result = await backendActor.createPage(
          name.trim(),
          description.trim(),
          category,
        );
        if (
          result &&
          typeof result === "object" &&
          "__kind__" in result &&
          result.__kind__ === "err"
        ) {
          throw new Error(result.err as string);
        }
      } else {
        // Backend pages not available yet — show friendly message
        throw new Error(
          "La fonctionnalité de création de pages sera disponible prochainement.",
        );
      }
      toast.success(`Page "${name.trim()}" créée avec succès !`);
      onCreated();
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de la création";
      if (msg.includes("IC0508") || msg.includes("canister")) {
        setError("Service temporairement indisponible. Réessayez.");
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-ocid="pages.create_dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }}
        transition={{ duration: 0.25 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Créer une page
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
            aria-label="Fermer"
            data-ocid="pages.create_dialog.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="p-5 space-y-4"
          data-ocid="pages.create_form"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="page-name"
              className="text-xs uppercase tracking-wide text-muted-foreground font-medium"
            >
              Nom de la page <span className="text-destructive">*</span>
            </Label>
            <Input
              id="page-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Ma boutique"
              maxLength={60}
              className="bg-secondary border-input"
              data-ocid="pages.create_name_input"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="page-desc"
              className="text-xs uppercase tracking-wide text-muted-foreground font-medium"
            >
              Description
            </Label>
            <Textarea
              id="page-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="De quoi parle votre page ?"
              rows={3}
              maxLength={200}
              className="bg-secondary border-input resize-none text-sm"
              data-ocid="pages.create_description_input"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="page-category"
              className="text-xs uppercase tracking-wide text-muted-foreground font-medium"
            >
              Catégorie
            </Label>
            <select
              id="page-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              data-ocid="pages.create_category_select"
              className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {PAGE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={!name.trim() || submitting}
              className="flex-1 gap-2"
              data-ocid="pages.create_submit_button"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Création…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Créer la page
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting}
              data-ocid="pages.create_cancel_button"
            >
              Annuler
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PagesPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t: _t } = useLanguage();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  const loadPages = useCallback(async (): Promise<UserProfile[]> => {
    if (!actor || isFetching) return [];
    try {
      if (searchTerm.trim()) {
        const results = await actor.searchUsers(searchTerm.trim());
        return (results ?? []).filter((u) => u.isOfficialPage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendActor = actor as any;
      if (typeof backendActor.searchPages === "function") {
        return (await backendActor.searchPages("")) ?? [];
      }
      // Fallback: search for official page marker via general search
      return [];
    } catch {
      return [];
    }
  }, [actor, isFetching, searchTerm]);

  const { data: pages = [], isLoading } = useQuery<UserProfile[]>({
    queryKey: ["pages", searchTerm],
    queryFn: loadPages,
    enabled: !!actor && !isFetching,
    retry: false,
  });

  const handleFollow = async (
    pageId: string,
    isCurrentlyFollowing: boolean,
  ) => {
    if (!actor) return;
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      if (isCurrentlyFollowing) {
        await actor.unfollowUser(Principal.fromText(pageId));
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(pageId);
          return next;
        });
      } else {
        await actor.followUser(Principal.fromText(pageId));
        setFollowingIds((prev) => new Set(prev).add(pageId));
      }
      void queryClient.invalidateQueries({ queryKey: ["pages"] });
    } catch {
      toast.error("Action échouée. Réessayez.");
    }
  };

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-6 space-y-4">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto py-4 sm:py-6 space-y-5"
        data-ocid="pages.page"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              Pages
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Découvrez et suivez des pages.
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2 shrink-0"
            data-ocid="pages.create_button"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Créer une page</span>
            <span className="sm:hidden">Créer</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher une page…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-secondary border-input"
            data-ocid="pages.search_input"
          />
        </div>

        {/* Pages grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["l1", "l2", "l3", "l4"].map((k) => (
              <Skeleton key={k} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl"
            data-ocid="pages.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              {searchTerm ? (
                <Search className="w-8 h-8 text-muted-foreground" />
              ) : (
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              {searchTerm
                ? "Aucune page trouvée"
                : "Aucune page pour l'instant"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {searchTerm
                ? `Aucune page ne correspond à "${searchTerm}".`
                : "Soyez le premier à créer une page sur Zaren Veto."}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setShowCreate(true)}
                className="gap-2"
                data-ocid="pages.empty_create_button"
              >
                <Plus className="w-4 h-4" />
                Créer une page
              </Button>
            )}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="pages.list"
          >
            {pages.map((page, i) => (
              <PageCard
                key={page.id.toText()}
                page={page}
                index={i}
                onFollow={(id, isFollowing) =>
                  void handleFollow(id, isFollowing)
                }
                following={followingIds.has(page.id.toText())}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreatePageModal
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              void queryClient.invalidateQueries({ queryKey: ["pages"] });
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
