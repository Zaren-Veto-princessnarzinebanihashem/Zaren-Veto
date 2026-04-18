import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface PollOptionResult {
    id: bigint;
    votes: bigint;
    text: string;
    percent: number;
}
export type PostId = bigint;
export interface PostView {
    id: PostId;
    authorVerified: boolean;
    content: string;
    authorProfilePhoto?: string;
    authorId: UserId;
    createdAt: Timestamp;
    authorName: string;
    updatedAt: Timestamp;
    imageUrl?: string;
    visibility: Visibility;
    isPinned: boolean;
}
export interface SearchResults {
    users: Array<UserProfile>;
    posts: Array<PostView>;
}
export interface PollResults {
    totalVotes: bigint;
    myVote?: bigint;
    options: Array<PollOptionResult>;
}
export interface PostStats {
    shares: bigint;
    likes: bigint;
    comments: bigint;
}
export interface StoryFeed {
    stories: Array<StoryView>;
    author: UserProfile;
    hasUnviewed: boolean;
}
export interface NotificationView {
    id: NotificationId;
    actorName: string;
    notifType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    actorId: UserId;
}
export type ConversationId = string;
export interface StoryView {
    id: StoryId;
    expiresAt: Timestamp;
    viewedByMe: boolean;
    createdAt: Timestamp;
    author: UserProfile;
    imageUrl: string;
    textOverlay?: string;
    viewCount: bigint;
}
export interface ConversationSummary {
    lastMessageAt: Timestamp;
    otherUsername: string;
    lastMessagePreview: string;
    otherUserId: UserId;
    conversationId: ConversationId;
}
export interface HashtagStat {
    postCount: bigint;
    hashtag: string;
}
export type CommentId = bigint;
export type FriendRequestId = bigint;
export interface FriendRequestView {
    id: FriendRequestId;
    to: UserProfile;
    status: string;
    from: UserProfile;
    createdAt: Timestamp;
}
export type StoryId = bigint;
export interface ReportView {
    id: bigint;
    status: string;
    reportedPost?: PostView;
    reportedUser?: UserProfile;
    createdAt: Timestamp;
    reporter: UserProfile;
    reason: string;
}
export interface MessageReactionView {
    reactor: UserProfile;
    reaction: string;
}
export interface CommentView {
    id: CommentId;
    content: string;
    authorId: UserId;
    createdAt: Timestamp;
    authorName: string;
    updatedAt: Timestamp;
    replyCount: bigint;
    parentId?: CommentId;
    postId: PostId;
}
export type UserId = Principal;
export type NotificationType = {
    __kind__: "verified";
    verified: {
    };
} | {
    __kind__: "like";
    like: {
        postId: PostId;
    };
} | {
    __kind__: "share";
    share: {
        postId: PostId;
    };
} | {
    __kind__: "comment";
    comment: {
        commentId: CommentId;
        postId: PostId;
    };
} | {
    __kind__: "mention";
    mention: {
        postId: PostId;
    };
} | {
    __kind__: "friendRequest";
    friendRequest: {
        requestId: bigint;
    };
} | {
    __kind__: "reaction";
    reaction: {
        reaction: ReactionType;
        postId: PostId;
    };
} | {
    __kind__: "follow";
    follow: {
    };
};
export interface AdminStats {
    pendingReports: bigint;
    totalMessages: bigint;
    verifiedUsers: bigint;
    totalUsers: bigint;
    totalPosts: bigint;
    totalStories: bigint;
}
export type MessageId = bigint;
export type NotificationId = bigint;
export interface MessageView {
    id: MessageId;
    encryptedContent: Uint8Array;
    createdAt: Timestamp;
    isRead: boolean;
    conversationId: ConversationId;
    senderId: UserId;
    readAt?: Timestamp;
}
export interface UserProfile {
    id: UserId;
    bio: string;
    postCount: bigint;
    username: string;
    aboutWebsite?: string;
    birthdate?: string;
    isOfficialPage: boolean;
    isVerified: boolean;
    aboutBio?: string;
    aboutWork?: string;
    aboutLocation?: string;
    followerCount: bigint;
    followingCount: bigint;
    profilePhotoUrl?: string;
    visibility: Visibility;
    coverPhotoUrl?: string;
    aboutEducation?: string;
}
export enum ReactionType {
    sad = "sad",
    wow = "wow",
    angry = "angry",
    haha = "haha",
    like = "like",
    love = "love"
}
export enum ResolveAction {
    banUser = "banUser",
    deleteContent = "deleteContent",
    dismiss = "dismiss",
    suspendUser = "suspendUser"
}
export enum RespondAction {
    accept = "accept",
    block = "block",
    decline = "decline"
}
export enum Visibility {
    everyone = "everyone",
    followersOnly = "followersOnly",
    friendsOnly = "friendsOnly",
    customList = "customList"
}
export interface backendInterface {
    addComment(postId: PostId, text: string): Promise<CommentId>;
    banUser(userId: UserId): Promise<boolean>;
    blockUser(userId: UserId): Promise<void>;
    cancelFriendRequest(requestId: bigint): Promise<boolean>;
    createOfficialPost(content: string, imageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: PostId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createPoll(postId: PostId, question: string, options: Array<string>): Promise<bigint>;
    createPost(content: string, visibility: Visibility, customAllowList: Array<UserId>, imageUrl: string | null): Promise<{
        __kind__: "ok";
        ok: PostId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createStory(imageUrl: string, textOverlay: string | null): Promise<StoryView>;
    deleteComment(commentId: CommentId): Promise<void>;
    deletePost(postId: PostId): Promise<boolean>;
    deleteStory(storyId: bigint): Promise<void>;
    editComment(commentId: CommentId, text: string): Promise<void>;
    editPost(postId: PostId, content: string): Promise<boolean>;
    followUser(target: UserId): Promise<boolean>;
    getAdminStats(): Promise<AdminStats>;
    getAllUsers(page: bigint, pageSize: bigint): Promise<Array<UserProfile>>;
    getComments(postId: PostId): Promise<Array<CommentView>>;
    getConversations(): Promise<Array<ConversationSummary>>;
    getFeed(): Promise<Array<PostView>>;
    getFriendRequestStatus(userId: UserId): Promise<string>;
    getHashtagPosts(hashtag: string): Promise<Array<PostView>>;
    getLikes(postId: PostId): Promise<Array<UserId>>;
    getMessageReactions(messageId: MessageId): Promise<Array<MessageReactionView>>;
    getMessages(otherUser: UserId): Promise<Array<MessageView>>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyReaction(postId: PostId): Promise<ReactionType | null>;
    getMyStories(): Promise<Array<StoryView>>;
    getNotifications(): Promise<Array<NotificationView>>;
    getOfficialPage(): Promise<UserProfile>;
    getOfficialPagePosts(page: bigint, pageSize: bigint): Promise<Array<PostView>>;
    getPendingRequests(): Promise<Array<FriendRequestView>>;
    getPollResults(pollId: bigint): Promise<PollResults>;
    getPostStats(postId: PostId): Promise<PostStats>;
    getReactions(postId: PostId): Promise<Array<[ReactionType, bigint]>>;
    getReports(page: bigint, pageSize: bigint): Promise<Array<ReportView>>;
    getSavedPosts(): Promise<Array<PostView>>;
    getSentRequests(): Promise<Array<FriendRequestView>>;
    getShares(postId: PostId): Promise<bigint>;
    getStoriesFeed(): Promise<Array<StoryFeed>>;
    getStoryViewers(storyId: bigint): Promise<Array<UserProfile>>;
    getTrendingHashtags(): Promise<Array<HashtagStat>>;
    getUnreadCount(): Promise<bigint>;
    getUserPosts(userId: UserId): Promise<Array<PostView>>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    grantVerification(userId: UserId): Promise<boolean>;
    hasLiked(postId: PostId): Promise<boolean>;
    isBlocked(userId: UserId): Promise<boolean>;
    isFollowing(target: UserId): Promise<boolean>;
    isVerified(userId: UserId): Promise<boolean>;
    likePost(postId: PostId): Promise<void>;
    markMessageRead(messageId: MessageId): Promise<void>;
    markNotificationsRead(): Promise<void>;
    pinPost(postId: PostId): Promise<boolean>;
    reactToMessage(messageId: MessageId, reaction: ReactionType): Promise<boolean>;
    reactToPost(postId: PostId, reaction: ReactionType): Promise<void>;
    register(username: string, bio: string): Promise<boolean>;
    registerWithPassword(username: string, password: string, bio: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeMessageReaction(messageId: MessageId): Promise<boolean>;
    removeReaction(postId: PostId): Promise<void>;
    replyToComment(parentCommentId: CommentId, text: string): Promise<CommentId>;
    reportPost(postId: PostId, reason: string): Promise<void>;
    reportUser(userId: UserId, reason: string): Promise<void>;
    resolveReport(reportId: bigint, action: ResolveAction): Promise<boolean>;
    respondFriendRequest(requestId: bigint, action: RespondAction): Promise<boolean>;
    revokeVerification(userId: UserId): Promise<boolean>;
    savePost(postId: PostId): Promise<void>;
    searchContent(searchQuery: string): Promise<SearchResults>;
    searchUsers(term: string): Promise<Array<UserProfile>>;
    sendFriendRequest(to: UserId): Promise<boolean>;
    sendMessage(recipient: UserId, encryptedContent: Uint8Array): Promise<MessageId>;
    sharePost(postId: PostId): Promise<void>;
    suspendUser(userId: UserId, durationHours: bigint): Promise<boolean>;
    unblockUser(userId: UserId): Promise<void>;
    unfollowUser(target: UserId): Promise<boolean>;
    unlikePost(postId: PostId): Promise<void>;
    unpinPost(): Promise<boolean>;
    unsavePost(postId: PostId): Promise<void>;
    unsharePost(postId: PostId): Promise<void>;
    updateAbout(bio: string | null, location: string | null, work: string | null, education: string | null, website: string | null): Promise<boolean>;
    updateCoverPhoto(imageUrl: string): Promise<void>;
    updateProfile(username: string, bio: string, visibility: Visibility): Promise<boolean>;
    updateProfilePhoto(imageUrl: string): Promise<void>;
    viewStory(storyId: bigint): Promise<void>;
    votePoll(pollId: bigint, optionId: bigint): Promise<boolean>;
}
