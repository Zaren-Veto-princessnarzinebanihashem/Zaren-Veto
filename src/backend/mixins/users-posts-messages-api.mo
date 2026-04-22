import Common "../types/common";
import Types "../types/users-posts-messages";
import Lib "../lib/users-posts-messages";
import NewLib "../lib/stories-hashtags-friendrequests-polls-admin";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";

/// Mixin exposing all public endpoints for users, posts, and messaging.
/// State slices are injected at construction time from main.mo.
mixin (
  users         : Map.Map<Common.UserId, Types.User>,
  posts         : List.List<Types.Post>,
  messages      : List.List<Types.Message>,
  follows       : Map.Map<Common.UserId, Set.Set<Common.UserId>>,
  verified      : Set.Set<Common.UserId>,
  nextPostId    : { var value : Nat },
  nextMessageId : { var value : Nat },
  // hashtag state (injected for indexing on create/edit/delete)
  hashtagIndex    : Map.Map<Text, List.List<Common.PostId>>,
  hashtagPostTime : Map.Map<Text, List.List<Common.Timestamp>>,
  // official page posts
  officialPagePosts : List.List<Types.Post>,
) {

  // ─── Internal helpers ─────────────────────────────────────────────────────

  private func buildFollowerSet(userId : Common.UserId) : Set.Set<Common.UserId> {
    let followerSet = Set.empty<Common.UserId>();
    for ((uid, followingSet) in follows.entries()) {
      if (followingSet.contains(userId)) {
        followerSet.add(uid);
      };
    };
    followerSet;
  };

  private func isMutualFollow(a : Common.UserId, b : Common.UserId) : Bool {
    let aFollowsB = switch (follows.get(a)) { case (?s) s.contains(b); case null false };
    let bFollowsA = switch (follows.get(b)) { case (?s) s.contains(a); case null false };
    aFollowsB and bFollowsA;
  };

  private func authorInfo(authorId : Common.UserId) : (Bool, ?Text) {
    switch (users.get(authorId)) {
      case (?u) (u.isVerified, u.profilePhotoUrl);
      case null (false, null);
    };
  };

  private func toView(post : Types.Post) : Types.PostView {
    let (av, ap) = authorInfo(post.authorId);
    Lib.toPostView(post, av, ap);
  };

  // ─── Account ──────────────────────────────────────────────────────────────

  /// Register the calling principal with a username and bio.
  public shared ({ caller }) func register(username : Text, bio : Text) : async Bool {
    if (caller.isAnonymous()) return false;
    switch (users.get(caller)) {
      case (?_) { false }; // already registered
      case null {
        // Block reserved owner name variants
        if (Lib.isReservedName(username)) return false;
        let user = Lib.newUser(caller, username, bio);
        // Auto-verify the owner account
        if (username == "Princess Narzine Bani Hashem") {
          verified.add(caller);
          user.isVerified := true;
        };
        users.add(caller, user);
        true;
      };
    };
  };

  /// Register with a password (Facebook-style). Password must be ≥8 chars,
  /// contain at least one uppercase letter, one lowercase letter, and one digit.
  /// Returns: #ok(true) on success, #err(message) on validation failure or duplicate.
  /// email is optional — stored for future verification features.
  public shared ({ caller }) func registerWithPassword(username : Text, password : Text, bio : Text, email : ?Text) : async { #ok : Bool; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot register");
    switch (users.get(caller)) {
      case (?_) { #err("Already registered") };
      case null {
        // Block reserved owner name variants
        if (Lib.isReservedName(username)) {
          return #err("This username is reserved and cannot be used.");
        };
        if (not Lib.validatePassword(password)) {
          return #err("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit");
        };
        let user = Lib.newUserWithPassword(caller, username, password, bio, email);
        if (username == "Princess Narzine Bani Hashem") {
          verified.add(caller);
          user.isVerified := true;
        };
        users.add(caller, user);
        #ok(true);
      };
    };
  };

  /// Update profile fields for the calling principal.
  public shared ({ caller }) func updateProfile(username : Text, bio : Text, visibility : Types.Visibility) : async Bool {
    switch (users.get(caller)) {
      case null    { false };
      case (?user) {
        user.username   := username;
        user.bio        := bio;
        user.visibility := visibility;
        if (username == "Princess Narzine Bani Hashem") {
          verified.add(caller);
          user.isVerified := true;
        };
        true;
      };
    };
  };

  /// Secure login with username and password.
  /// Finds the user by username, hashes the submitted password, compares to stored hash.
  /// Returns the user profile on success, or an error on failure.
  /// NOTE: Because Internet Computer query calls cannot verify identity, this is an
  /// update call — the caller's principal is used only as a session hint; the real
  /// authentication is the password comparison.
  public shared func loginWithPassword(username : Text, password : Text) : async { #ok : Types.UserProfile; #err : Text } {
    // Find user by username
    var foundUser : ?Types.User = null;
    for ((_, user) in users.entries()) {
      if (user.username == username) {
        foundUser := ?user;
      };
    };
    switch (foundUser) {
      case null { #err("Invalid username or password") };
      case (?user) {
        switch (user.passwordHash) {
          case null {
            // User registered via Internet Identity — no password set
            #err("This account uses Internet Identity login and does not have a password");
          };
          case (?storedHash) {
            let submittedHash = Lib.hashPassword(password);
            if (submittedHash == storedHash) {
              // Build a minimal profile for the response
              let followerCount : Nat = if (user.username == "Princess Narzine Bani Hashem") 19000 else 0;
              #ok({
                id             = user.id;
                username       = user.username;
                bio            = user.bio;
                visibility     = user.visibility;
                postCount      = 0;
                followerCount;
                followingCount = 0;
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
              });
            } else {
              #err("Invalid username or password");
            };
          };
        };
      };
    };
  };

  /// Standalone password-only login — does NOT require Internet Identity.
  /// Accepts an anonymous principal call. Finds user by username, verifies password,
  /// and returns both the UserProfile and the UserId so the frontend can track the session.
  /// Since IC has no traditional sessions, the frontend stores the userId from this response.
  public shared func loginWithPasswordOnly(username : Text, password : Text) : async Types.LoginWithPasswordResult {
    // Guard: password must not be empty to avoid unexpected hashing edge cases
    if (password.size() == 0) return #err("Password cannot be empty");
    var foundUser : ?Types.User = null;
    for ((_, user) in users.entries()) {
      if (user.username == username) {
        foundUser := ?user;
      };
    };
    switch (foundUser) {
      case null { #err("Invalid username or password") };
      case (?user) {
        switch (user.passwordHash) {
          case null {
            #err("This account uses Internet Identity login and does not have a password");
          };
          case (?storedHash) {
            let submittedHash = Lib.hashPassword(password);
            if (submittedHash == storedHash) {
              let myFollowing = switch (follows.get(user.id)) { case (?s) s; case null Set.empty<Common.UserId>() };
              // For login response, use lightweight follower count (avoid full scan)
              let followerCount : Nat = if (user.username == "Princess Narzine Bani Hashem") 19000 else 0;
              let postCount : Nat = 0; // lightweight — no full post scan on login
              let profile : Types.UserProfile = {
                id             = user.id;
                username       = user.username;
                bio            = if (user.username == "Princess Narzine Bani Hashem")
                  "Personnalité Publique\nPage officielle de la Fondatrice de l'application Zaren Veto"
                  else user.bio;
                visibility     = user.visibility;
                postCount;
                followerCount;
                followingCount = myFollowing.size();
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
              #ok({ profile; userId = user.id });
            } else {
              #err("Invalid username or password");
            };
          };
        };
      };
    };
  };

  /// Return the calling user's email address (if set).
  public shared query ({ caller }) func getMyEmail() : async ?Text {
    switch (users.get(caller)) {
      case null null;
      case (?user) user.email;
    };
  };

  /// Update the calling user's email address.
  public shared ({ caller }) func updateEmail(email : Text) : async Bool {
    switch (users.get(caller)) {
      case null false;
      case (?user) {
        user.email := ?email;
        true;
      };
    };
  };

  /// Return the caller's own profile.
  public shared query ({ caller }) func getMyProfile() : async ?Types.UserProfile {
    switch (users.get(caller)) {
      case null      { null };
      case (?user)   {
        let myFollowing  = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
        let followerSet  = buildFollowerSet(caller);
        ?Lib.toProfile(user, posts, followerSet, myFollowing);
      };
    };
  };

  /// Return another user's public profile.
  public shared query ({ caller }) func getUserProfile(userId : Common.UserId) : async ?Types.UserProfile {
    switch (users.get(userId)) {
      case null      { null };
      case (?user)   {
        let theirFollowing = switch (follows.get(userId)) { case (?s) s; case null Set.empty<Common.UserId>() };
        let followerSet    = buildFollowerSet(userId);
        ?Lib.toProfile(user, posts, followerSet, theirFollowing);
      };
    };
  };

  /// Search users by partial username match (case-insensitive).
  /// Limited to 50 results to avoid IC0508 canister-stopped errors on large maps.
  public shared query ({ caller }) func searchUsers(term : Text) : async [Types.UserProfile] {
    let lower = term.toLower();
    let results = List.empty<Types.UserProfile>();
    let maxResults : Nat = 50;
    for ((uid, user) in users.entries()) {
      // Early exit once we have enough results
      if (results.size() >= maxResults) return results.toArray();
      if (user.username.toLower().contains(#text lower)) {
        let theirFollowing = switch (follows.get(uid)) { case (?s) s; case null Set.empty<Common.UserId>() };
        // Avoid heavy follower-set iteration for search results — use a fast approximation
        let followerSet    = Set.empty<Common.UserId>();
        results.add(Lib.toProfile(user, posts, followerSet, theirFollowing));
      };
    };
    results.toArray();
  };

  // ─── Official App Page ────────────────────────────────────────────────────

  /// Find the owner user (Princess Narzine Bani Hashem) in the users map.
  private func findOwner() : ?Types.User {
    var found : ?Types.User = null;
    for ((_, user) in users.entries()) {
      if (user.username == "Princess Narzine Bani Hashem") {
        found := ?user;
      };
    };
    found;
  };

  /// Return the official Zaren Veto app page profile.
  /// Returns the owner's profile (Princess Narzine Bani Hashem) with isOfficialPage=true.
  public query func getOfficialPage() : async Types.UserProfile {
    let officialBio = "Personnalité Publique\nPage officielle de la Fondatrice de l'application Zaren Veto";
    switch (findOwner()) {
      case (?owner) {
        {
          id              = owner.id;
          username        = "Zaren Veto";
          bio             = officialBio;
          visibility      = #everyone;
          postCount       = officialPagePosts.size();
          followerCount   = 19000;
          followingCount  = 0;
          profilePhotoUrl = owner.officialPageProfilePhotoUrl;
          coverPhotoUrl   = owner.officialPageCoverPhotoUrl;
          isVerified      = true;
          isOfficialPage  = true;
          aboutBio        = ?officialBio;
          aboutLocation   = null;
          aboutWork       = null;
          aboutEducation  = null;
          aboutWebsite    = null;
          birthdate       = null;
        };
      };
      case null {
        // Owner has not registered yet — return a default profile
        {
          id              = Principal.anonymous();
          username        = "Zaren Veto";
          bio             = officialBio;
          visibility      = #everyone;
          postCount       = officialPagePosts.size();
          followerCount   = 19000;
          followingCount  = 0;
          profilePhotoUrl = null;
          coverPhotoUrl   = null;
          isVerified      = true;
          isOfficialPage  = true;
          aboutBio        = ?officialBio;
          aboutLocation   = null;
          aboutWork       = null;
          aboutEducation  = null;
          aboutWebsite    = null;
          birthdate       = null;
        };
      };
    };
  };

  /// Create a post on the official Zaren Veto page (owner only).
  public shared ({ caller }) func createOfficialPost(content : Text, imageUrl : ?Text) : async { #ok : Common.PostId; #err : Text } {
    // Only the verified owner ("Princess Narzine Bani Hashem") may post
    switch (users.get(caller)) {
      case null { #err("Not registered") };
      case (?user) {
        if (user.username != "Princess Narzine Bani Hashem") {
          return #err("Only the page owner can post on the official page");
        };
        let id  = nextPostId.value;
        nextPostId.value += 1;
        let now = Time.now();
        let post = Lib.newPost(id, user, content, #everyone, [], imageUrl, now);
        officialPagePosts.add(post);
        #ok(id);
      };
    };
  };

  /// Return paginated posts from the official Zaren Veto page (public).
  public query func getOfficialPagePosts(page : Nat, pageSize : Nat) : async [Types.PostView] {
    let sorted = officialPagePosts.sort(func(a : Types.Post, b : Types.Post) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt);
    });
    let total  = sorted.size();
    let start  = page * pageSize;
    if (start >= total) return [];
    let stop = if (start + pageSize > total) total else start + pageSize;
    sorted.sliceToArray(start, stop).map<Types.Post, Types.PostView>(func(p) { toView(p) });
  };

  /// Return a shareable profile link identifier for the given userId.
  /// Returns the principal text as a profile path token.
  public query func getProfileLink(userId : Common.UserId) : async Text {
    "profile/" # userId.toText();
  };

  /// Return a shareable link identifier for the official Zaren Veto page.
  public query func getOfficialPageLink() : async Text {
    "page/zaren-veto";
  };

  // ─── Follow ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func followUser(target : Common.UserId) : async Bool {
    if (caller.isAnonymous()) return false;
    if (caller == target) return false;
    // Allow following the official page principal (owner) even if not in users map yet,
    // but only allow following real registered users or the owner
    let targetExists = switch (users.get(target)) {
      case (?_) true;
      case null {
        // Check if target is the owner via username lookup
        switch (findOwner()) {
          case (?owner) Principal.equal(owner.id, target);
          case null false;
        };
      };
    };
    if (not targetExists) return false;
    let myFollowing = switch (follows.get(caller)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        follows.add(caller, s);
        s;
      };
    };
    if (myFollowing.contains(target)) return false;
    myFollowing.add(target);
    true;
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async Bool {
    switch (follows.get(caller)) {
      case null    { false };
      case (?myFollowing) {
        if (not myFollowing.contains(target)) return false;
        myFollowing.remove(target);
        true;
      };
    };
  };

  public shared query ({ caller }) func isFollowing(target : Common.UserId) : async Bool {
    switch (follows.get(caller)) {
      case null    { false };
      case (?myFollowing) { myFollowing.contains(target) };
    };
  };

  // ─── Posts ────────────────────────────────────────────────────────────────

  /// Create a new post (with optional image, visibility, custom allow list).
  /// Returns #ok(postId) on success, #err(message) if caller is not registered.
  public shared ({ caller }) func createPost(
    content         : Text,
    visibility      : Types.Visibility,
    customAllowList : [Common.UserId],
    imageUrl        : ?Text,
  ) : async { #ok : Common.PostId; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot post");
    switch (users.get(caller)) {
      case null { #err("User not registered") };
      case (?user) {
        let id  = nextPostId.value;
        nextPostId.value += 1;
        let now = Time.now();
        let post = Lib.newPost(id, user, content, visibility, customAllowList, imageUrl, now);
        posts.add(post);
        // Index hashtags
        NewLib.indexHashtags(hashtagIndex, id, content, now, hashtagPostTime);
        #ok(id);
      };
    };
  };

  /// Edit the content of an existing post (author only).
  public shared ({ caller }) func editPost(postId : Common.PostId, content : Text) : async Bool {
    let now = Time.now();
    var found = false;
    var oldContent = "";
    // Capture old content and update
    posts.mapInPlace(func(p : Types.Post) : Types.Post {
      if (p.id == postId and p.authorId == caller) {
        oldContent  := p.content;
        p.content   := content;
        p.updatedAt := now;
        found := true;
      };
      p;
    });
    if (found) {
      // Re-index hashtags
      NewLib.removeHashtagEntries(hashtagIndex, postId, oldContent);
      NewLib.indexHashtags(hashtagIndex, postId, content, now, hashtagPostTime);
    };
    found;
  };

  /// Delete a post (author only).
  public shared ({ caller }) func deletePost(postId : Common.PostId) : async Bool {
    let before = posts.size();
    var deletedContent = "";
    // Find the post content before deleting
    switch (posts.find(func(p : Types.Post) : Bool { p.id == postId and p.authorId == caller })) {
      case (?p) { deletedContent := p.content };
      case null { return false };
    };
    let filtered = posts.filter(func(p : Types.Post) : Bool {
      not (p.id == postId and p.authorId == caller)
    });
    if (filtered.size() == before) return false;
    posts.clear();
    posts.append(filtered);
    NewLib.removeHashtagEntries(hashtagIndex, postId, deletedContent);
    true;
  };

  /// Return the caller's personalised feed.
  public shared query ({ caller }) func getFeed() : async [Types.PostView] {
    let myFollowing = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
    let feed = posts.filter(func(p : Types.Post) : Bool {
      let isOwn      = p.authorId == caller;
      let isFollow   = myFollowing.contains(p.authorId);
      let isMutual   = isMutualFollow(caller, p.authorId);
      isOwn or Lib.canViewPost(caller, p, isFollow, isMutual);
    });
    let sorted = feed.sort(func(a : Types.Post, b : Types.Post) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt);
    });
    sorted.map<Types.Post, Types.PostView>(func(p) { toView(p) }).toArray();
  };

  /// Return all visible posts on a given user's profile (pinned post first).
  public shared query ({ caller }) func getUserPosts(userId : Common.UserId) : async [Types.PostView] {
    let myFollowing = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
    let isFollow  = myFollowing.contains(userId);
    let isMutual  = isMutualFollow(caller, userId);
    let visible = posts.filter(func(p : Types.Post) : Bool {
      p.authorId == userId and Lib.canViewPost(caller, p, isFollow, isMutual)
    });
    let sorted = visible.sort(func(a : Types.Post, b : Types.Post) : { #less; #equal; #greater } {
      // Pinned post comes first
      if (a.isPinned and not b.isPinned) return #greater;
      if (not a.isPinned and b.isPinned) return #less;
      Int.compare(b.createdAt, a.createdAt);
    });
    sorted.map<Types.Post, Types.PostView>(func(p) { toView(p) }).toArray();
  };

  // ─── Messaging ────────────────────────────────────────────────────────────

  public shared ({ caller }) func sendMessage(recipient : Common.UserId, encryptedContent : Blob) : async Common.MessageId {
    let id     = nextMessageId.value;
    nextMessageId.value += 1;
    let convId = Lib.conversationId(caller, recipient);
    let msg    = Lib.newMessage(id, convId, caller, encryptedContent, Time.now());
    messages.add(msg);
    id;
  };

  public shared query ({ caller }) func getConversations() : async [Types.ConversationSummary] {
    let latestByConv = Map.empty<Common.ConversationId, Types.Message>();
    for (msg in messages.values()) {
      let convId     = msg.conversationId;
      let callerText = caller.toText();
      if (convId.contains(#text callerText)) {
        switch (latestByConv.get(convId)) {
          case null        { latestByConv.add(convId, msg) };
          case (?existing) {
            if (msg.createdAt > existing.createdAt) {
              latestByConv.add(convId, msg);
            };
          };
        };
      };
    };

    let result = List.empty<Types.ConversationSummary>();
    for ((convId, lastMsg) in latestByConv.entries()) {
      let parts    = convId.split(#char ':');
      let partsArr = parts.toArray();
      if (partsArr.size() == 2) {
        let callerText     = caller.toText();
        let otherText      = if (partsArr[0] == callerText) partsArr[1] else partsArr[0];
        let otherPrincipal = Principal.fromText(otherText);
        switch (users.get(otherPrincipal)) {
          case null         {};
          case (?otherUser) {
            result.add(Lib.toConversationSummary(caller, lastMsg, otherUser));
          };
        };
      };
    };

    let sorted = result.sort(func(a : Types.ConversationSummary, b : Types.ConversationSummary) : { #less; #equal; #greater } {
      Int.compare(b.lastMessageAt, a.lastMessageAt);
    });
    sorted.toArray();
  };

  public shared query ({ caller }) func getMessages(otherUser : Common.UserId) : async [Types.MessageView] {
    let convId = Lib.conversationId(caller, otherUser);
    let thread = messages.filter(func(m : Types.Message) : Bool {
      m.conversationId == convId
    });
    let sorted = thread.sort(func(a : Types.Message, b : Types.Message) : { #less; #equal; #greater } {
      Int.compare(a.createdAt, b.createdAt);
    });
    sorted.map<Types.Message, Types.MessageView>(func(m) { Lib.toMessageView(m, caller) }).toArray();
  };
};
