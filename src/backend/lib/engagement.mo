import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Array "mo:core/Array";
import Common "../types/common";
import Types "../types/engagement";

/// Domain logic for engagement features: likes, reactions, comments,
/// shares, notifications, saved posts, reports, verification, message reactions.
module {

  // ── Likes ──────────────────────────────────────────────────────────────────

  /// Add caller to the like set of a post.
  public func likePost(
    likes   : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    postId  : Common.PostId,
    caller  : Common.UserId,
  ) {
    let likeSet = switch (likes.get(postId)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        likes.add(postId, s);
        s;
      };
    };
    likeSet.add(caller);
  };

  /// Remove caller from the like set of a post.
  public func unlikePost(
    likes   : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    postId  : Common.PostId,
    caller  : Common.UserId,
  ) {
    switch (likes.get(postId)) {
      case null {};
      case (?likeSet) { likeSet.remove(caller) };
    };
  };

  /// Return all users who liked a post.
  public func getLikes(
    likes  : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    postId : Common.PostId,
  ) : [Common.UserId] {
    switch (likes.get(postId)) {
      case null    { [] };
      case (?likeSet) { likeSet.toArray() };
    };
  };

  /// Return whether caller has liked a post.
  public func hasLiked(
    likes  : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    postId : Common.PostId,
    caller : Common.UserId,
  ) : Bool {
    switch (likes.get(postId)) {
      case null        { false };
      case (?likeSet)  { likeSet.contains(caller) };
    };
  };

  // ── Reactions ──────────────────────────────────────────────────────────────

  /// Add or replace caller's emoji reaction on a post.
  public func reactToPost(
    reactions : Map.Map<Common.PostId, Map.Map<Common.UserId, Types.ReactionType>>,
    postId    : Common.PostId,
    caller    : Common.UserId,
    reaction  : Types.ReactionType,
  ) {
    let postReactions = switch (reactions.get(postId)) {
      case (?m) m;
      case null {
        let m = Map.empty<Common.UserId, Types.ReactionType>();
        reactions.add(postId, m);
        m;
      };
    };
    postReactions.add(caller, reaction);
  };

  /// Remove caller's reaction from a post.
  public func removeReaction(
    reactions : Map.Map<Common.PostId, Map.Map<Common.UserId, Types.ReactionType>>,
    postId    : Common.PostId,
    caller    : Common.UserId,
  ) {
    switch (reactions.get(postId)) {
      case null {};
      case (?postReactions) { postReactions.remove(caller) };
    };
  };

  /// Return aggregated reaction counts for a post.
  public func getReactions(
    reactions : Map.Map<Common.PostId, Map.Map<Common.UserId, Types.ReactionType>>,
    postId    : Common.PostId,
  ) : [(Types.ReactionType, Nat)] {
    switch (reactions.get(postId)) {
      case null { [] };
      case (?postReactions) {
        var likeCount  : Nat = 0;
        var loveCount  : Nat = 0;
        var hahaCount  : Nat = 0;
        var wowCount   : Nat = 0;
        var sadCount   : Nat = 0;
        var angryCount : Nat = 0;
        for ((_uid, r) in postReactions.entries()) {
          switch (r) {
            case (#like)  { likeCount  += 1 };
            case (#love)  { loveCount  += 1 };
            case (#haha)  { hahaCount  += 1 };
            case (#wow)   { wowCount   += 1 };
            case (#sad)   { sadCount   += 1 };
            case (#angry) { angryCount += 1 };
          };
        };
        let result = List.empty<(Types.ReactionType, Nat)>();
        if (likeCount  > 0) result.add((#like,  likeCount));
        if (loveCount  > 0) result.add((#love,  loveCount));
        if (hahaCount  > 0) result.add((#haha,  hahaCount));
        if (wowCount   > 0) result.add((#wow,   wowCount));
        if (sadCount   > 0) result.add((#sad,   sadCount));
        if (angryCount > 0) result.add((#angry, angryCount));
        result.toArray();
      };
    };
  };

  /// Return the caller's reaction on a post, if any.
  public func getMyReaction(
    reactions : Map.Map<Common.PostId, Map.Map<Common.UserId, Types.ReactionType>>,
    postId    : Common.PostId,
    caller    : Common.UserId,
  ) : ?Types.ReactionType {
    switch (reactions.get(postId)) {
      case null              { null };
      case (?postReactions)  { postReactions.get(caller) };
    };
  };

  // ── Comments ───────────────────────────────────────────────────────────────

  /// Add a top-level comment or a reply (parentId = ?commentId).
  public func addComment(
    comments      : List.List<Types.Comment>,
    nextCommentId : { var value : Nat },
    postId        : Common.PostId,
    text          : Text,
    parentId      : ?Types.CommentId,
    caller        : Common.UserId,
    callerName    : Text,
    now           : Common.Timestamp,
  ) : Types.CommentId {
    let id = nextCommentId.value;
    nextCommentId.value += 1;
    let comment : Types.Comment = {
      id;
      postId;
      authorId   = caller;
      authorName = callerName;
      var content   = text;
      parentId;
      createdAt  = now;
      var updatedAt = now;
      var isDeleted = false;
    };
    comments.add(comment);
    id;
  };

  /// Edit text of an existing comment owned by caller.
  public func editComment(
    comments   : List.List<Types.Comment>,
    commentId  : Types.CommentId,
    text       : Text,
    caller     : Common.UserId,
    now        : Common.Timestamp,
  ) {
    comments.mapInPlace(func(c : Types.Comment) : Types.Comment {
      if (c.id == commentId and c.authorId == caller and not c.isDeleted) {
        c.content   := text;
        c.updatedAt := now;
      };
      c;
    });
  };

  /// Soft-delete a comment owned by caller or by post owner.
  public func deleteComment(
    comments  : List.List<Types.Comment>,
    commentId : Types.CommentId,
    caller    : Common.UserId,
  ) {
    comments.mapInPlace(func(c : Types.Comment) : Types.Comment {
      if (c.id == commentId and c.authorId == caller) {
        c.isDeleted := true;
      };
      c;
    });
  };

  /// Return all visible comments for a post (including replies).
  /// Uses the postCommentsIndex to avoid O(n) full scan of all comments.
  public func getCommentsByIndex(
    comments          : List.List<Types.Comment>,
    postCommentsIndex : Map.Map<Common.PostId, List.List<Types.CommentId>>,
    postId            : Common.PostId,
  ) : [Types.CommentView] {
    switch (postCommentsIndex.get(postId)) {
      case null { return [] };
      case (?commentIds) {
        if (commentIds.isEmpty()) return [];
        // Build a Map<CommentId, Comment> from the full comments list once (O(n log n))
        let allCommentMap = Map.empty<Types.CommentId, Types.Comment>();
        for (c in comments.values()) {
          allCommentMap.add(c.id, c);
        };
        // Collect only comments for this post (O(k log n))
        let postCommentMap = Map.empty<Types.CommentId, Types.Comment>();
        for (cid in commentIds.values()) {
          switch (allCommentMap.get(cid)) {
            case (?c) { if (not c.isDeleted) postCommentMap.add(cid, c) };
            case null {};
          };
        };
        if (postCommentMap.isEmpty()) return [];
        // Build views — reply count is O(k) within the post's own comment map
        let result = List.empty<Types.CommentView>();
        for ((_cid, c) in postCommentMap.entries()) {
          var replyCount : Nat = 0;
          for ((_rid, r) in postCommentMap.entries()) {
            switch (r.parentId) {
              case (?pid) { if (pid == c.id) replyCount += 1 };
              case null {};
            };
          };
          result.add({
            id         = c.id;
            postId     = c.postId;
            authorId   = c.authorId;
            authorName = c.authorName;
            content    = c.content;
            parentId   = c.parentId;
            createdAt  = c.createdAt;
            updatedAt  = c.updatedAt;
            replyCount;
          });
        };
        result.toArray();
      };
    };
  };

  /// Return all visible comments for a post (including replies). Legacy full-scan version.
  public func getComments(
    comments : List.List<Types.Comment>,
    postId   : Common.PostId,
  ) : [Types.CommentView] {
    let postComments = comments.filter(func(c : Types.Comment) : Bool {
      c.postId == postId and not c.isDeleted
    });
    postComments.map<Types.Comment, Types.CommentView>(func(c : Types.Comment) : Types.CommentView {
      let replyCount = comments.filter(func(r : Types.Comment) : Bool {
        switch (r.parentId) {
          case (?pid) { pid == c.id and not r.isDeleted };
          case null   { false };
        };
      }).size();
      {
        id         = c.id;
        postId     = c.postId;
        authorId   = c.authorId;
        authorName = c.authorName;
        content    = c.content;
        parentId   = c.parentId;
        createdAt  = c.createdAt;
        updatedAt  = c.updatedAt;
        replyCount;
      };
    }).toArray();
  };

  // ── Shares ─────────────────────────────────────────────────────────────────

  /// Record a share/repost by caller (idempotent — replace if exists).
  public func sharePost(
    shares : List.List<Types.Share>,
    postId : Common.PostId,
    caller : Common.UserId,
    now    : Common.Timestamp,
  ) {
    let filtered = shares.filter(func(s : Types.Share) : Bool {
      not (s.userId == caller and s.postId == postId)
    });
    shares.clear();
    shares.append(filtered);
    shares.add({ userId = caller; postId; sharedAt = now });
  };

  /// Remove a share by caller.
  public func unsharePost(
    shares : List.List<Types.Share>,
    postId : Common.PostId,
    caller : Common.UserId,
  ) {
    let filtered = shares.filter(func(s : Types.Share) : Bool {
      not (s.userId == caller and s.postId == postId)
    });
    shares.clear();
    shares.append(filtered);
  };

  /// Return the total share count for a post.
  public func getShares(
    shares : List.List<Types.Share>,
    postId : Common.PostId,
  ) : Nat {
    shares.filter(func(s : Types.Share) : Bool { s.postId == postId }).size();
  };

  // ── Notifications ──────────────────────────────────────────────────────────

  /// Append a new notification for a recipient.
  public func pushNotification(
    notifications : List.List<Types.Notification>,
    nextNotifId   : { var value : Nat },
    recipientId   : Common.UserId,
    actorId       : Common.UserId,
    actorName     : Text,
    notifType     : Types.NotificationType,
    now           : Common.Timestamp,
  ) {
    if (recipientId == actorId) return;
    let id = nextNotifId.value;
    nextNotifId.value += 1;
    let notif : Types.Notification = {
      id;
      recipientId;
      actorId;
      actorName;
      notifType;
      createdAt  = now;
      var isRead = false;
    };
    notifications.add(notif);
  };

  /// Return all notifications for the caller, newest first.
  public func getNotifications(
    notifications : List.List<Types.Notification>,
    caller        : Common.UserId,
  ) : [Types.NotificationView] {
    let mine = notifications.filter(func(n : Types.Notification) : Bool {
      n.recipientId == caller
    });
    let sorted = mine.sort(func(a : Types.Notification, b : Types.Notification) : { #less; #equal; #greater } {
      if (b.createdAt > a.createdAt) #less
      else if (b.createdAt < a.createdAt) #greater
      else #equal
    });
    sorted.map<Types.Notification, Types.NotificationView>(func(n : Types.Notification) : Types.NotificationView {
      {
        id        = n.id;
        actorId   = n.actorId;
        actorName = n.actorName;
        notifType = n.notifType;
        createdAt = n.createdAt;
        isRead    = n.isRead;
      };
    }).toArray();
  };

  /// Mark all of caller's notifications as read.
  public func markNotificationsRead(
    notifications : List.List<Types.Notification>,
    caller        : Common.UserId,
  ) {
    notifications.mapInPlace(func(n : Types.Notification) : Types.Notification {
      if (n.recipientId == caller) {
        n.isRead := true;
      };
      n;
    });
  };

  /// Return the count of unread notifications for the caller.
  public func getUnreadCount(
    notifications : List.List<Types.Notification>,
    caller        : Common.UserId,
  ) : Nat {
    notifications.filter(func(n : Types.Notification) : Bool {
      n.recipientId == caller and not n.isRead
    }).size();
  };

  // ── Saved posts ────────────────────────────────────────────────────────────

  /// Bookmark a post for caller.
  public func savePost(
    savedPosts : Map.Map<Common.UserId, Set.Set<Common.PostId>>,
    caller     : Common.UserId,
    postId     : Common.PostId,
  ) {
    let bookmarks = switch (savedPosts.get(caller)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.PostId>();
        savedPosts.add(caller, s);
        s;
      };
    };
    bookmarks.add(postId);
  };

  /// Remove a bookmark.
  public func unsavePost(
    savedPosts : Map.Map<Common.UserId, Set.Set<Common.PostId>>,
    caller     : Common.UserId,
    postId     : Common.PostId,
  ) {
    switch (savedPosts.get(caller)) {
      case null {};
      case (?bookmarks) { bookmarks.remove(postId) };
    };
  };

  /// Return all post IDs saved by caller.
  public func getSavedPostIds(
    savedPosts : Map.Map<Common.UserId, Set.Set<Common.PostId>>,
    caller     : Common.UserId,
  ) : [Common.PostId] {
    switch (savedPosts.get(caller)) {
      case null           { [] };
      case (?bookmarks)   { bookmarks.toArray() };
    };
  };

  // ── Reports ────────────────────────────────────────────────────────────────

  /// File a report for a post or user.
  public func addReport(
    reports      : List.List<Types.Report>,
    nextReportId : { var value : Nat },
    reporter     : Common.UserId,
    target       : Types.ReportTarget,
    reason       : Text,
    now          : Common.Timestamp,
  ) {
    let id = nextReportId.value;
    nextReportId.value += 1;
    reports.add({
      id;
      reporterId = reporter;
      target;
      reason;
      createdAt  = now;
      var status : Types.ReportStatus = #pending;
    });
  };

  // ── Verification ───────────────────────────────────────────────────────────

  /// Return true if the user holds a verified badge.
  public func isVerified(
    verified : Set.Set<Common.UserId>,
    userId   : Common.UserId,
  ) : Bool {
    verified.contains(userId);
  };

  // ── Post stats ─────────────────────────────────────────────────────────────

  /// Return aggregated engagement stats for a post using the comment index.
  public func getPostStatsIndexed(
    likes             : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    postCommentsIndex : Map.Map<Common.PostId, List.List<Types.CommentId>>,
    shares            : List.List<Types.Share>,
    postId            : Common.PostId,
  ) : Types.PostStats {
    let likeCount = switch (likes.get(postId)) {
      case null       { 0 };
      case (?likeSet) { likeSet.size() };
    };
    // Use index for O(1) comment count
    let commentCount = switch (postCommentsIndex.get(postId)) {
      case null        { 0 };
      case (?lst)      { lst.size() };
    };
    let shareCount = shares.filter(func(s : Types.Share) : Bool {
      s.postId == postId
    }).size();
    { likes = likeCount; comments = commentCount; shares = shareCount };
  };

  /// Return aggregated engagement stats for a post.
  public func getPostStats(
    likes     : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
    comments  : List.List<Types.Comment>,
    shares    : List.List<Types.Share>,
    postId    : Common.PostId,
  ) : Types.PostStats {
    let likeCount = switch (likes.get(postId)) {
      case null      { 0 };
      case (?likeSet){ likeSet.size() };
    };
    let commentCount = comments.filter(func(c : Types.Comment) : Bool {
      c.postId == postId and not c.isDeleted
    }).size();
    let shareCount = shares.filter(func(s : Types.Share) : Bool {
      s.postId == postId
    }).size();
    { likes = likeCount; comments = commentCount; shares = shareCount };
  };
};
