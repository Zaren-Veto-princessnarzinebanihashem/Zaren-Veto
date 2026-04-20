import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import EngTypes "../types/engagement";
import UPMTypes "../types/users-posts-messages";
import UPMLib "../lib/users-posts-messages";
import Lib "../lib/engagement";

/// Public API mixin for the engagement domain.
/// Receives all required state slices as mixin parameters.
mixin (
  // ── Shared state from users-posts-messages domain ──────────────────────────
  users    : Map.Map<Common.UserId, UPMTypes.User>,
  posts    : List.List<UPMTypes.Post>,

  // ── Engagement state ───────────────────────────────────────────────────────
  likes        : Map.Map<Common.PostId, Set.Set<Common.UserId>>,
  reactions    : Map.Map<Common.PostId, Map.Map<Common.UserId, EngTypes.ReactionType>>,
  comments     : List.List<EngTypes.Comment>,
  shares       : List.List<EngTypes.Share>,
  notifications : List.List<EngTypes.Notification>,
  savedPosts   : Map.Map<Common.UserId, Set.Set<Common.PostId>>,
  reports      : List.List<EngTypes.Report>,
  verified     : Set.Set<Common.UserId>,

  // ── Counters ──────────────────────────────────────────────────────────────
  nextCommentId : { var value : Nat },
  nextNotifId   : { var value : Nat },
  nextReportId  : { var value : Nat },
) {

  // ── Internal helpers ──────────────────────────────────────────────────────

  private func requireUser(caller : Common.UserId) : UPMTypes.User {
    switch (users.get(caller)) {
      case (?u) u;
      case null Runtime.trap("Not registered");
    };
  };

  private func postAuthor(postId : Common.PostId) : ?Common.UserId {
    switch (posts.find(func(p : UPMTypes.Post) : Bool { p.id == postId })) {
      case (?p) ?p.authorId;
      case null null;
    };
  };

  private func toPostView(post : UPMTypes.Post) : UPMTypes.PostView {
    let (authorVerified, authorProfilePhoto) = switch (users.get(post.authorId)) {
      case (?u) (u.isVerified, u.profilePhotoUrl);
      case null (false, null);
    };
    UPMLib.toPostView(post, authorVerified, authorProfilePhoto);
  };

  // ── Likes ─────────────────────────────────────────────────────────────────

  public shared ({ caller }) func likePost(postId : Common.PostId) : async () {
    let user = requireUser(caller);
    Lib.likePost(likes, postId, caller);
    switch (postAuthor(postId)) {
      case (?authorId) {
        Lib.pushNotification(notifications, nextNotifId, authorId, caller,
          user.username, #like { postId }, Time.now());
      };
      case null {};
    };
  };

  public shared ({ caller }) func unlikePost(postId : Common.PostId) : async () {
    Lib.unlikePost(likes, postId, caller);
  };

  public query func getLikes(postId : Common.PostId) : async [Common.UserId] {
    Lib.getLikes(likes, postId);
  };

  public shared ({ caller }) func hasLiked(postId : Common.PostId) : async Bool {
    Lib.hasLiked(likes, postId, caller);
  };

  // ── Reactions ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func reactToPost(
    postId   : Common.PostId,
    reaction : EngTypes.ReactionType,
  ) : async () {
    let user = requireUser(caller);
    Lib.reactToPost(reactions, postId, caller, reaction);
    switch (postAuthor(postId)) {
      case (?authorId) {
        Lib.pushNotification(notifications, nextNotifId, authorId, caller,
          user.username, #reaction { postId; reaction }, Time.now());
      };
      case null {};
    };
  };

  public shared ({ caller }) func removeReaction(postId : Common.PostId) : async () {
    Lib.removeReaction(reactions, postId, caller);
  };

  public query func getReactions(postId : Common.PostId) : async [(EngTypes.ReactionType, Nat)] {
    Lib.getReactions(reactions, postId);
  };

  public shared ({ caller }) func getMyReaction(postId : Common.PostId) : async ?EngTypes.ReactionType {
    Lib.getMyReaction(reactions, postId, caller);
  };

  // ── Comments ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func addComment(
    postId : Common.PostId,
    text   : Text,
  ) : async EngTypes.CommentId {
    let user = requireUser(caller);
    let now  = Time.now();
    let id   = Lib.addComment(comments, nextCommentId, postId, text, null,
                              caller, user.username, now);
    switch (postAuthor(postId)) {
      case (?authorId) {
        Lib.pushNotification(notifications, nextNotifId, authorId, caller,
          user.username, #comment { postId; commentId = id }, now);
      };
      case null {};
    };
    id;
  };

  public shared ({ caller }) func replyToComment(
    parentCommentId : EngTypes.CommentId,
    text            : Text,
  ) : async EngTypes.CommentId {
    let user = requireUser(caller);
    let now  = Time.now();
    let parentPostId : Common.PostId = switch (comments.find(
      func(c : EngTypes.Comment) : Bool { c.id == parentCommentId }
    )) {
      case (?c) c.postId;
      case null Runtime.trap("Parent comment not found");
    };
    let id = Lib.addComment(comments, nextCommentId, parentPostId, text,
                            ?parentCommentId, caller, user.username, now);
    switch (postAuthor(parentPostId)) {
      case (?authorId) {
        Lib.pushNotification(notifications, nextNotifId, authorId, caller,
          user.username, #comment { postId = parentPostId; commentId = id }, now);
      };
      case null {};
    };
    id;
  };

  public shared ({ caller }) func editComment(
    commentId : EngTypes.CommentId,
    text      : Text,
  ) : async () {
    Lib.editComment(comments, commentId, text, caller, Time.now());
  };

  public shared ({ caller }) func deleteComment(commentId : EngTypes.CommentId) : async () {
    Lib.deleteComment(comments, commentId, caller);
  };

  public query func getComments(postId : Common.PostId) : async [EngTypes.CommentView] {
    Lib.getComments(comments, postId);
  };

  // ── Shares ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func sharePost(postId : Common.PostId) : async () {
    let user = requireUser(caller);
    let now  = Time.now();
    Lib.sharePost(shares, postId, caller, now);
    switch (postAuthor(postId)) {
      case (?authorId) {
        Lib.pushNotification(notifications, nextNotifId, authorId, caller,
          user.username, #share { postId }, now);
      };
      case null {};
    };
  };

  public shared ({ caller }) func unsharePost(postId : Common.PostId) : async () {
    Lib.unsharePost(shares, postId, caller);
  };

  public query func getShares(postId : Common.PostId) : async Nat {
    Lib.getShares(shares, postId);
  };

  // ── Notifications ─────────────────────────────────────────────────────────

  public shared ({ caller }) func getNotifications() : async [EngTypes.NotificationView] {
    Lib.getNotifications(notifications, caller);
  };

  public shared ({ caller }) func markNotificationsRead() : async () {
    Lib.markNotificationsRead(notifications, caller);
  };

  public shared ({ caller }) func getUnreadCount() : async Nat {
    Lib.getUnreadCount(notifications, caller);
  };

  // ── Saved posts ───────────────────────────────────────────────────────────

  public shared ({ caller }) func savePost(postId : Common.PostId) : async () {
    Lib.savePost(savedPosts, caller, postId);
  };

  public shared ({ caller }) func unsavePost(postId : Common.PostId) : async () {
    Lib.unsavePost(savedPosts, caller, postId);
  };

  public shared ({ caller }) func getSavedPosts() : async [UPMTypes.PostView] {
    let postIds = Lib.getSavedPostIds(savedPosts, caller);
    let result  = List.empty<UPMTypes.PostView>();
    for (postId in postIds.values()) {
      switch (posts.find(func(p : UPMTypes.Post) : Bool { p.id == postId })) {
        case (?p) { result.add(toPostView(p)) };
        case null {};
      };
    };
    result.toArray();
  };

  // ── Reports ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func reportPost(postId : Common.PostId, reason : Text) : async () {
    Lib.addReport(reports, nextReportId, caller, #post postId, reason, Time.now());
  };

  public shared ({ caller }) func reportUser(userId : Common.UserId, reason : Text) : async () {
    Lib.addReport(reports, nextReportId, caller, #user userId, reason, Time.now());
  };

  // ── Verification ──────────────────────────────────────────────────────────

  public query func isVerified(userId : Common.UserId) : async Bool {
    Lib.isVerified(verified, userId);
  };

  // ── Profile media ─────────────────────────────────────────────────────────

  public shared ({ caller }) func updateProfilePhoto(imageUrl : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot update profile");
    switch (users.get(caller)) {
      case null { #err("Not registered") };
      case (?user) {
        user.profilePhotoUrl := ?imageUrl;
        #ok;
      };
    };
  };

  public shared ({ caller }) func updateCoverPhoto(imageUrl : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot update profile");
    switch (users.get(caller)) {
      case null { #err("Not registered") };
      case (?user) {
        user.coverPhotoUrl := ?imageUrl;
        #ok;
      };
    };
  };

  /// Update the official Zaren Veto page profile photo (owner only).
  /// This is completely independent from the personal profile photo.
  public shared ({ caller }) func updateOfficialPageProfilePhoto(imageUrl : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot update the official page");
    switch (users.get(caller)) {
      case null { #err("Not registered") };
      case (?user) {
        if (user.username != "Princess Narzine Bani Hashem") {
          return #err("Only the page owner can update the official page photo");
        };
        user.officialPageProfilePhotoUrl := ?imageUrl;
        #ok;
      };
    };
  };

  /// Update the official Zaren Veto page cover photo (owner only).
  /// This is completely independent from the personal cover photo.
  public shared ({ caller }) func updateOfficialPageCoverPhoto(imageUrl : Text) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot update the official page");
    switch (users.get(caller)) {
      case null { #err("Not registered") };
      case (?user) {
        if (user.username != "Princess Narzine Bani Hashem") {
          return #err("Only the page owner can update the official page cover");
        };
        user.officialPageCoverPhotoUrl := ?imageUrl;
        #ok;
      };
    };
  };

  // ── Post stats ────────────────────────────────────────────────────────────

  public query func getPostStats(postId : Common.PostId) : async EngTypes.PostStats {
    Lib.getPostStats(likes, comments, shares, postId);
  };
};
