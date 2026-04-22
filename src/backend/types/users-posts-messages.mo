import Common "common";

module {
  // ─── Visibility ───────────────────────────────────────────────────────────
  public type Visibility = {
    #everyone;
    #followersOnly;
    #friendsOnly;
    #customList;
  };

  // ─── User ─────────────────────────────────────────────────────────────────
  public type User = {
    id       : Common.UserId;
    var username : Text;
    var bio      : Text;
    var visibility : Visibility; // controls post visibility default
    var profilePhotoUrl : ?Text;
    var coverPhotoUrl   : ?Text;
    // Official page images — completely independent from personal profile images
    var officialPageProfilePhotoUrl : ?Text;
    var officialPageCoverPhotoUrl   : ?Text;
    var isVerified      : Bool;
    var isSuspended     : Bool;
    var suspendedUntil  : ?Common.Timestamp;
    var isBanned        : Bool;
    // Password-based registration (optional; Internet Identity users have null)
    var passwordHash    : ?Text;
    // Optional email (for future verification features)
    var email           : ?Text;
    // About section
    var aboutBio        : ?Text;
    var aboutLocation   : ?Text;
    var aboutWork       : ?Text;
    var aboutEducation  : ?Text;
    var aboutWebsite    : ?Text;
    var birthdate       : ?Text;
  };

  // Shared (immutable, API-boundary) projection of User
  public type UserProfile = {
    id             : Common.UserId;
    username       : Text;
    bio            : Text;
    visibility     : Visibility;
    postCount      : Nat;
    followerCount  : Nat;
    followingCount : Nat;
    profilePhotoUrl : ?Text;
    coverPhotoUrl   : ?Text;
    isVerified      : Bool;
    isOfficialPage  : Bool;
    aboutBio        : ?Text;
    aboutLocation   : ?Text;
    aboutWork       : ?Text;
    aboutEducation  : ?Text;
    aboutWebsite    : ?Text;
    birthdate       : ?Text;
  };

  // ─── Post ─────────────────────────────────────────────────────────────────
  public type Post = {
    id         : Common.PostId;
    authorId   : Common.UserId;
    authorName : Text;
    var content    : Text;
    visibility : Visibility;
    var customAllowList : [Common.UserId]; // used when visibility = #customList
    createdAt  : Common.Timestamp;
    var updatedAt  : Common.Timestamp;
    var isPinned   : Bool;
    var imageUrl   : ?Text;
  };

  // Shared projection of Post (poll summary injected at API layer)
  public type PostView = {
    id         : Common.PostId;
    authorId   : Common.UserId;
    authorName : Text;
    content    : Text;
    visibility : Visibility;
    createdAt  : Common.Timestamp;
    updatedAt  : Common.Timestamp;
    isPinned   : Bool;
    imageUrl   : ?Text;
    authorVerified : Bool;
    authorProfilePhoto : ?Text;
  };

  // ─── Message ──────────────────────────────────────────────────────────────
  public type Message = {
    id             : Common.MessageId;
    conversationId : Common.ConversationId;
    senderId       : Common.UserId;
    encryptedContent : Blob; // encrypted at rest
    createdAt      : Common.Timestamp;
    var readBy     : [Common.UserId];
  };

  // Shared projection of Message
  public type MessageView = {
    id               : Common.MessageId;
    conversationId   : Common.ConversationId;
    senderId         : Common.UserId;
    encryptedContent : Blob;
    createdAt        : Common.Timestamp;
    isRead           : Bool;
    readAt           : ?Common.Timestamp;
  };

  // Result type for loginWithPasswordOnly — includes userId so frontend can track session
  public type LoginWithPasswordResult = {
    #ok  : { profile : UserProfile; userId : Common.UserId };
    #err : Text;
  };

  // Conversation summary for list view
  public type ConversationSummary = {
    conversationId    : Common.ConversationId;
    otherUserId       : Common.UserId;
    otherUsername     : Text;
    lastMessagePreview : Text; // plain label, e.g. "Encrypted message"
    lastMessageAt     : Common.Timestamp;
  };
};
