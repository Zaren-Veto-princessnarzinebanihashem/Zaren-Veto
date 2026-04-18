import { useLanguage } from "@/i18n/LanguageContext";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  /** When true, hides the sidebar/nav (used for login and registration pages) */
  bare?: boolean;
}

export function Layout({ children, bare = false }: LayoutProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  if (bare) {
    return (
      <div className="min-h-screen bg-background flex flex-col">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-3 sm:px-4 gap-4 sm:gap-6 py-4 sm:py-6">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:block flex-shrink-0">
          <div className="sticky top-24">
            <Navigation />
          </div>
        </aside>

        {/* Main content — pb-20 reserves space for the mobile bottom nav */}
        <main
          className="flex-1 min-w-0 pb-20 md:pb-0"
          id="main-content"
          style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}
        >
          {/* Override safe-area padding on md+ */}
          <style>
            {
              "@media (min-width: 768px) { #main-content { padding-bottom: 0 !important; } }"
            }
          </style>
          {children}
        </main>
      </div>

      {/* Footer — hidden on mobile to save space */}
      <footer className="hidden md:block bg-card border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Zaren Veto
          </p>
          <nav className="flex items-center gap-4" aria-label="Footer links">
            <a
              href="/privacy-policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="footer-privacy-link"
            >
              {t.privacyPolicy}
            </a>
            <a
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="footer-terms-link"
            >
              {t.termsOfService}
            </a>
            <a
              href="/community-guidelines"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              data-ocid="footer-guidelines-link"
            >
              {t.communityGuidelines}
            </a>
          </nav>
        </div>
      </footer>

      {/* Mobile bottom tab bar — rendered by Navigation */}
      <Navigation mobileOnly />
    </div>
  );
}
