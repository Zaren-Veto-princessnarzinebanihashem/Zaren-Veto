import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { InstallBanner } from "./components/InstallBanner";

// Lazy-load pages
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

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
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
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <LoginPage />
    </Suspense>
  ),
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FeedPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$userId",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ProfilePage />
    </Suspense>
  ),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <MessagesPage />
    </Suspense>
  ),
});

const conversationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/messages/$userId",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ConversationPage />
    </Suspense>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <SettingsPage />
    </Suspense>
  ),
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <PrivacyPolicyPage />
    </Suspense>
  ),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <TermsPage />
    </Suspense>
  ),
});

const guidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community-guidelines",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <GuidelinesPage />
    </Suspense>
  ),
});

const officialPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/official-page",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <OfficialPage />
    </Suspense>
  ),
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ExplorePage />
    </Suspense>
  ),
});

const storiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stories",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <StoriesPage />
    </Suspense>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AdminPage />
    </Suspense>
  ),
});

const friendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/friends",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <FriendsPage />
    </Suspense>
  ),
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
]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
