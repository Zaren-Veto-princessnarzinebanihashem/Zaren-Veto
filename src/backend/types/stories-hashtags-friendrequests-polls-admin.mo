import Common "common";
import UPMTypes "users-posts-messages";

module {
  // ─── Stories ──────────────────────────────────────────────────────────────
  public type StoryId = Nat;

  public type Story = {
    id          : StoryId;
    authorId    : Common.UserId;
    imageUrl    : Text; // base64
    textOverlay : ?Text;
    createdAt   : Common.Timestamp;
    expiresAt   : Common.Timestamp; // createdAt + 86400000000000 nanoseconds
    var views   : [Common.UserId];
    var isDeleted : Bool;
  };

  public type StoryView = {
    id          : StoryId;
    author      : UPMTypes.UserProfile;
    imageUrl    : Text;
    textOverlay : ?Text;
    createdAt   : Common.Timestamp;
    expiresAt   : Common.Timestamp;
    viewCount   : Nat;
    viewedByMe  : Bool;
  };

  public type StoryFeed = {
    author      : UPMTypes.UserProfile;
    stories     : [StoryView];
    hasUnviewed : Bool;
  };

  // ─── Hashtags / Explore ───────────────────────────────────────────────────
  public type HashtagStat = {
    hashtag   : Text;
    postCount : Nat;
  };

  public type SearchResults = {
    users : [UPMTypes.UserProfile];
    posts : [UPMTypes.PostView];
  };

  // ─── Friend Requests ──────────────────────────────────────────────────────
  public type FriendRequestId = Nat;

  public type FriendRequestStatus = {
    #pending;
    #accepted;
    #declined;
    #blocked;
  };

  public type FriendRequest = {
    id        : FriendRequestId;
    from      : Common.UserId;
    to        : Common.UserId;
    var status : FriendRequestStatus;
    createdAt : Common.Timestamp;
  };

  public type FriendRequestView = {
    id        : FriendRequestId;
    from      : UPMTypes.UserProfile;
    to        : UPMTypes.UserProfile;
    status    : Text;
    createdAt : Common.Timestamp;
  };

  public type RespondAction = { #accept; #decline; #block };

  // ─── Polls ────────────────────────────────────────────────────────────────
  public type PollId = Nat;

  public type PollOption = {
    id   : Nat;
    text : Text;
  };

  public type Poll = {
    id       : PollId;
    postId   : Common.PostId;
    question : Text;
    options  : [PollOption];
    createdAt : Common.Timestamp;
  };

  public type PollVote = {
    pollId   : PollId;
    optionId : Nat;
    voter    : Common.UserId;
    createdAt : Common.Timestamp;
  };

  public type PollOptionResult = {
    id      : Nat;
    text    : Text;
    votes   : Nat;
    percent : Float;
  };

  public type PollResults = {
    options    : [PollOptionResult];
    totalVotes : Nat;
    myVote     : ?Nat;
  };

  public type PollSummary = {
    pollId     : PollId;
    question   : Text;
    options    : [PollOption];
    totalVotes : Nat;
    myVote     : ?Nat;
  };

  // ─── Message Reactions and Read Receipts ──────────────────────────────────
  public type MessageReactionView = {
    reactor  : UPMTypes.UserProfile;
    reaction : Text;
  };

  // ─── Admin ────────────────────────────────────────────────────────────────
  public type AdminStats = {
    totalUsers     : Nat;
    totalPosts     : Nat;
    totalStories   : Nat;
    totalMessages  : Nat;
    verifiedUsers  : Nat;
    pendingReports : Nat;
  };

  public type ReportStatus = { #pending; #dismissed; #resolved };

  public type ReportView = {
    id           : Nat;
    reporter     : UPMTypes.UserProfile;
    reportedUser : ?UPMTypes.UserProfile;
    reportedPost : ?UPMTypes.PostView;
    reason       : Text;
    status       : Text;
    createdAt    : Common.Timestamp;
  };

  public type ResolveAction = { #dismiss; #deleteContent; #suspendUser; #banUser };

  public type UserSuspension = {
    userId    : Common.UserId;
    until     : Common.Timestamp;
  };
};
