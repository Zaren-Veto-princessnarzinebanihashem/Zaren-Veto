import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import { isVerifiedUser } from "@/utils/verification";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Globe, LogOut, Settings, User } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { VerificationBadge } from "./VerificationBadge";

/** Royal-blue flat shield logo with bold white Z */
function ShieldLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      className={className}
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

const LANG_CYCLE: Language[] = ["en", "fr", "ar"];

export function Header() {
  const { clear } = useInternetIdentity();
  const { profile, status } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ["unreadNotifications"],
    queryFn: async () => 0,
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "ZV";

  const isAdmin = isVerifiedUser(profile?.username ?? "", profile?.isVerified);

  function cycleLanguage() {
    const idx = LANG_CYCLE.indexOf(language);
    const next = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
    setLanguage(next);
  }

  const langLabel =
    language === "ar" ? t.langAr : language === "fr" ? t.langFr : t.langEn;

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border"
      style={{ backdropFilter: "blur(12px)" }}
      data-ocid="app-header"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Branding */}
        <button
          type="button"
          onClick={() => void navigate({ to: "/" })}
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg shrink-0"
          data-ocid="header-logo"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-smooth group-hover:scale-105">
            <ShieldLogo className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm" />
          </div>
          {/* App name — hidden on very small screens, shown on sm+ */}
          <span className="hidden xs:inline font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            {t.appName}
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language switcher */}
          <button
            type="button"
            onClick={cycleLanguage}
            data-ocid="language-switcher"
            aria-label={t.language}
            title={t.language}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-secondary/40 hover:bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[44px] justify-center"
          >
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs font-semibold tracking-wide font-mono hidden sm:inline">
              {langLabel}
            </span>
          </button>

          {status === "authenticated" && profile ? (
            <>
              {/* Notification Bell */}
              <NotificationBell unreadCount={unreadCount} />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[44px] justify-center"
                    data-ocid="header-user-menu"
                    aria-label={t.userMenuAriaLabel}
                  >
                    <Avatar className="w-8 h-8 border border-primary/30">
                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className="text-sm font-medium text-foreground hidden sm:inline-flex items-center"
                      style={{ gap: "2px" }}
                    >
                      <span>{profile.username}</span>
                      {isAdmin && <VerificationBadge size={16} />}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={() =>
                      void navigate({
                        to: "/profile/$userId",
                        params: { userId: profile.id.toText() },
                      })
                    }
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="header-menu-profile"
                  >
                    <User className="w-4 h-4" />
                    {t.viewProfile}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => void navigate({ to: "/settings" })}
                    className="flex items-center gap-2 cursor-pointer"
                    data-ocid="header-menu-settings"
                  >
                    <Settings className="w-4 h-4" />
                    {t.settings}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={clear}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                    data-ocid="header-menu-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
