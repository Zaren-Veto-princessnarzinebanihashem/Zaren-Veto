import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "../types";
import { useAuthenticatedBackend } from "./useAuthenticatedBackend";

export type UserStatus =
  | "initializing"
  | "unauthenticated"
  | "registering"
  | "authenticated";

const PASSWORD_AUTH_KEY = "passwordAuthUserId";

/** Persisted password session — stored as a serialised Principal string */
function getStoredPasswordSession(): string | null {
  try {
    return localStorage.getItem(PASSWORD_AUTH_KEY);
  } catch {
    return null;
  }
}

function setStoredPasswordSession(userId: string): void {
  try {
    localStorage.setItem(PASSWORD_AUTH_KEY, userId);
  } catch {
    /* ignore */
  }
}

function clearStoredPasswordSession(): void {
  try {
    localStorage.removeItem(PASSWORD_AUTH_KEY);
  } catch {
    /* ignore */
  }
}

export function useCurrentUser() {
  const { identity, isInitializing, clear: clearII } = useInternetIdentity();
  const { actor, isFetching } = useAuthenticatedBackend();
  const queryClient = useQueryClient();

  // ── Password session state ────────────────────────────────────────────────
  // null  = not checked yet
  // false = no password session
  // UserProfile = password-authenticated user
  const [passwordProfile, setPasswordProfile] = useState<
    UserProfile | null | false
  >(null);
  const [passwordSessionChecked, setPasswordSessionChecked] = useState(false);

  // On mount: check if there's a stored password session
  useEffect(() => {
    const stored = getStoredPasswordSession();
    if (!stored) {
      setPasswordProfile(false);
      setPasswordSessionChecked(true);
      return;
    }

    // We need an actor to call getUserProfile. Poll until actor is ready.
    // The actor may use anonymous identity for loginWithPasswordOnly — it works.
    // For getUserProfile we can use the same actor once it's available.
    // We'll handle the actual fetch in a separate effect once actor is ready.
  }, []);

  // Once actor is available and we have a stored session id, fetch the profile
  useEffect(() => {
    if (passwordSessionChecked) return;
    if (!actor || isFetching) return;

    const stored = getStoredPasswordSession();
    if (!stored) {
      setPasswordProfile(false);
      setPasswordSessionChecked(true);
      return;
    }

    // We have a stored userId — try to fetch their profile
    void (async () => {
      try {
        // The stored value is the principal text from the userId
        // We need to parse it back as a Principal for the call.
        // The backend.d.ts shows UserId = Principal. Use the actor to search.
        // Actually getUserProfile takes UserId (Principal). We stored the textual
        // representation. We need to reconstruct it.
        const { Principal } = await import("@icp-sdk/core/principal");
        const userId = Principal.fromText(stored);
        const profile = await actor.getUserProfile(userId);
        if (profile) {
          setPasswordProfile(profile);
        } else {
          // Profile no longer exists, clear the session
          clearStoredPasswordSession();
          setPasswordProfile(false);
        }
      } catch {
        clearStoredPasswordSession();
        setPasswordProfile(false);
      } finally {
        setPasswordSessionChecked(true);
      }
    })();
  }, [actor, isFetching, passwordSessionChecked]);

  // ── II profile query (only when logged in via II) ──────────────────────────
  const { data: iiProfile, isLoading: isProfileLoading } =
    useQuery<UserProfile | null>({
      queryKey: ["myProfile"],
      queryFn: async () => {
        if (!actor) return null;
        try {
          return await actor.getMyProfile();
        } catch {
          return null;
        }
      },
      enabled: !!actor && !isFetching && !!identity,
      retry: 1,
    });

  // ── Registration mutations ─────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: async ({
      username,
      bio,
    }: { username: string; bio: string }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.register(username, bio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  const registerWithPasswordMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      email,
      bio,
    }: { username: string; password: string; email?: string; bio: string }) => {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.registerWithPassword(
        username,
        password,
        bio,
        email ?? null,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  // ── Password-only login ────────────────────────────────────────────────────
  const loginWithPasswordMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.loginWithPasswordOnly(username, password);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok; // { userId: Principal, profile: UserProfile }
    },
    onSuccess: (data) => {
      // Store the userId as text for session restoration
      const userIdText = data.userId.toText();
      setStoredPasswordSession(userIdText);
      setPasswordProfile(data.profile);
      setPasswordSessionChecked(true);
    },
  });

  // ── Standalone registration (no II) + auto-login ──────────────────────────
  const registerWithPasswordOnlyMutation = useMutation({
    mutationFn: async ({
      username,
      password,
      email,
      bio,
    }: { username: string; password: string; email?: string; bio: string }) => {
      if (!actor) throw new Error("Backend not ready");
      // Register
      const regResult = await actor.registerWithPassword(
        username,
        password,
        bio,
        email ?? null,
      );
      if (regResult.__kind__ === "err") throw new Error(regResult.err);
      // Auto-login after registration
      const loginResult = await actor.loginWithPasswordOnly(username, password);
      if (loginResult.__kind__ === "err") throw new Error(loginResult.err);
      return loginResult.ok;
    },
    onSuccess: (data) => {
      const userIdText = data.userId.toText();
      setStoredPasswordSession(userIdText);
      setPasswordProfile(data.profile);
      setPasswordSessionChecked(true);
    },
  });

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearStoredPasswordSession();
    setPasswordProfile(false);
    setPasswordSessionChecked(true);
    if (clearII) clearII();
    queryClient.clear();
  }, [clearII, queryClient]);

  // ── Derive status ─────────────────────────────────────────────────────────
  let status: UserStatus = "initializing";

  const isPasswordAuthenticated =
    passwordSessionChecked &&
    passwordProfile !== null &&
    passwordProfile !== false;

  if (!passwordSessionChecked || isInitializing || isFetching) {
    status = "initializing";
  } else if (isPasswordAuthenticated) {
    // Password session takes priority — user is fully authenticated
    status = "authenticated";
  } else if (!identity) {
    status = "unauthenticated";
  } else if (isProfileLoading) {
    status = "initializing";
  } else if (iiProfile === null || iiProfile === undefined) {
    status = "registering";
  } else {
    status = "authenticated";
  }

  // Active profile: password session or II profile
  const profile: UserProfile | null = isPasswordAuthenticated
    ? (passwordProfile as UserProfile)
    : (iiProfile ?? null);

  return {
    status,
    profile,
    identity,
    isPasswordSession: isPasswordAuthenticated,

    // II registration
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // II + password registration (used when II is active, status=registering)
    registerWithPassword: registerWithPasswordMutation.mutateAsync,
    isRegisteringWithPassword: registerWithPasswordMutation.isPending,
    registerWithPasswordError: registerWithPasswordMutation.error,

    // Password-only login (no II needed)
    loginWithPassword: loginWithPasswordMutation.mutateAsync,
    isLoggingInWithPassword: loginWithPasswordMutation.isPending,
    loginWithPasswordError: loginWithPasswordMutation.error,

    // Password-only registration + auto-login (no II needed)
    registerWithPasswordOnly: registerWithPasswordOnlyMutation.mutateAsync,
    isRegisteringWithPasswordOnly: registerWithPasswordOnlyMutation.isPending,
    registerWithPasswordOnlyError: registerWithPasswordOnlyMutation.error,

    logout,
  };
}
