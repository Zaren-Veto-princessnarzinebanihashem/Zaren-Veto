import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { GroupView } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  Globe,
  Lock,
  Plus,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Cover color palette (used when no cover image) ──────────────────────────

const COVER_COLORS = [
  "from-violet-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
];

function getCoverColor(id: bigint | string): string {
  const n = Number(typeof id === "bigint" ? id % 5n : id);
  return COVER_COLORS[Math.abs(n) % COVER_COLORS.length];
}

// ─── Group Card ───────────────────────────────────────────────────────────────

function GroupCard({
  group,
  index,
  onJoin,
  joining,
}: {
  group: GroupView;
  index: number;
  onJoin: (id: bigint) => void;
  joining: boolean;
}) {
  const date = new Date(Number(group.createdAt) / 1_000_000).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const memberCount = Number(group.memberCount);
  const coverColor = getCoverColor(group.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-smooth"
      data-ocid={`groups.item.${index + 1}`}
    >
      {/* Cover strip */}
      <div className={`h-20 bg-gradient-to-r ${coverColor} relative`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Users className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-base leading-tight">
            {group.name}
          </h3>
          <span
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
              group.isPrivate
                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                : "border-primary/30 bg-primary/10 text-primary"
            }`}
          >
            {group.isPrivate ? (
              <Lock className="w-2.5 h-2.5" />
            ) : (
              <Globe className="w-2.5 h-2.5" />
            )}
            {group.isPrivate ? "Privé" : "Public"}
          </span>
        </div>
        {group.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {group.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {memberCount} membre{memberCount !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <Button
          size="sm"
          variant={group.isMember ? "outline" : "default"}
          className="w-full mt-1"
          data-ocid={`groups.join_button.${index + 1}`}
          disabled={joining || group.isMember}
          onClick={() => !group.isMember && onJoin(group.id)}
        >
          {group.isMember ? "Membre" : "Rejoindre le groupe"}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Create Group Modal ───────────────────────────────────────────────────────

function CreateGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (group: GroupView) => void;
}) {
  const { actor } = useAuthenticatedBackend();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Le nom du groupe est requis.");
      return;
    }
    if (!actor) {
      toast.error("Non connecté");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await actor.createGroup(
        name.trim(),
        description.trim(),
        isPrivate,
        null,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      const newGroup = result.ok;
      setDone(true);
      toast.success(`Groupe "${name.trim()}" créé avec succès !`);
      // Immediately notify parent with the new group so it appears instantly
      onCreated(newGroup);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de la création";
      if (
        msg.includes("IC0508") ||
        msg.includes("canister") ||
        msg.includes("503")
      ) {
        setError(
          "Service temporairement indisponible. Veuillez réessayer dans quelques secondes.",
        );
      } else {
        setError(msg);
      }
      // Do NOT clear the form on error — keep what user typed
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
      data-ocid="groups.create_dialog"
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
            Créer un groupe
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
            aria-label="Fermer"
            data-ocid="groups.create_dialog.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="p-5 space-y-4"
          data-ocid="groups.create_form"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="grp-name"
              className="text-xs uppercase tracking-wide text-muted-foreground font-medium"
            >
              Nom du groupe <span className="text-destructive">*</span>
            </Label>
            <Input
              id="grp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Amateurs de photographie"
              maxLength={60}
              className="bg-secondary border-input"
              data-ocid="groups.create_name_input"
              disabled={submitting || done}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="grp-desc"
              className="text-xs uppercase tracking-wide text-muted-foreground font-medium"
            >
              Description
            </Label>
            <Textarea
              id="grp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="À quoi sert ce groupe ?"
              rows={3}
              maxLength={200}
              className="bg-secondary border-input resize-none text-sm"
              data-ocid="groups.create_description_input"
              disabled={submitting || done}
            />
          </div>

          {/* Privacy toggle */}
          <button
            type="button"
            onClick={() => setIsPrivate((v) => !v)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth ${
              isPrivate
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-primary/30 bg-primary/10"
            }`}
            data-ocid="groups.create_privacy_toggle"
            disabled={submitting || done}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPrivate ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary"}`}
            >
              {isPrivate ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">
                {isPrivate ? "Groupe privé" : "Groupe public"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPrivate
                  ? "Seuls les membres invités peuvent voir le contenu."
                  : "Tout le monde peut trouver et rejoindre ce groupe."}
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${isPrivate ? "border-amber-500 bg-amber-500" : "border-border bg-transparent"}`}
            >
              {isPrivate && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={!name.trim() || submitting || done}
              className="flex-1 gap-2"
              data-ocid="groups.create_submit_button"
            >
              {done ? (
                <>
                  <Check className="w-4 h-4" />
                  Créé !
                </>
              ) : submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Création…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Créer le groupe
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={submitting || done}
              data-ocid="groups.create_cancel_button"
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

export default function GroupsPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t: _t } = useLanguage();
  const [groups, setGroups] = useState<GroupView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [joiningId, setJoiningId] = useState<bigint | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  const loadGroups = useCallback(async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    setLoadError("");
    try {
      const result = await actor.getGroups();
      setGroups(result ?? []);
    } catch {
      setLoadError("Impossible de charger les groupes.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching]);

  // Load groups on mount and when actor becomes available
  useEffect(() => {
    if (actor && !isFetching) {
      void loadGroups();
    }
  }, [actor, isFetching, loadGroups]);

  const handleJoin = async (groupId: bigint) => {
    if (!actor) return;
    setJoiningId(groupId);
    try {
      const result = await actor.joinGroup(groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      // Optimistically update isMember in local state
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, isMember: true, memberCount: g.memberCount + 1n }
            : g,
        ),
      );
      // Also trigger a background refetch after a short delay as backup
      setTimeout(() => void loadGroups(), 500);
      toast.success("Vous avez rejoint le groupe !");
    } catch {
      toast.error("Impossible de rejoindre le groupe.");
    } finally {
      setJoiningId(null);
    }
  };

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-6 space-y-4">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-48 w-full rounded-xl" />
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
        data-ocid="groups.page"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              Groupes
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Rejoignez des communautés ou créez la vôtre.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void loadGroups()}
              disabled={loading}
              className="gap-2 text-muted-foreground hover:text-foreground"
              aria-label="Actualiser"
              data-ocid="groups.refresh_button"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-2 shrink-0"
              data-ocid="groups.create_button"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Créer un groupe</span>
              <span className="sm:hidden">Créer</span>
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {loadError && (
          <div
            className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
            data-ocid="groups.error_state"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {loadError}
          </div>
        )}

        {/* Groups grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["l1", "l2", "l3", "l4"].map((k) => (
              <Skeleton key={k} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl"
            data-ocid="groups.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Aucun groupe pour l&apos;instant
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Créez votre premier groupe et invitez vos amis à rejoindre la
              communauté.
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-2"
              data-ocid="groups.empty_create_button"
            >
              <Plus className="w-4 h-4" />
              Créer un groupe
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="groups.list"
          >
            {groups.map((g, i) => (
              <GroupCard
                key={g.id.toString()}
                group={g}
                index={i}
                onJoin={(id) => void handleJoin(id)}
                joining={joiningId === g.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateGroupModal
            onClose={() => setShowCreate(false)}
            onCreated={(newGroup) => {
              // Immediately add to local state — no waiting for refetch
              setGroups((prev) => [newGroup, ...prev]);
              setShowCreate(false);
              // Background refetch after 500ms as backup
              setTimeout(() => void loadGroups(), 500);
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
