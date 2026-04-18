import { Layout } from "@/components/Layout";
import { VerificationBadge } from "@/components/VerificationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedBackend } from "@/hooks/useAuthenticatedBackend";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { MessageView } from "@/types";
import { isVerifiedUser } from "@/utils/verification";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Lock,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Encoding ─────────────────────────────────────────────────────────────────

function encodeMessage(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function decodeMessage(data: Uint8Array): string {
  try {
    return new TextDecoder("utf-8").decode(data);
  } catch {
    return "[unable to decode]";
  }
}

function formatTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  if (ms === 0) return "";
  try {
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return "";
  }
}

// ─── Reaction emojis ──────────────────────────────────────────────────────────

const MSG_REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍"];

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isSent,
  onReact,
}: {
  msg: MessageView;
  isSent: boolean;
  onReact: (messageId: bigint, emoji: string) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const text = decodeMessage(msg.encryptedContent);

  return (
    <div
      className={`flex ${isSent ? "justify-end" : "justify-start"} group relative`}
      data-ocid={`message.item.${msg.id.toString()}`}
    >
      <div className="flex flex-col gap-0.5 max-w-[85%] sm:max-w-[72%]">
        {/* Main bubble */}
        <div
          className={`relative min-w-[80px] rounded-2xl px-3 sm:px-4 py-2.5 shadow-sm cursor-pointer select-text ${
            isSent
              ? "bg-primary text-primary-foreground rounded-br-sm metallic-border"
              : "bg-card border border-border text-card-foreground rounded-bl-sm"
          }`}
          onDoubleClick={() => setShowReactions((v) => !v)}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowReactions((v) => !v);
          }}
        >
          <p className="text-sm leading-relaxed break-words">{text}</p>
          <div
            className={`flex items-center gap-1 mt-1 ${isSent ? "justify-end" : "justify-start"}`}
          >
            <Lock className="w-2.5 h-2.5 opacity-60" />
            <span className="text-[10px] opacity-60">
              {formatTime(msg.createdAt)}
            </span>
            {/* Read receipts */}
            {isSent && (
              <span className="ml-0.5">
                {msg.isRead ? (
                  <CheckCheck className="w-3 h-3 opacity-70" />
                ) : (
                  <Check className="w-3 h-3 opacity-40" />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Reaction picker (appears on double-click or long-press) */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={{ duration: 0.15 }}
              className={`flex gap-1 bg-card border border-border rounded-2xl shadow-xl p-1.5 z-20 ${isSent ? "self-end" : "self-start"}`}
              data-ocid={`message.reaction_picker.${msg.id.toString()}`}
            >
              {MSG_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onReact(msg.id, emoji);
                    setShowReactions(false);
                  }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base hover:scale-125 hover:bg-secondary transition-smooth"
                  aria-label={emoji}
                >
                  {emoji}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowReactions(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth text-xs font-bold"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConversationPage() {
  const { status, profile } = useCurrentUser();
  const navigate = useNavigate();
  const { userId } = useParams({ strict: false }) as { userId: string };
  const { actor, isFetching } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);

  let otherUserPrincipal: Principal | null = null;
  try {
    otherUserPrincipal = Principal.fromText(userId);
  } catch {
    otherUserPrincipal = null;
  }

  // Fetch messages — poll every 5s
  const { data: messages, isLoading: msgsLoading } = useQuery<MessageView[]>({
    queryKey: ["messages", userId],
    queryFn: async () => {
      if (!actor || !otherUserPrincipal) return [];
      return actor.getMessages(otherUserPrincipal);
    },
    enabled: !!actor && !isFetching && !!otherUserPrincipal,
    refetchInterval: 5000,
  });

  // Fetch other user profile
  const { data: otherProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!actor || !otherUserPrincipal) return null;
      return actor.getUserProfile(otherUserPrincipal);
    },
    enabled: !!actor && !isFetching && !!otherUserPrincipal,
  });

  // Mark messages as read when conversation is opened/updated
  useEffect(() => {
    if (!messages || !actor) return;
    const myId = profile?.id?.toString();
    const unread = messages.filter(
      (m) => !m.isRead && m.senderId.toString() !== myId,
    );
    for (const m of unread) {
      void actor.markMessageRead(m.id);
    }
  }, [messages, actor, profile]);

  // Auto-scroll
  useEffect(() => {
    if (messages) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send mutation
  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!actor || !otherUserPrincipal) throw new Error("Not connected");
      const encoded = encodeMessage(text);
      return actor.sendMessage(otherUserPrincipal, encoded);
    },
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({ queryKey: ["messages", userId] });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  // React to message
  const handleReact = async (messageId: bigint, emoji: string) => {
    if (!actor) return;
    // Map emoji to ReactionType
    const emojiToType: Record<string, string> = {
      "❤️": "love",
      "😂": "haha",
      "😮": "wow",
      "😢": "sad",
      "😡": "angry",
      "👍": "like",
    };
    const reactionType = emojiToType[emoji] ?? "like";
    try {
      await actor.reactToMessage(
        messageId,
        reactionType as import("@/types").ReactionType,
      );
      void queryClient.invalidateQueries({ queryKey: ["messages", userId] });
    } catch {
      toast.error("Failed to react");
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || sendMutation.isPending) return;
    sendMutation.mutate(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (status === "initializing") {
    return (
      <Layout>
        <Skeleton className="h-[70vh] w-full rounded-xl" />
      </Layout>
    );
  }

  if (status === "unauthenticated") return null;

  const displayName = otherProfile?.username
    ? `@${otherProfile.username}`
    : `@${userId.slice(0, 8)}…`;

  const msgList = messages ?? [];
  const myId = profile?.id?.toString();

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto flex flex-col"
        style={{ height: "calc(100dvh - 3.5rem)" }}
        data-ocid="conversation-page"
      >
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 pb-3 border-b border-border shrink-0 pt-1">
          <Button
            data-ocid="back-to-messages"
            variant="ghost"
            size="icon"
            onClick={() => void navigate({ to: "/messages" })}
            className="shrink-0 w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
            <span className="font-display font-semibold text-base text-foreground uppercase">
              {(otherProfile?.username ?? userId).charAt(0)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2
              className="flex items-center font-semibold text-foreground min-w-0 text-sm sm:text-base"
              style={{ gap: "2px" }}
            >
              <span className="truncate">{displayName}</span>
              {otherProfile?.username &&
                isVerifiedUser(
                  otherProfile.username,
                  otherProfile.isVerified,
                ) && <VerificationBadge size={16} />}
            </h2>
            {otherProfile?.bio && (
              <p className="text-xs text-muted-foreground truncate">
                {otherProfile.bio}
              </p>
            )}
          </div>

          <Badge
            data-ocid="encryption-badge"
            variant="outline"
            className="text-primary border-primary/30 bg-primary/10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 shrink-0"
          >
            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[10px] sm:text-xs font-medium hidden xs:inline">
              End-to-End
            </span>
          </Badge>
        </div>

        {/* Message thread */}
        <div
          data-ocid="message-thread"
          className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin overscroll-contain"
        >
          {msgsLoading ? (
            <div className="space-y-3">
              {["m1", "m2", "m3"].map((k) => (
                <Skeleton key={k} className="h-12 w-3/5 rounded-2xl" />
              ))}
            </div>
          ) : msgList.length === 0 ? (
            <div
              data-ocid="empty-messages"
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No messages yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Send a message to start your encrypted conversation with{" "}
                {displayName}.
              </p>
            </div>
          ) : (
            msgList.map((msg) => (
              <MessageBubble
                key={msg.id.toString()}
                msg={msg}
                isSent={msg.senderId.toString() === myId}
                onReact={handleReact}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Send form */}
        <div
          data-ocid="send-message-form"
          className="pt-3 border-t border-border shrink-0"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                data-ocid="message-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                rows={1}
                className="resize-none bg-card border-border focus:border-primary/60 focus:ring-primary/20 min-h-[44px] max-h-32 overflow-y-auto pr-4"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <div className="absolute right-3 bottom-2.5 flex items-center gap-1 pointer-events-none">
                <Lock className="w-3 h-3 text-muted-foreground opacity-60" />
              </div>
            </div>
            <Button
              data-ocid="send-message-btn"
              onClick={handleSend}
              disabled={!draft.trim() || sendMutation.isPending}
              className="shrink-0 h-11 w-11 sm:w-auto sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 metallic-border transition-smooth rounded-xl"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Send</span>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-primary/70" />
            Encrypted — only you and {displayName} can read. Double-tap a
            message to react.
          </p>
        </div>
      </div>
    </Layout>
  );
}
