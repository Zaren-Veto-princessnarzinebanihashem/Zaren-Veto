import Common "../types/common";
import Types "../types/users-posts-messages";
import EngTypes "../types/engagement";
import Lib "../lib/users-posts-messages";
import EngLib "../lib/engagement";
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
  // Reverse index: followers(userId) = list of users who follow userId
  followers     : Map.Map<Common.UserId, List.List<Common.UserId>>,
  verified      : Set.Set<Common.UserId>,
  nextPostId    : { var value : Nat },
  nextMessageId : { var value : Nat },
  // hashtag state (injected for indexing on create/edit/delete)
  hashtagIndex    : Map.Map<Text, List.List<Common.PostId>>,
  hashtagPostTime : Map.Map<Text, List.List<Common.Timestamp>>,
  // official page posts
  officialPagePosts : List.List<Types.Post>,
  // notifications (used to alert owner on new registrations)
  notifications : List.List<EngTypes.Notification>,
  nextNotifId   : { var value : Nat },
  // username → userId index for O(1) login lookup
  usernameIndex : Map.Map<Text, Common.UserId>,
) {

  // ─── Internal helpers ──────────────────────────────────────────────────────────────────────────────

  /// Build a Set of followers for userId using the reverse index (O(k) not O(n)).
  private func buildFollowerSet(userId : Common.UserId) : Set.Set<Common.UserId> {
    switch (followers.get(userId)) {
      case null { Set.empty<Common.UserId>() };
      case (?followerList) {
        let s = Set.empty<Common.UserId>();
        for (uid in followerList.values()) {
          s.add(uid);
        };
        s;
      };
    };
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

  // ─── Account ───────────────────────────────────────────────────────────────────────────────────

  /// Register the calling principal with a username and bio.
  public shared ({ caller }) func register(username : Text, bio : Text) : async Bool {
    if (caller.isAnonymous()) return false;
    switch (users.get(caller)) {
      case (?_) { false }; // already registered
      case null {
        // Block reserved owner name variants
        if (Lib.isReservedName(username)) return false;
        let safeBio = Lib.sanitizeOwnerBio(bio);
        let user = Lib.newUser(caller, username, safeBio);
        // Auto-verify the owner account
        if (username == "Princess Narzine Bani Hashem") {
          verified.add(caller);
          user.isVerified := true;
        };
        users.add(caller, user);
        let normName = Lib.normalizeUsername(username);
        usernameIndex.add(normName, caller);
        // Notify the app owner about the new registration using the index (O(1))
        let ownerNorm = "princessnarzinebanihashem";
        switch (usernameIndex.get(ownerNorm)) {
          case (?ownerId) {
            if (not Principal.equal(ownerId, caller)) {
              EngLib.pushNotification(
                notifications, nextNotifId, ownerId, caller,
                username, #newUserRegistration { fromUsername = username }, Time.now()
              );
            };
          };
          case null {}; // owner not registered yet — skip silently
        };
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
        let normName = Lib.normalizeUsername(username);
        usernameIndex.add(normName, caller);
        // Notify the app owner about the new registration using the index (O(1))
        let ownerNorm = "princessnarzinebanihashem";
        switch (usernameIndex.get(ownerNorm)) {
          case (?ownerId) {
            if (not Principal.equal(ownerId, caller)) {
              EngLib.pushNotification(
                notifications, nextNotifId, ownerId, caller,
                username, #newUserRegistration { fromUsername = username }, Time.now()
              );
            };
          };
          case null {}; // owner not registered yet — skip silently
        };
        #ok(true);
      };
    };
  };

  /// Update profile fields for the calling principal.
  public shared ({ caller }) func updateProfile(username : Text, bio : Text, visibility : Types.Visibility) : async Bool {
    switch (users.get(caller)) {
      case null    { false };
      case (?user) {
        // Update username index: remove old, add new
        let oldNorm = Lib.normalizeUsername(user.username);
        let newNorm = Lib.normalizeUsername(username);
        if (oldNorm != newNorm) {
          usernameIndex.remove(oldNorm);
          usernameIndex.add(newNorm, caller);
        };
        user.username   := username;
        // Sanitize bio — for reserved names always empty; for others strip forbidden words
        let isOwner = Lib.isReservedName(username);
        user.bio        := if (isOwner) "" else Lib.sanitizeOwnerBio(bio);
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
  /// Finds the user by username using the O(1) index, hashes the submitted password, compares to stored hash.
  /// Returns the user profile on success, or an error on failure.
  public shared func loginWithPassword(username : Text, password : Text) : async { #ok : Types.UserProfile; #err : Text } {
    let normSearch = Lib.normalizeUsername(username);
    let foundUser : ?Types.User = switch (usernameIndex.get(normSearch)) {
      case null null;
      case (?uid) users.get(uid);
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
              let isOwner = Lib.isReservedName(user.username);
              let followerCount : Nat = if (isOwner) 19000 else 0;
              #ok({
                id             = user.id;
                username       = user.username;
                bio            = ""; // ALWAYS empty — frontend hardcodes blue lines
                visibility     = user.visibility;
                postCount      = 0;
                followerCount;
                followingCount = 0;
                profilePhotoUrl = user.profilePhotoUrl;
                coverPhotoUrl   = user.coverPhotoUrl;
                isVerified      = user.isVerified;
                isOfficialPage  = false;
                aboutBio        = if (isOwner) null else user.aboutBio;
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
  /// Accepts an anonymous principal call. Finds user by username via O(1) index, verifies password,
  /// and returns both the UserProfile and the UserId so the frontend can track the session.
  /// Standalone password-only login — does NOT require Internet Identity.
  /// Accepts an anonymous principal call. Finds user by username via O(1) index, verifies password,
  /// and returns both the UserProfile and the UserId so the frontend can track the session.
  /// SPECIAL OWNER AUTO-CREATION: If the owner username is entered but no account exists,
  /// automatically creates the owner account with a deterministic principal so she can
  /// always recover access even after a full canister reinstall.
  public shared func loginWithPasswordOnly(username : Text, password : Text) : async Types.LoginWithPasswordResult {
    if (password.size() == 0) return #err("Password cannot be empty");
    let normSearch = Lib.normalizeUsername(username);
    let isOwnerName = Lib.isReservedName(username);

    // ── Owner auto-recovery: create account if missing ──────────────────────
    // If the owner's name is used but no account exists, auto-create it
    // using a stable deterministic owner principal so she's never locked out.
    if (isOwnerName) {
      let ownerNorm = "princessnarzinebanihashem";
      let hasExisting = switch (usernameIndex.get(ownerNorm)) {
        case null false;
        case (?uid) users.containsKey(uid);
      };
      if (not hasExisting) {
        // Validate password before creating
        if (not Lib.validatePassword(password)) {
          return #err("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit");
        };
        // Use a stable deterministic principal for the owner account.
        // This principal is recognisable (opaque-canister-style) and will
        // never be produced by Internet Identity so there is no collision risk.
        let ownerPrincipal = Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai");
        let ownerUser : Types.User = {
          id = ownerPrincipal;
          var username = "Princess Narzine Bani Hashem";
          var bio = "";
          var visibility = #everyone;
          var profilePhotoUrl = null;
          var coverPhotoUrl = null;
          var officialPageProfilePhotoUrl = null;
          var officialPageCoverPhotoUrl = null;
          var isVerified = true;
          var isSuspended = false;
          var suspendedUntil = null;
          var isBanned = false;
          var passwordHash = ?(Lib.hashPassword(password));
          var email = null;
          var aboutBio = null;
          var aboutLocation = null;
          var aboutWork = null;
          var aboutEducation = null;
          var aboutWebsite = null;
          var birthdate = null;
        };
        users.add(ownerPrincipal, ownerUser);
        usernameIndex.add(ownerNorm, ownerPrincipal);
        verified.add(ownerPrincipal);
        let profile : Types.UserProfile = {
          id             = ownerPrincipal;
          username       = "Princess Narzine Bani Hashem";
          bio            = "";
          visibility     = #everyone;
          postCount      = 0;
          followerCount  = 19000;
          followingCount = 0;
          profilePhotoUrl = null;
          coverPhotoUrl   = null;
          isVerified      = true;
          isOfficialPage  = false;
          aboutBio        = null;
          aboutLocation   = null;
          aboutWork       = null;
          aboutEducation  = null;
          aboutWebsite    = null;
          birthdate       = null;
        };
        return #ok({ profile; userId = ownerPrincipal });
      };
    };
    // ────────────────────────────────────────────────────────────────────────

    let foundUser : ?Types.User = switch (usernameIndex.get(normSearch)) {
      case null null;
      case (?uid) users.get(uid);
    };
    switch (foundUser) {
      case null { #err("Invalid username or password") };
      case (?user) {
        let isOwner = Lib.isReservedName(user.username);
        switch (user.passwordHash) {
          case null {
            // Special owner recovery: if the owner has no password set yet,
            // treat the submitted value as the new password to set (first-time setup).
            if (isOwner) {
              if (not Lib.validatePassword(password)) {
                return #err("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit");
              };
              user.passwordHash := ?(Lib.hashPassword(password));
              if (user.bio.size() > 0) { user.bio := "" };
              let myFollowing = switch (follows.get(user.id)) { case (?s) s; case null Set.empty<Common.UserId>() };
              let profile : Types.UserProfile = {
                id             = user.id;
                username       = user.username;
                bio            = "";
                visibility     = user.visibility;
                postCount      = 0;
                followerCount  = 19000;
                followingCount = myFollowing.size();
                profilePhotoUrl = user.profilePhotoUrl;
                coverPhotoUrl   = user.coverPhotoUrl;
                isVerified      = user.isVerified;
                isOfficialPage  = false;
                aboutBio        = null;
                aboutLocation   = user.aboutLocation;
                aboutWork       = user.aboutWork;
                aboutEducation  = user.aboutEducation;
                aboutWebsite    = user.aboutWebsite;
                birthdate       = user.birthdate;
              };
              return #ok({ profile; userId = user.id });
            };
            #err("This account uses Internet Identity login and does not have a password");
          };
          case (?storedHash) {
            let submittedHash = Lib.hashPassword(password);
            if (submittedHash == storedHash) {
              if (user.bio.size() > 0) { user.bio := "" };
              let myFollowing = switch (follows.get(user.id)) { case (?s) s; case null Set.empty<Common.UserId>() };
              let followerCount : Nat = if (isOwner) 19000 else 0;
              let profile : Types.UserProfile = {
                id             = user.id;
                username       = user.username;
                bio            = "";
                visibility     = user.visibility;
                postCount      = 0;
                followerCount;
                followingCount = myFollowing.size();
                profilePhotoUrl = user.profilePhotoUrl;
                coverPhotoUrl   = user.coverPhotoUrl;
                isVerified      = user.isVerified;
                isOfficialPage  = false;
                aboutBio        = if (isOwner) null else user.aboutBio;
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

  /// Verify that a stored session (userId) is still valid.
  /// Returns the user profile if valid, null if not found.
  /// Used by the frontend to restore sessions after page reload.
  public shared query func verifySession(userId : Common.UserId) : async ?Types.UserProfile {
    switch (users.get(userId)) {
      case null { null };
      case (?user) {
        let isOwner = Lib.isReservedName(user.username);
        let myFollowing  = switch (follows.get(userId)) { case (?s) s; case null Set.empty<Common.UserId>() };
        let followerCount : Nat = if (isOwner) 19000 else 0;
        ?{
          id             = user.id;
          username       = user.username;
          bio            = ""; // ALWAYS empty — frontend hardcodes bio display
          visibility     = user.visibility;
          postCount      = 0;
          followerCount;
          followingCount = myFollowing.size();
          profilePhotoUrl = user.profilePhotoUrl;
          coverPhotoUrl   = user.coverPhotoUrl;
          isVerified      = user.isVerified;
          isOfficialPage  = false;
          aboutBio        = if (isOwner) null else user.aboutBio;
          aboutLocation   = user.aboutLocation;
          aboutWork       = user.aboutWork;
          aboutEducation  = user.aboutEducation;
          aboutWebsite    = user.aboutWebsite;
          birthdate       = user.birthdate;
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

  /// Set or update the password for the calling principal's account.
  public shared ({ caller }) func setMyPassword(newPassword : Text) : async { #ok : Bool; #err : Text } {
    switch (users.get(caller)) {
      case null { #err("Not registered") };
      case (?user) {
        if (not Lib.validatePassword(newPassword)) {
          return #err("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one digit");
        };
        user.passwordHash := ?(Lib.hashPassword(newPassword));
        #ok(true);
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
        let isOwner = Lib.isReservedName(user.username);
        let followerCount = if (isOwner) 19000 else followerSet.size();
        ?{
          id             = user.id;
          username       = user.username;
          bio            = ""; // ALWAYS empty — frontend hardcodes bio display
          visibility     = user.visibility;
          postCount      = 0;
          followerCount;
          followingCount = myFollowing.size();
          profilePhotoUrl = user.profilePhotoUrl;
          coverPhotoUrl   = user.coverPhotoUrl;
          isVerified      = user.isVerified;
          isOfficialPage  = false;
          aboutBio        = if (isOwner) null else user.aboutBio;
          aboutLocation   = user.aboutLocation;
          aboutWork       = user.aboutWork;
          aboutEducation  = user.aboutEducation;
          aboutWebsite    = user.aboutWebsite;
          birthdate       = user.birthdate;
        };
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
        let isOwner = Lib.isReservedName(user.username);
        let followerCount = if (isOwner) 19000 else followerSet.size();
        ?{
          id             = user.id;
          username       = user.username;
          bio            = ""; // ALWAYS empty — frontend hardcodes bio display
          visibility     = user.visibility;
          postCount      = 0;
          followerCount;
          followingCount = theirFollowing.size();
          profilePhotoUrl = user.profilePhotoUrl;
          coverPhotoUrl   = user.coverPhotoUrl;
          isVerified      = user.isVerified;
          isOfficialPage  = false;
          aboutBio        = if (isOwner) null else user.aboutBio;
          aboutLocation   = user.aboutLocation;
          aboutWork       = user.aboutWork;
          aboutEducation  = user.aboutEducation;
          aboutWebsite    = user.aboutWebsite;
          birthdate       = user.birthdate;
        };
      };
    };
  };

  /// Search users by partial username match (case-insensitive). Limited to 20 results.
  public shared query ({ caller }) func searchUsers(term : Text) : async [Types.UserProfile] {
    let lower = term.toLower();
    let results = List.empty<Types.UserProfile>();
    let maxResults : Nat = 20;
    for ((uid, user) in users.entries()) {
      if (results.size() >= maxResults) return results.toArray();
      if (user.username.toLower().contains(#text lower)) {
        let isOwner = Lib.isReservedName(user.username);
        let followingCount = switch (follows.get(uid)) { case (?s) s.size(); case null 0 };
        results.add({
          id             = user.id;
          username       = user.username;
          bio            = ""; // ALWAYS empty — frontend hardcodes bio display
          visibility     = user.visibility;
          postCount      = 0;
          followerCount  = if (isOwner) 19000 else 0;
          followingCount;
          profilePhotoUrl = user.profilePhotoUrl;
          coverPhotoUrl   = user.coverPhotoUrl;
          isVerified      = user.isVerified;
          isOfficialPage  = false;
          aboutBio        = if (isOwner) null else user.aboutBio;
          aboutLocation   = user.aboutLocation;
          aboutWork       = user.aboutWork;
          aboutEducation  = user.aboutEducation;
          aboutWebsite    = user.aboutWebsite;
          birthdate       = user.birthdate;
        });
      };
    };
    results.toArray();
  };

  // ─── Official App Page ──────────────────────────────────────────────────────────────────────────

  /// Find the owner user (Princess Narzine Bani Hashem) in the users map.
  private func findOwner() : ?Types.User {
    switch (usernameIndex.get("princessnarzinebanihashem")) {
      case null null;
      case (?uid) users.get(uid);
    };
  };

  /// Return the official Zaren Veto app page profile.
  public query func getOfficialPage() : async Types.UserProfile {
    switch (findOwner()) {
      case (?owner) {
        {
          id              = owner.id;
          username        = "Zaren Veto";
          bio             = "";
          visibility      = #everyone;
          postCount       = officialPagePosts.size();
          followerCount   = 19000;
          followingCount  = 0;
          profilePhotoUrl = owner.officialPageProfilePhotoUrl;
          coverPhotoUrl   = owner.officialPageCoverPhotoUrl;
          isVerified      = true;
          isOfficialPage  = true;
          aboutBio        = null;
          aboutLocation   = null;
          aboutWork       = null;
          aboutEducation  = null;
          aboutWebsite    = null;
          birthdate       = null;
        };
      };
      case null {
        {
          id              = Principal.anonymous();
          username        = "Zaren Veto";
          bio             = "";
          visibility      = #everyone;
          postCount       = officialPagePosts.size();
          followerCount   = 19000;
          followingCount  = 0;
          profilePhotoUrl = null;
          coverPhotoUrl   = null;
          isVerified      = true;
          isOfficialPage  = true;
          aboutBio        = null;
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
  public query func getProfileLink(userId : Common.UserId) : async Text {
    "profile/" # userId.toText();
  };

  /// Return a shareable link identifier for the official Zaren Veto page.
  public query func getOfficialPageLink() : async Text {
    "page/zaren-veto";
  };

  // ─── Follow ───────────────────────────────────────────────────────────────────────────────────

  public shared ({ caller }) func followUser(target : Common.UserId) : async Bool {
    if (caller.isAnonymous()) return false;
    if (caller == target) return false;
    let targetExists = switch (users.get(target)) {
      case (?_) true;
      case null {
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
    let targetFollowers = switch (followers.get(target)) {
      case (?lst) lst;
      case null {
        let lst = List.empty<Common.UserId>();
        followers.add(target, lst);
        lst;
      };
    };
    targetFollowers.add(caller);
    true;
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async Bool {
    switch (follows.get(caller)) {
      case null    { false };
      case (?myFollowing) {
        if (not myFollowing.contains(target)) return false;
        myFollowing.remove(target);
        switch (followers.get(target)) {
          case null {};
          case (?targetFollowers) {
            let updated = targetFollowers.filter(func(uid : Common.UserId) : Bool {
              not Principal.equal(uid, caller)
            });
            targetFollowers.clear();
            targetFollowers.append(updated);
          };
        };
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

  // ─── Posts ─────────────────────────────────────────────────────────────────────────────────────

  /// Create a new post (with optional image, visibility, custom allow list).
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
      NewLib.removeHashtagEntries(hashtagIndex, postId, oldContent);
      NewLib.indexHashtags(hashtagIndex, postId, content, now, hashtagPostTime);
    };
    found;
  };

  /// Delete a post (author only).
  public shared ({ caller }) func deletePost(postId : Common.PostId) : async Bool {
    let before = posts.size();
    var deletedContent = "";
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

  /// Return the caller's personalised feed (capped at 50 most-recent posts).
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
    let total = sorted.size();
    let limit : Nat = if (total > 50) 50 else total;
    sorted.sliceToArray(0, limit).map<Types.Post, Types.PostView>(func(p) { toView(p) });
  };

  /// Return all visible posts on a given user's profile (pinned post first, capped at 50).
  public shared query ({ caller }) func getUserPosts(userId : Common.UserId) : async [Types.PostView] {
    let myFollowing = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
    let isFollow  = myFollowing.contains(userId);
    let isMutual  = isMutualFollow(caller, userId);
    let visible = posts.filter(func(p : Types.Post) : Bool {
      p.authorId == userId and Lib.canViewPost(caller, p, isFollow, isMutual)
    });
    let sorted = visible.sort(func(a : Types.Post, b : Types.Post) : { #less; #equal; #greater } {
      if (a.isPinned and not b.isPinned) return #greater;
      if (not a.isPinned and b.isPinned) return #less;
      Int.compare(b.createdAt, a.createdAt);
    });
    let total = sorted.size();
    let limit : Nat = if (total > 50) 50 else total;
    sorted.sliceToArray(0, limit).map<Types.Post, Types.PostView>(func(p) { toView(p) });
  };

  // ─── Messaging ────────────────────────────────────────────────────────────────────────────────

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

  // ─── Repost / Share to feed ────────────────────────────────────────────────────────────────────────────

  /// Edit the content and optional image of an existing post (author only).
  public shared ({ caller }) func editPostWithImage(postId : Common.PostId, content : Text, newImageUrl : ?Text) : async Bool {
    let now = Time.now();
    var found = false;
    var oldContent = "";
    posts.mapInPlace(func(p : Types.Post) : Types.Post {
      if (p.id == postId and p.authorId == caller) {
        oldContent  := p.content;
        p.content   := content;
        p.updatedAt := now;
        switch (newImageUrl) {
          case (?url) { p.imageUrl := ?url };
          case null {};
        };
        found := true;
      };
      p;
    });
    if (found) {
      NewLib.removeHashtagEntries(hashtagIndex, postId, oldContent);
      NewLib.indexHashtags(hashtagIndex, postId, content, now, hashtagPostTime);
    };
    found;
  };

  /// Share an existing post to the caller's feed (repost).
  /// Return follower list for a given user (public).
  public shared query ({ caller }) func getFollowers(userId : Common.UserId) : async [Types.UserProfile] {
    let result = List.empty<Types.UserProfile>();
    switch (followers.get(userId)) {
      case null { return [] };
      case (?followerList) {
        for (uid in followerList.values()) {
          switch (users.get(uid)) {
            case null {};
            case (?user) {
              let isOwner = Lib.isReservedName(user.username);
              result.add({
                id             = user.id;
                username       = user.username;
                bio            = "";
                visibility     = user.visibility;
                postCount      = 0;
                followerCount  = if (isOwner) 19000 else 0;
                followingCount = 0;
                profilePhotoUrl = user.profilePhotoUrl;
                coverPhotoUrl   = user.coverPhotoUrl;
                isVerified      = user.isVerified;
                isOfficialPage  = false;
                aboutBio        = null;
                aboutLocation   = user.aboutLocation;
                aboutWork       = user.aboutWork;
                aboutEducation  = user.aboutEducation;
                aboutWebsite    = user.aboutWebsite;
                birthdate       = user.birthdate;
              });
            };
          };
        };
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func sharePostToFeed(originalPostId : Common.PostId, comment : Text) : async { #ok : Types.PostView; #err : Text } {
    if (caller.isAnonymous()) return #err("Anonymous callers cannot share posts");
    let origExists = switch (posts.find(func(p : Types.Post) : Bool { p.id == originalPostId })) {
      case (?_) true;
      case null false;
    };
    if (not origExists) {
      let inOfficial = switch (officialPagePosts.find(func(p : Types.Post) : Bool { p.id == originalPostId })) {
        case (?_) true;
        case null false;
      };
      if (not inOfficial) return #err("Original post not found");
    };
    switch (users.get(caller)) {
      case null { #err("User not registered") };
      case (?user) {
        let id  = nextPostId.value;
        nextPostId.value += 1;
        let now = Time.now();
        let post = Lib.newRepost(id, user, comment, originalPostId, now);
        posts.add(post);
        #ok(toView(post));
      };
    };
  };
};
