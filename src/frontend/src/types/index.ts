// Re-export all backend types for frontend use
export type {
  UserId,
  Timestamp,
  MessageId,
  PostId,
  MessageView,
  PostView,
  ConversationSummary,
  UserProfile,
  ConversationId,
  StoryView,
  StoryFeed,
  HashtagStat,
  SearchResults,
  FriendRequestView,
  PollResults,
  PollOptionResult,
  AdminStats,
  ReportView,
  MessageReactionView,
  CommentView,
  NotificationView,
} from "../backend";

export {
  Visibility,
  ReactionType,
  RespondAction,
  ResolveAction,
} from "../backend";

// App-level state types
export type AuthStatus =
  | "initializing"
  | "unauthenticated"
  | "registering"
  | "authenticated";

export interface AppUser {
  profile: import("../backend.d.ts").UserProfile;
}

// ─── Frontend-only view types ────────────────────────────────────────────────

export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
}

export interface ReactionSummary {
  type: import("../backend.d.ts").ReactionType;
  count: number;
  userReacted: boolean;
}

export interface SavedPost {
  postId: bigint;
  savedAt: bigint;
}

export interface ReportReason {
  key:
    | "spam"
    | "harassment"
    | "hate_speech"
    | "violence"
    | "misinformation"
    | "nudity"
    | "other";
  label: string;
}

// ─── Poll types ────────────────────────────────────────────────────────────

export interface PollOption {
  id: bigint;
  text: string;
}

export interface PollSummary {
  pollId: bigint;
  question: string;
  options: PollOption[];
  totalVotes: bigint;
  myVote?: bigint;
}

// ─── Friend Request types ──────────────────────────────────────────────────

export type FriendRequestStatus =
  | "none"
  | "sent"
  | "received"
  | "accepted"
  | "blocked";
