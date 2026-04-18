import Common "common";

module {
  // ─── Reaction ─────────────────────────────────────────────────────────────
  public type ReactionType = { #like; #love; #haha; #wow; #sad; #angry };

  // ─── Comment ──────────────────────────────────────────────────────────────
  public type CommentId = Nat;

  public type Comment = {
    id        : CommentId;
    postId    : Common.PostId;
    authorId  : Common.UserId;
    authorName : Text;
    var content  : Text;
    parentId  : ?CommentId; // null = top-level; Some(id) = reply
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
    var isDeleted : Bool;
  };

  // Shared (immutable, API-boundary) projection of Comment
  public type CommentView = {
    id         : CommentId;
    postId     : Common.PostId;
    authorId   : Common.UserId;
    authorName : Text;
    content    : Text;
    parentId   : ?CommentId;
    createdAt  : Common.Timestamp;
    updatedAt  : Common.Timestamp;
    replyCount : Nat;
  };

  // ─── Share ────────────────────────────────────────────────────────────────
  public type Share = {
    userId   : Common.UserId;
    postId   : Common.PostId;
    sharedAt : Common.Timestamp;
  };

  // ─── Notification ─────────────────────────────────────────────────────────
  public type NotificationId = Nat;
  public type NotificationType = {
    #like      : { postId : Common.PostId };
    #reaction  : { postId : Common.PostId; reaction : ReactionType };
    #comment   : { postId : Common.PostId; commentId : CommentId };
    #follow    : {};
    #mention   : { postId : Common.PostId };
    #share     : { postId : Common.PostId };
    #verified  : {};
    #friendRequest : { requestId : Nat };
  };

  public type Notification = {
    id         : NotificationId;
    recipientId : Common.UserId;
    actorId    : Common.UserId;
    actorName  : Text;
    notifType  : NotificationType;
    createdAt  : Common.Timestamp;
    var isRead : Bool;
  };

  // Shared projection
  public type NotificationView = {
    id          : NotificationId;
    actorId     : Common.UserId;
    actorName   : Text;
    notifType   : NotificationType;
    createdAt   : Common.Timestamp;
    isRead      : Bool;
  };

  // ─── Report ───────────────────────────────────────────────────────────────
  public type ReportId = Nat;
  public type ReportTarget = { #post : Common.PostId; #user : Common.UserId };
  public type ReportStatus = { #pending; #dismissed; #resolved };

  public type Report = {
    id        : ReportId;
    reporterId : Common.UserId;
    target    : ReportTarget;
    reason    : Text;
    createdAt : Common.Timestamp;
    var status : ReportStatus;
  };

  // ─── Message reactions ────────────────────────────────────────────────────
  public type MessageReaction = {
    messageId : Common.MessageId;
    reactor   : Common.UserId;
    reaction  : ReactionType;
    createdAt : Common.Timestamp;
  };

  // ─── Post stats (aggregated view) ─────────────────────────────────────────
  public type PostStats = {
    likes     : Nat;
    comments  : Nat;
    shares    : Nat;
  };
};
