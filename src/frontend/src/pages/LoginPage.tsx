import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, Eye, EyeOff, Fingerprint, Lock, Shield, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const II_EXPLAINER: Record<string, string> = {
  ar: "هوية الإنترنت (Internet Identity) هي نظام تسجيل دخول آمن وخاص يعمل مباشرةً على جهازك دون بريد إلكتروني. يمكنك أيضًا إنشاء كلمة مرور لتأمين حسابك.",
  fr: "Internet Identity est un système de connexion sécurisé et privé. Créez également un mot de passe pour sécuriser votre compte Zaren Veto.",
  en: "Internet Identity is a secure, private login system. You can also create a password to further secure your Zaren Veto account.",
};

// ─── Password rule checker ────────────────────────────────────────────────────

function checkPassword(pw: string) {
  return {
    minLength: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw),
  };
}

function isPasswordValid(pw: string) {
  const r = checkPassword(pw);
  return r.minLength && r.uppercase && r.lowercase && r.digit;
}

// ─── Password Rule Row ────────────────────────────────────────────────────────

function RuleRow({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs transition-colors duration-200 ${met ? "text-green-500" : "text-muted-foreground"}`}
    >
      {met ? (
        <Check className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <X className="w-3.5 h-3.5 shrink-0" />
      )}
      <span>{label}</span>
    </div>
  );
}

// ─── Password Registration Form ───────────────────────────────────────────────

function PasswordRegistrationForm() {
  const { registerWithPassword, isRegisteringWithPassword } = useCurrentUser();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const { t, isRTL } = useLanguage();
  const qc = useQueryClient();

  const rules = checkPassword(password);
  const allRulesMet = isPasswordValid(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = username.trim().length > 0 && allRulesMet && passwordsMatch;
  const isSubmitting = isRegisteringWithPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!username.trim()) {
      toast.error(t.usernameRequired2);
      return;
    }
    if (!allRulesMet) {
      toast.error(t.passwordTooWeak);
      return;
    }
    if (!passwordsMatch) {
      toast.error(t.passwordMismatch);
      return;
    }
    try {
      await registerWithPassword({
        username: username.trim(),
        password,
        bio: bio.trim(),
      });
      toast.success(t.welcomeToast);
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    } catch {
      toast.error(t.registrationFailed);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">
              {t.passwordSectionTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t.passwordSectionSubtitle}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-4"
          data-ocid="registration.form"
        >
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-username" className="text-sm font-medium">
              {t.username} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reg-username"
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              maxLength={32}
              required
              autoComplete="username"
              data-ocid="registration.username_input"
              className="bg-secondary border-input"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="reg-password" className="text-sm font-medium">
              {t.passwordLabel} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched(true);
                }}
                disabled={isSubmitting}
                maxLength={128}
                required
                autoComplete="new-password"
                data-ocid="registration.password_input"
                className="bg-secondary border-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                data-ocid="registration.password_toggle"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Real-time password rules */}
            {(touched || password.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="pt-2 space-y-1 pl-1"
                data-ocid="registration.password_rules"
              >
                <RuleRow
                  label={t.passwordRuleMinLength}
                  met={rules.minLength}
                />
                <RuleRow
                  label={t.passwordRuleUppercase}
                  met={rules.uppercase}
                />
                <RuleRow
                  label={t.passwordRuleLowercase}
                  met={rules.lowercase}
                />
                <RuleRow label={t.passwordRuleDigit} met={rules.digit} />
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-confirm-password"
              className="text-sm font-medium"
            >
              {t.confirmPasswordLabel}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="reg-confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                maxLength={128}
                required
                autoComplete="new-password"
                data-ocid="registration.confirm_password_input"
                className={`bg-secondary border-input pr-10 ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center px-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                data-ocid="registration.confirm_password_toggle"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p
                className="text-xs text-destructive mt-1"
                data-ocid="registration.password_mismatch_error"
              >
                {t.passwordMismatch}
              </p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <Check className="w-3 h-3" /> {t.passwordLabel} ✓
              </p>
            )}
          </div>

          {/* Bio (optional) */}
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
              disabled={isSubmitting}
              rows={2}
              maxLength={280}
              data-ocid="registration.bio_input"
              className="bg-secondary border-input resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/280
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="w-full h-11"
            data-ocid="registration.submit_button"
          >
            {isSubmitting ? (
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
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (status === "authenticated") {
      void navigate({ to: "/" });
    }
  }, [status, navigate]);

  const explainer = II_EXPLAINER[language] ?? II_EXPLAINER.en;

  const features = [
    {
      icon: Shield,
      title: t.featureDigitalSovereignty,
      desc: t.featureDigitalSovereigntyDesc,
    },
    {
      icon: Lock,
      title: t.featureEncryptedMessages,
      desc: t.featureEncryptedMessagesDesc,
    },
    {
      icon: Eye,
      title: t.featureVisibilityControl,
      desc: t.featureVisibilityControlDesc,
    },
    {
      icon: Fingerprint,
      title: t.featureNoBiometrics,
      desc: t.featureNoBiometricsDesc,
    },
  ];

  // When user has authenticated via II but hasn't registered yet, show password form
  if (status === "registering") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
        <PasswordRegistrationForm />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col lg:flex-row"
      data-ocid="login-page"
    >
      {/* Left panel — branding (hidden on small screens, shown on lg+) */}
      <div className="hidden lg:flex lg:flex-1 bg-card border-r border-border flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-sm w-full"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display text-3xl font-semibold text-foreground tracking-tight">
              {t.appName}
            </span>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            {t.tagline}{" "}
            <span className="text-primary">{t.taglineHighlight}</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            {t.loginSubtitle}
          </p>

          <div className="grid grid-cols-1 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {f.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — login (full screen on mobile) */}
      <div className="flex-1 lg:w-[480px] lg:flex-none flex flex-col items-center justify-center px-4 sm:px-8 py-10 pt-safe">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo — visible on mobile only */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-xl mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <span className="font-display text-2xl font-semibold text-foreground tracking-tight">
              {t.appName}
            </span>
            <p className="text-muted-foreground text-sm mt-1 text-center">
              {t.loginSubtitle}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-2">
              {t.signInSecurely}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {t.signInDesc}
            </p>

            <Button
              type="button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="w-full h-12 sm:h-12 text-base font-semibold metallic-border transition-smooth"
              data-ocid="login-button"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t.connecting}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t.continueWithII}
                </span>
              )}
            </Button>

            {/* Internet Identity explainer */}
            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                {explainer}
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
              {t.loginDisclaimer}
            </p>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-2 justify-center">
                <Lock className="w-3 h-3 text-primary" />
                <p className="text-xs text-primary font-medium">
                  {t.securedBy}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile feature list (collapsed) */}
          <div className="mt-6 lg:hidden grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-2 bg-card border border-border rounded-xl p-3"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <f.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {f.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
