import Common "../types/common";
import Types "../types/users-posts-messages";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";

module {
  // ─── Password hashing ─────────────────────────────────────────────────────

  /// Deterministic password hash using a multi-round XOR+rotate-left mixing.
  /// Produces a 32-char hex string. Same input always → same output.
  /// Stored hash is NEVER the plain text password.
  public func hashPassword(password : Text) : Text {
    let chars = password.toArray();
    let n = chars.size();
    var h0 : Nat32 = 0x6b43a9b5;
    var h1 : Nat32 = 0x52f3d17c;
    var h2 : Nat32 = 0x9e1c4a3d;
    var h3 : Nat32 = 0xd78b2f61;
    var round : Nat = 0;
    while (round < 4) {
      var i : Nat = 0;
      while (i < n) {
        let cv : Nat32 = chars[i].toNat32();
        let idx = i % 4;
        if (idx == 0) {
          h0 := (h0 ^ cv) <<> 7;
          h0 := h0 +% h1;
        } else if (idx == 1) {
          h1 := (h1 ^ cv) <<> 13;
          h1 := h1 +% h2;
        } else if (idx == 2) {
          h2 := (h2 ^ cv) <<> 17;
          h2 := h2 +% h3;
        } else {
          h3 := (h3 ^ cv) <<> 19;
          h3 := h3 +% h0;
        };
        i += 1;
      };
      h0 := h0 ^ (h1 <<> 11);
      h1 := h1 ^ (h2 <<> 23);
      h2 := h2 ^ (h3 <<> 5);
      h3 := h3 ^ (h0 <<> 29);
      round += 1;
    };
    nat32ToHex(h0) # nat32ToHex(h1) # nat32ToHex(h2) # nat32ToHex(h3);
  };

  private func nat32ToHex(v : Nat32) : Text {
    let digits = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    var result = "";
    var remaining = v;
    var i : Nat = 0;
    while (i < 8) {
      let nibble = (remaining >> 28).toNat();
      result := result # Text.fromChar(digits[nibble]);
      remaining := remaining << 4;
      i += 1;
    };
    result;
  };

  // ─── Owner name protection ────────────────────────────────────────────────

  /// Normalise a username for comparison: lowercase, remove spaces/hyphens/underscores/dots.
  public func normalizeUsername(name : Text) : Text {
    let lower = name.toLower();
    var result = "";
    for (c in lower.toIter()) {
      if (c != ' ' and c != '-' and c != '_' and c != '.') {
        result := result # Text.fromChar(c);
      };
    };
    result;
  };

  /// Returns true if the requested username matches any reserved owner name variant.
  /// Protected names (case-insensitive, spaces/punctuation stripped):
  ///   "Princess Narzine Bani Hashem", "Narzine Bani Hashem", "Princess Narzine",
  ///   "Zaren Veto" (the app itself)
  public func isReservedName(username : Text) : Bool {
    let norm = normalizeUsername(username);
    // Exact match against protected canonical forms
    let protected = [
      "princessnarzinebanihashem",
      "princessnarzine",
      "narzinebanihashem",
      "narzinebani",
      "zarenveto",
    ];
    for (p in protected.values()) {
      if (norm == p) return true;
    };
    // Block any name containing the owner's core identifier
    if (norm.contains(#text "narzinebani")) return true;
    if (norm.contains(#text "princessnarzine")) return true;
    false;
  };

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
      var officialPageProfilePhotoUrl = null;
      var officialPageCoverPhotoUrl   = null;
      var isVerified      = (username == "Princess Narzine Bani Hashem");
      var isSuspended     = false;
      var suspendedUntil  = null;
      var isBanned        = false;
      var passwordHash    = null;
      var email           = null;
      var aboutBio        = null;
      var aboutLocation   = null;
      var aboutWork       = null;
      var aboutEducation  = null;
      var aboutWebsite    = null;
      var birthdate       = null;
    };
  };

  /// Create a new User record with a hashed password (password-based flow).
  /// The plain-text password is NEVER stored — only its hash.
  public func newUserWithPassword(
    id       : Common.UserId,
    username : Text,
    password : Text,
    bio      : Text,
    email    : ?Text,
  ) : Types.User {
    {
      id;
      var username;
      var bio;
      var visibility      = #everyone;
      var profilePhotoUrl = null;
      var coverPhotoUrl   = null;
      var officialPageProfilePhotoUrl = null;
      var officialPageCoverPhotoUrl   = null;
      var isVerified      = (username == "Princess Narzine Bani Hashem");
      var isSuspended     = false;
      var suspendedUntil  = null;
      var isBanned        = false;
      var passwordHash    = ?(hashPassword(password));
      var email;
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
      bio            = if (user.username == "Princess Narzine Bani Hashem") "" else user.bio;
      visibility     = user.visibility;
      postCount;
      followerCount;
      followingCount = following.size();
      profilePhotoUrl = user.profilePhotoUrl;
      coverPhotoUrl   = user.coverPhotoUrl;
      isVerified      = user.isVerified;
      isOfficialPage  = false;
      aboutBio        = if (user.username == "Princess Narzine Bani Hashem") null else user.aboutBio;
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
