import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  Home,
  MessageCircle,
  Settings,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItemDef {
  to: string;
  label: string;
  icon: LucideIcon;
  ocid: string;
}

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItemDef;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={item.ocid}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group w-full text-left",
        isActive
          ? "bg-primary/15 text-primary metallic-border"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "w-5 h-5 flex-shrink-0 transition-smooth",
          isActive ? "text-primary" : "group-hover:text-foreground",
        )}
      />
      <span className="hidden lg:block">{item.label}</span>
    </button>
  );
}

interface NavigationProps {
  /** When true, renders ONLY the mobile bottom bar (used in Layout to avoid double-render) */
  mobileOnly?: boolean;
}

/** Sidebar navigation for desktop; bottom tab bar for mobile */
export function Navigation({ mobileOnly = false }: NavigationProps) {
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { profile, status } = useCurrentUser();
  const currentPath = routerState.location.pathname;
  const { t } = useLanguage();

  const staticNavItems: NavItemDef[] = [
    { to: "/", label: t.feed, icon: Home, ocid: "nav-feed" },
    { to: "/explore", label: t.explore, icon: Compass, ocid: "nav-explore" },
    {
      to: "/messages",
      label: t.messages,
      icon: MessageCircle,
      ocid: "nav-messages",
    },
    { to: "/friends", label: t.friends, icon: Users, ocid: "nav-friends" },
    { to: "/groups", label: "Groupes", icon: UsersRound, ocid: "nav-groups" },
    {
      to: "/settings",
      label: t.settings,
      icon: Settings,
      ocid: "nav-settings",
    },
  ];

  const allNavItems: NavItemDef[] = [
    ...staticNavItems,
    ...(status === "authenticated" && profile
      ? [
          {
            to: `/profile/${profile.id.toText()}`,
            label: t.profile,
            icon: User,
            ocid: "nav-profile",
          },
        ]
      : []),
  ];

  function isActive(to: string) {
    return to === "/" ? currentPath === "/" : currentPath.startsWith(to);
  }

  return (
    <>
      {/* Desktop sidebar — hidden if mobileOnly prop */}
      {!mobileOnly && (
        <nav
          className="hidden md:flex flex-col gap-1 p-3 w-56 lg:w-64 flex-shrink-0"
          aria-label="Main navigation"
          data-ocid="sidebar-nav"
        >
          {allNavItems.map((item) => (
            <NavButton
              key={item.to}
              item={item}
              isActive={isActive(item.to)}
              onClick={() => void navigate({ to: item.to })}
            />
          ))}
        </nav>
      )}

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around px-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Mobile navigation"
        data-ocid="mobile-nav"
      >
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <button
              key={item.to}
              type="button"
              onClick={() => void navigate({ to: item.to })}
              data-ocid={`${item.ocid}-mobile`}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-smooth relative",
                active ? "text-primary" : "text-muted-foreground",
              )}
              style={{ minHeight: "56px" }}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {/* Active indicator dot */}
              {active && (
                <span className="absolute top-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
