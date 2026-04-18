import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLanguage } from "@/i18n/LanguageContext";
import type { ConversationSummary, UserProfile } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Lock, MessageSquare, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  if (ms === 0) return "";
  try {
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return "";
  }
}

function ConversationCard({ conv }: { conv: ConversationSummary }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userId = conv.otherUserId.toString();
  const preview = conv.lastMessagePreview || t.noMessagesYet;

  return (
    <button
      type="button"
      data-ocid="conversation-card"
      onClick={() => void navigate({ to: `/messages/${userId}` })}
      className="w-full text-left group"
    >
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-smooth cursor-pointer">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
            <span className="font-display font-semibold text-lg text-foreground uppercase">
              {conv.otherUsername.charAt(0)}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="flex items-center gap-1 font-semibold text-foreground min-w-0">
              <span
                className="inline-flex items-center min-w-0"
                style={{ gap: "2px" }}
              >
                <span className="truncate">@{conv.otherUsername}</span>
                {isVerifiedUser(conv.otherUsername) && (
                  <VerificationBadge size={16} />
                )}
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant="outline"
                className="text-primary border-primary/30 bg-primary/10 flex items-center gap-1 text-xs py-0"
              >
                <ShieldCheck className="w-3 h-3" />
                {t.encrypted}
              </Badge>
              {conv.lastMessageAt > 0n && (
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(conv.lastMessageAt)}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate">{preview}</p>
        </div>
      </div>
    </button>
  );
}

function SearchResultRow({
  user,
  onSelect,
}: {
  user: UserProfile;
  onSelect: (u: UserProfile) => void;
}) {
  return (
    <button
      type="button"
      data-ocid="search-result-row"
      onClick={() => onSelect(user)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors rounded-lg text-left"
    >
      <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
        <span className="font-display font-semibold text-base text-foreground uppercase">
          {user.username.charAt(0)}
        </span>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1 font-medium text-foreground min-w-0">
          <span
            className="inline-flex items-center min-w-0"
            style={{ gap: "2px" }}
          >
            <span className="truncate">@{user.username}</span>
            {isVerifiedUser(user.username, user.isVerified) && (
              <VerificationBadge size={15} />
            )}
          </span>
        </p>
        {user.bio && (
          <p className="text-xs text-muted-foreground truncate">{user.bio}</p>
        )}
      </div>
    </button>
  );
}

export default function MessagesPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedTerm(searchTerm), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  const { data: conversations, isLoading: convsLoading } = useQuery<
    ConversationSummary[]
  >({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 8000,
  });

  const { data: searchResults, isFetching: searching } = useQuery<
    UserProfile[]
  >({
    queryKey: ["userSearch", debouncedTerm],
    queryFn: async () => {
      if (!actor || !debouncedTerm.trim()) return [];
      return actor.searchUsers(debouncedTerm.trim());
    },
    enabled: !!actor && !isFetching && debouncedTerm.trim().length > 0,
  });

  const handleSelectUser = (user: UserProfile) => {
    setSearchTerm("");
    setDebouncedTerm("");
    void navigate({ to: `/messages/${user.id.toString()}` });
  };

  if (status === "initializing") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-3 py-6">
          {["s1", "s2", "s3"].map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </Layout>
    );
  }

  if (status === "unauthenticated") return null;

  const showSearch = searchTerm.trim().length > 0;
  const convList = conversations ?? [];

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6"
        data-ocid="messages-page"
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              {t.messagesTitle}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t.allEncrypted}
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-primary border-primary/30 bg-primary/10 flex items-center gap-1.5 px-3 py-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-medium">{t.e2eEncrypted}</span>
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="search-users-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchUsersPlaceholder}
            className="pl-9 pr-9 h-11 bg-card border-border focus:border-primary/60 focus:ring-primary/20 w-full"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setDebouncedTerm("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search dropdown */}
          {showSearch && (
            <div className="absolute z-20 top-full mt-1 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
              {searching && (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {t.searching}
                </div>
              )}
              {!searching && searchResults && searchResults.length === 0 && (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {t.noUsersFound.replace("{term}", debouncedTerm)}
                </div>
              )}
              {!searching &&
                searchResults &&
                searchResults.map((u) => (
                  <SearchResultRow
                    key={u.id.toString()}
                    user={u}
                    onSelect={handleSelectUser}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Conversation list */}
        {convsLoading ? (
          <div className="space-y-3">
            {["l1", "l2", "l3"].map((k) => (
              <Skeleton key={k} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : convList.length === 0 ? (
          <div
            data-ocid="empty-conversations"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              {t.noConversationsYet}
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {t.noConversationsDesc}
            </p>
            <Button
              data-ocid="start-conversation-cta"
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => {
                const el = document.querySelector<HTMLInputElement>(
                  '[data-ocid="search-users-input"]',
                );
                el?.focus();
              }}
            >
              <Search className="w-4 h-4 mr-2" />
              {t.findSomeoneToMessage}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {convList.map((conv) => (
              <ConversationCard key={conv.conversationId} conv={conv} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
