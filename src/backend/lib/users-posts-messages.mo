import Common "../types/common";
import Types "../types/users-posts-messages";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  // ─── User helpers ──────────────────────────────────────────────────────────

  /// Validate a password against Facebook-style rules:
  /// min 8 chars, at least one uppercase, one lowercase, one digit.
  public func validatePassword(password : Text) : Bool {
    if (password.size() < 8) return false;
    var hasUpper = false;
    var hasLower = false;
    var hasDigit = false;
    for (c in password.toIter()) {
      if (c >= 'A' and c <= 'Z') { hasUpper := true };
      if (c >= 'a' and c <= 'z') { hasLower := true };
      if (c >= '0' and c <= '9') { hasDigit := true };
    };
    hasUpper and hasLower and hasDigit;
  };

  /// Create a new User record (Internet Identity flow — no password).
  public func newUser(id : Common.UserId, username : Text, bio : Text) : Types.User {
    {
      id;
      var username;
      var bio;
      var visibility      = #everyone;
      var profilePhotoUrl = null;
      var coverPhotoUrl   = null;
      var isVerified      = (username == "Princess Narzine Bani Hashem");
      var isSuspended     = false;
      var suspendedUntil  = null;
      var isBanned        = false;
      var passwordHash    = null;
      var aboutBio        = null;
      var aboutLocation   = null;
      var aboutWork       = null;
      var aboutEducation  = null;
      var aboutWebsite    = null;
      var birthdate       = null;
    };
  };

  /// Create a new User record with a password hash (password-based flow).
  public func newUserWithPassword(id : Common.UserId, username : Text, password : Text, bio : Text) : Types.User {
    {
      id;
      var username;
      var bio;
      var visibility      = #everyone;
      var profilePhotoUrl = null;
      var coverPhotoUrl   = null;
      var isVerified      = (username == "Princess Narzine Bani Hashem");
      var isSuspended     = false;
      var suspendedUntil  = null;
      var isBanned        = false;
      var passwordHash    = ?("PWD:" # password);
      var aboutBio        = null;
      var aboutLocation   = null;
      var aboutWork       = null;
      var aboutEducation  = null;
      var aboutWebsite    = null;
      var birthdate       = null;
    };
  };

  /// Project a User to a public UserProfile (includes counts from supplementary state).
  public func toProfile(
    user      : Types.User,
    posts     : List.List<Types.Post>,
    followers : Set.Set<Common.UserId>,
    following : Set.Set<Common.UserId>,
  ) : Types.UserProfile {
    let postCount = posts.filter(func(p : Types.Post) : Bool { p.authorId == user.id }).size();
    // Owner account always shows 19k followers
    let followerCount = if (user.username == "Princess Narzine Bani Hashem") 19000 else followers.size();
    {
      id             = user.id;
      username       = user.username;
      bio            = user.bio;
      visibility     = user.visibility;
      postCount;
      followerCount;
      followingCount = following.size();
      profilePhotoUrl = user.profilePhotoUrl;
      coverPhotoUrl   = user.coverPhotoUrl;
      isVerified      = user.isVerified;
      isOfficialPage  = false;
      aboutBio        = user.aboutBio;
      aboutLocation   = user.aboutLocation;
      aboutWork       = user.aboutWork;
      aboutEducation  = user.aboutEducation;
      aboutWebsite    = user.aboutWebsite;
      birthdate       = user.birthdate;
    };
  };

  // ─── Post helpers ──────────────────────────────────────────────────────────

  /// Create a new Post record.
  public func newPost(
    id              : Common.PostId,
    author          : Types.User,
    content         : Text,
    visibility      : Types.Visibility,
    customAllowList : [Common.UserId],
    imageUrl        : ?Text,
    now             : Common.Timestamp,
  ) : Types.Post {
    {
      id;
      authorId   = author.id;
      authorName = author.username;
      var content;
      visibility;
      var customAllowList;
      createdAt  = now;
      var updatedAt = now;
      var isPinned  = false;
      var imageUrl;
    };
  };

  /// Project a Post to a shared PostView.
  public func toPostView(post : Types.Post, authorVerified : Bool, authorProfilePhoto : ?Text) : Types.PostView {
    {
      id         = post.id;
      authorId   = post.authorId;
      authorName = post.authorName;
      content    = post.content;
      visibility = post.visibility;
      createdAt  = post.createdAt;
      updatedAt  = post.updatedAt;
      isPinned   = post.isPinned;
      imageUrl   = post.imageUrl;
      authorVerified;
      authorProfilePhoto;
    };
  };

  /// Check whether a caller can view a given post (respects visibility + follow graph).
  public func canViewPost(
    caller          : Common.UserId,
    post            : Types.Post,
    isFollowing     : Bool,
    isMutualFollow  : Bool, // true = friends
  ) : Bool {
    // Always visible to the author
    if (caller == post.authorId) return true;
    switch (post.visibility) {
      case (#everyone)      { true };
      case (#followersOnly) { isFollowing };
      case (#friendsOnly)   { isMutualFollow };
      case (#customList)    {
        switch (post.customAllowList.find(func(u : Common.UserId) : Bool { u == caller })) {
          case (?_) true;
          case null false;
        };
      };
    };
  };

  // ─── Message helpers ───────────────────────────────────────────────────────

  /// Build the canonical ConversationId for two users (sorted, deterministic).
  public func conversationId(a : Common.UserId, b : Common.UserId) : Common.ConversationId {
    let ta = a.toText();
    let tb = b.toText();
    if (Text.compare(ta, tb) == #less) {
      ta # ":" # tb;
    } else {
      tb # ":" # ta;
    };
  };

  /// Create a new Message record.
  public func newMessage(
    id               : Common.MessageId,
    convId           : Common.ConversationId,
    sender           : Common.UserId,
    encryptedContent : Blob,
    now              : Common.Timestamp,
  ) : Types.Message {
    {
      id;
      conversationId   = convId;
      senderId         = sender;
      encryptedContent;
      createdAt        = now;
      var readBy       = [];
    };
  };

  /// Project a Message to a shared MessageView.
  public func toMessageView(msg : Types.Message, caller : Common.UserId) : Types.MessageView {
    let isRead = msg.readBy.find(func(u : Common.UserId) : Bool { u == caller }) != null;
    {
      id               = msg.id;
      conversationId   = msg.conversationId;
      senderId         = msg.senderId;
      encryptedContent = msg.encryptedContent;
      createdAt        = msg.createdAt;
      isRead;
      readAt           = if (isRead) ?msg.createdAt else null; // best approximation
    };
  };

  /// Build a ConversationSummary from the last message and the other user.
  public func toConversationSummary(
    caller      : Common.UserId,
    lastMessage : Types.Message,
    otherUser   : Types.User,
  ) : Types.ConversationSummary {
    let otherId = if (lastMessage.senderId == caller) otherUser.id else lastMessage.senderId;
    {
      conversationId     = lastMessage.conversationId;
      otherUserId        = otherId;
      otherUsername      = otherUser.username;
      lastMessagePreview = "Encrypted message";
      lastMessageAt      = lastMessage.createdAt;
    };
  };
};
