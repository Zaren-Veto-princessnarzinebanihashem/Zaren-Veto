import { useLanguage } from "@/i18n/LanguageContext";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "zv_install_banner_dismissed";
const DISMISS_DAYS = 7;

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

function wasDismissedRecently(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

// Typed deferred prompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner() {
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show if already in standalone mode
    if (isStandalone()) return;
    // Never show if recently dismissed
    if (wasDismissedRecently()) return;

    if (isIOS()) {
      // Show iOS instructions (no prompt API on iOS)
      setShowIOS(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setVisible(false);
    } else {
      dismiss();
    }
    setDeferredPrompt(null);
  };

  const texts = {
    ar: {
      message: "ثبّت Zaren Veto على هاتفك",
      install: "تثبيت",
      ios: "للتثبيت: اضغط على زر المشاركة ثم «إضافة إلى الشاشة الرئيسية»",
    },
    fr: {
      message: "Installer Zaren Veto sur votre téléphone",
      install: "Installer",
      ios: "Pour installer : appuyez sur le bouton Partager puis «Sur l'écran d'accueil»",
    },
    en: {
      message: "Install Zaren Veto on your phone",
      install: "Install",
      ios: "To install: tap the Share button and 'Add to Home Screen'",
    },
  };

  const t = texts[language] ?? texts.en;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-4 left-3 right-3 z-50 mx-auto max-w-md"
          data-ocid="install-banner"
        >
          <div className="bg-card border border-primary/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Royal blue top accent */}
            <div className="h-0.5 bg-primary w-full" />
            <div className="flex items-center gap-3 p-4">
              {/* Shield logo */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                  className="w-6 h-6"
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
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                {showIOS ? (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.ios}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-foreground truncate">
                    {t.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!showIOS && deferredPrompt && (
                  <button
                    type="button"
                    onClick={() => void install()}
                    data-ocid="install-banner.install_button"
                    className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t.install}
                  </button>
                )}
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Dismiss"
                  data-ocid="install-banner.close_button"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
