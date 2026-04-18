import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import { Visibility } from "@/types";
import { ADMIN_USERNAME, isVerifiedUser } from "@/utils/verification";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Globe, LayoutDashboard, Lock, Save, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  title,
  description,
  children,
  delay = 0,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl border border-border bg-card p-6 space-y-5"
    >
      <div className="space-y-1">
        <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="border-t border-border" />
      {children}
    </motion.div>
  );
}

// ─── Visibility option card ───────────────────────────────────────────────────
function VisibilityOption({
  value,
  current,
  onChange,
  icon: Icon,
  label,
  description,
}: {
  value: Visibility;
  current: Visibility;
  onChange: (v: Visibility) => void;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      data-ocid={`visibility-option-${value}`}
      className={[
        "w-full flex items-start gap-4 rounded-lg border p-4 text-left transition-smooth cursor-pointer",
        active
          ? "metallic-border-active bg-primary/5"
          : "border-border bg-secondary/30 hover:bg-secondary/60",
      ].join(" ")}
    >
      <div
        className={[
          "mt-0.5 rounded-md p-2",
          active
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground",
        ].join(" ")}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={[
            "text-sm font-semibold",
            active ? "text-foreground" : "text-muted-foreground",
          ].join(" ")}
        >
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      {/* active ring indicator */}
      <div
        className={[
          "mt-1 h-4 w-4 rounded-full border-2 flex-shrink-0 transition-smooth",
          active
            ? "border-primary bg-primary/40 shadow-[0_0_8px_oklch(var(--primary)/0.5)]"
            : "border-muted-foreground",
        ].join(" ")}
      />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { status, profile } = useCurrentUser();
  const { actor } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.everyone);
  const [isSaving, setIsSaving] = useState(false);

  const isOwner =
    profile !== null &&
    profile?.username === ADMIN_USERNAME &&
    isVerifiedUser(profile?.username ?? "", false);

  // Pre-fill from profile once loaded
  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio);
      setVisibility(profile.visibility);
    }
  }, [profile]);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/login" });
    }
  }, [status, navigate]);

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-5 px-4 py-6">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") return null;

  async function handleSave() {
    if (!actor) return;
    if (!username.trim()) {
      toast.error(t.usernameCannotBeEmpty);
      return;
    }
    setIsSaving(true);
    try {
      const ok = await actor.updateProfile(
        username.trim(),
        bio.trim(),
        visibility,
      );
      if (ok) {
        await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        toast.success(t.settingsSaved);
      } else {
        toast.error(t.settingsSaveFailed);
      }
    } catch {
      toast.error(t.settingsSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto px-4 py-8 space-y-6"
        data-ocid="settings-page"
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-1"
        >
          <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
            {t.settingsTitle}
          </h1>
          <p className="text-sm text-muted-foreground">{t.settingsSubtitle}</p>
        </motion.div>

        {/* ── Account ─────────────────────────────────────────── */}
        <Section
          title={t.accountSection}
          description={t.accountSectionDesc}
          delay={0.08}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                {t.usernameLabel}
              </Label>
              <Input
                id="username"
                data-ocid="settings-username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                maxLength={32}
                className="bg-secondary/30 border-input focus:metallic-border h-11"
              />
              <p className="text-xs text-muted-foreground">{t.usernameHint}</p>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-foreground"
              >
                {t.bioLabel}
              </Label>
              <Textarea
                id="bio"
                data-ocid="settings-bio-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.bioHint}
                rows={3}
                maxLength={280}
                className="bg-secondary/30 border-input resize-none focus:metallic-border"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length} / 280
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                data-ocid="settings-save-button"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-[0_0_16px_oklch(var(--primary)/0.35)] hover:shadow-[0_0_24px_oklch(var(--primary)/0.5)]"
              >
                <Save size={15} />
                {isSaving ? t.savingBtnLabel : t.saveBtn}
              </Button>
            </div>
          </div>
        </Section>

        {/* ── Privacy ─────────────────────────────────────────── */}
        <Section
          title={t.privacySection}
          description={t.privacySectionDesc}
          delay={0.16}
        >
          <div className="space-y-3">
            <VisibilityOption
              value={Visibility.everyone}
              current={visibility}
              onChange={setVisibility}
              icon={Globe}
              label={t.everyone}
              description={t.everyoneDesc}
            />
            <VisibilityOption
              value={Visibility.followersOnly}
              current={visibility}
              onChange={setVisibility}
              icon={Lock}
              label={t.followersOnly}
              description={t.followersOnlyDesc}
            />
            <p className="text-xs text-muted-foreground pt-1">
              {t.visibilityHint}
            </p>
          </div>
        </Section>

        {/* ── About ───────────────────────────────────────────── */}
        <Section title={t.aboutSection} delay={0.24}>
          <div className="flex gap-4 items-start">
            <div className="rounded-lg bg-primary/15 p-3 flex-shrink-0">
              <ShieldCheck size={22} className="text-primary" />
            </div>
            <div className="space-y-2 min-w-0">
              <p className="font-display text-base font-semibold text-foreground">
                {t.aboutTitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.aboutDesc}
              </p>
              <p className="text-xs text-muted-foreground/60 pt-1">
                {t.aboutVersion}
              </p>
            </div>
          </div>
        </Section>

        {/* ── Admin Dashboard (owner only) ─────────────────────── */}
        {isOwner && (
          <Section title={t.adminDashboard ?? "Admin Dashboard"} delay={0.32}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t.adminDashboardDesc ??
                    "Manage users, reports, and verification badges."}
                </p>
              </div>
              <Button
                onClick={() => void navigate({ to: "/admin" })}
                className="gap-2 shrink-0"
                data-ocid="settings.admin_dashboard_button"
              >
                <LayoutDashboard size={16} />
                {t.adminDashboard ?? "Admin Dashboard"}
              </Button>
            </div>
          </Section>
        )}
      </div>
    </Layout>
  );
}
