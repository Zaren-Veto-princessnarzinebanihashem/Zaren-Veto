import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Component, type ReactNode, Suspense, lazy } from "react";
import { InstallBanner } from "./components/InstallBanner";

// ─── Global Error Boundary ────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class GlobalErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inattendue s'est produite.";
    return { hasError: true, message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-5">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-semibold text-foreground mb-2">
            Quelque chose s'est mal passé
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
            {this.state.message}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.location.replace("/")}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              data-ocid="error-boundary.home_button"
            >
              Retour à l'accueil
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-semibold hover:bg-secondary/80 transition-colors border border-border"
              data-ocid="error-boundary.reload_button"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Lazy-load pages ──────────────────────────────────────────────────────────

const LoginPage = lazy(() => import("./pages/LoginPage"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const ConversationPage = lazy(() => import("./pages/ConversationPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const GuidelinesPage = lazy(() => import("./pages/GuidelinesPage"));
const OfficialPage = lazy(() => import("./pages/OfficialPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const StoriesPage = lazy(() => import("./pages/StoriesPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const FriendsPage = lazy(() => import("./pages/FriendsPage"));
const GroupsPage = lazy(() => import("./pages/GroupsPage"));

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

function withSuspense(Page: React.ComponentType) {
  return (
    <GlobalErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Page />
      </Suspense>
    </GlobalErrorBoundary>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <GlobalErrorBoundary>
      <Outlet />
      <InstallBanner />
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border-border text-foreground shadow-xl",
            title: "text-foreground font-medium",
            description: "text-muted-foreground",
          },
        }}
      />
    </GlobalErrorBoundary>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => withSuspense(LoginPage),
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => withSuspense(FeedPage),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$userId",
  component: () => withSuspense(ProfilePage),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: () => withSuspense(MessagesPage),
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$userId",
  component: () => withSuspense(ConversationPage),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => withSuspense(SettingsPage),
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: () => withSuspense(PrivacyPolicyPage),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => withSuspense(TermsPage),
});

const guidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community-guidelines",
  component: () => withSuspense(GuidelinesPage),
});

const officialPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/official-page",
  component: () => withSuspense(OfficialPage),
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: () => withSuspense(ExplorePage),
});

const storiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stories",
  component: () => withSuspense(StoriesPage),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => withSuspense(AdminPage),
});

const friendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/friends",
  component: () => withSuspense(FriendsPage),
});

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/groups",
  component: () => withSuspense(GroupsPage),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  feedRoute,
  profileRoute,
  messagesRoute,
  conversationRoute,
  settingsRoute,
  privacyPolicyRoute,
  termsRoute,
  guidelinesRoute,
  officialPageRoute,
  exploreRoute,
  storiesRoute,
  adminRoute,
  friendsRoute,
  groupsRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
