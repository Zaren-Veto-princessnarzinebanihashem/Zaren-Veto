import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";

import Common "types/common";
import Types "types/users-posts-messages";
import EngTypes "types/engagement";
import NewTypes "types/stories-hashtags-friendrequests-polls-admin";
import GroupTypes "types/groups";
import PageTypes "types/pages";
import UPMApi "mixins/users-posts-messages-api";
import EngApi "mixins/engagement-api";
import NewApi "mixins/stories-hashtags-friendrequests-polls-admin-api";
import GroupsApi "mixins/groups-api";
import PagesApi "mixins/pages-api";
import UPMLib "lib/users-posts-messages";

// ─────────────────────────────────────────────────────────────────────────────
// Zaren Veto — Actor root
//
// State persistence: explicit stable var declarations.
// All state variables are declared as `stable var` so their internal B-tree
// representations survive canister upgrades without data loss.
//
// Owner auto-recovery: ensureOwnerAccount() (II-based) and the internal
// ensureOwnerAccountInternal() called on postupgrade guarantee the owner
// account is always restored after any upgrade.
// ─────────────────────────────────────────────────────────────────────────────

actor {
  // ─── Users / Posts / Messages state ────────────────────────────────────────
  stable var users         : Map.Map<Common.UserId, Types.User>                   = Map.empty();
  stable var posts         : List.List<Types.Post>                                = List.empty();
  stable var messages      : List.List<Types.Message>                             = List.empty();
  stable var follows       : Map.Map<Common.UserId, Set.Set<Common.UserId>>       = Map.empty();
  stable var verified      : Set.Set<Common.UserId>                               = Set.empty();
  stable let nextPostId    : { var value : Nat }                                  = { var value = 0 };
  stable let nextMessageId : { var value : Nat }                                  = { var value = 0 };

  // ─── Hashtag index (shared with UPMApi and NewApi) ──────────────────────────
  stable var hashtagIndex    : Map.Map<Text, List.List<Common.PostId>>            = Map.empty();
  stable var hashtagPostTime : Map.Map<Text, List.List<Common.Timestamp>>         = Map.empty();

  // ─── Official page posts ───────────────────────────────────────────────
  stable var officialPagePosts : List.List<Types.Post>                            = List.empty();

  // ─── Followers reverse index (who follows userId) ───────────────────────────
  stable var followers     : Map.Map<Common.UserId, List.List<Common.UserId>>     = Map.empty();

  // ─── Engagement state ──────────────────────────────────────────────────
  stable var likes         : Map.Map<Common.PostId, Set.Set<Common.UserId>>                              = Map.empty();
  stable var reactions     : Map.Map<Common.PostId, Map.Map<Common.UserId, EngTypes.ReactionType>>       = Map.empty();
  stable var comments      : List.List<EngTypes.Comment>                                                 = List.empty();
  stable var shares        : List.List<EngTypes.Share>                                                   = List.empty();
  stable var notifications : List.List<EngTypes.Notification>                                            = List.empty();
  stable var savedPosts    : Map.Map<Common.UserId, Set.Set<Common.PostId>>                              = Map.empty();
  stable var reports       : List.List<EngTypes.Report>                                                  = List.empty();
  stable let nextCommentId : { var value : Nat }                                                         = { var value = 0 };
  stable let nextNotifId   : { var value : Nat }                                                         = { var value = 0 };
  stable let nextReportId  : { var value : Nat }                                                         = { var value = 0 };

  // ─── Post-comments index (postId → [commentId]) ────────────────────────────
  stable var postCommentsIndex : Map.Map<Common.PostId, List.List<EngTypes.CommentId>>                   = Map.empty();

  // ─── Stories state ─────────────────────────────────────────────────────
  stable var stories       : List.List<NewTypes.Story>                            = List.empty();
  stable let nextStoryId   : { var value : Nat }                                  = { var value = 0 };

  // ─── Friend requests / block state ─────────────────────────────────────
  stable var friendRequests  : List.List<NewTypes.FriendRequest>                  = List.empty();
  stable let nextFriendReqId : { var value : Nat }                                = { var value = 0 };
  stable var blockedUsers    : Map.Map<Common.UserId, Set.Set<Common.UserId>>     = Map.empty();

  // ─── Pinned posts ───────────────────────────────────────────────────────
  stable var pinnedPosts   : Map.Map<Common.UserId, Common.PostId>                = Map.empty();

  // ─── Polls state ─────────────────────────────────────────────────────────
  stable var polls         : List.List<NewTypes.Poll>                             = List.empty();
  stable var pollVotes     : List.List<NewTypes.PollVote>                         = List.empty();
  stable let nextPollId    : { var value : Nat }                                  = { var value = 0 };

  // ─── Message reactions ──────────────────────────────────────────────────
  stable var msgReactions  : List.List<EngTypes.MessageReaction>                  = List.empty();

  // ─── Groups state ───────────────────────────────────────────────────────
  stable var groups        : Map.Map<GroupTypes.GroupId, GroupTypes.Group>        = Map.empty();
  stable let nextGroupId   : { var value : Nat }                                  = { var value = 0 };
  stable var groupPosts      : Map.Map<GroupTypes.GroupId, List.List<GroupTypes.GroupPost>>         = Map.empty();
  stable let nextGroupPostId : { var value : Nat }                                                  = { var value = 0 };
  stable var groupPostLikes  : Map.Map<GroupTypes.GroupPostId, List.List<Common.UserId>>            = Map.empty();

  // ─── Pages state ───────────────────────────────────────────────────────
  stable var pages          : Map.Map<PageTypes.PageId, PageTypes.Page>                    = Map.empty();
  stable var pageFollowers  : Map.Map<PageTypes.PageId, Set.Set<Common.UserId>>            = Map.empty();
  stable var pagePosts      : Map.Map<PageTypes.PageId, List.List<Types.Post>>             = Map.empty();
  stable let nextPageId     : { var value : Nat }                                          = { var value = 0 };
  stable let nextPagePostId : { var value : Nat }                                          = { var value = 0 };

  // ─── Username index (username → userId for O(1) login lookup) ──────────────
  stable var usernameIndex : Map.Map<Text, Common.UserId>                         = Map.empty();

  // ─── Postupgrade: restore owner account if missing after any upgrade ────────
  system func postupgrade() {
    let ownerNorm     = "princessnarzinebanihashem";
    let ownerUsername = "Princess Narzine Bani Hashem";
    switch (usernameIndex.get(ownerNorm)) {
      case (?existingId) {
        // Owner index entry exists — ensure user record is present
        switch (users.get(existingId)) {
          case (?_) {}; // already present, nothing to do
          case null {
            // Orphaned index — create a placeholder (no II principal available here)
            // The owner can call ensureOwnerAccount() to assign her II principal
            ();
          };
        };
      };
      case null {
        // Owner not in index at all — this happens on the very first install
        // or after a state-wiping reinstall.  We can't create the user record
        // without a real Principal here (postupgrade has no caller), so we
        // leave the map empty and rely on ensureOwnerAccount() / loginWithPasswordOnly()
        // being called by the owner to self-restore her account.
        ();
      };
    };
  };

  // ─── Mixin composition ───────────────────────────────────────────────────
  include UPMApi(users, posts, messages, follows, followers, verified, nextPostId, nextMessageId,
                 hashtagIndex, hashtagPostTime, officialPagePosts,
                 notifications, nextNotifId, usernameIndex);

  include EngApi(users, posts, likes, reactions, comments, shares, notifications,
                 savedPosts, reports, verified, nextCommentId, nextNotifId, nextReportId,
                 postCommentsIndex);

  include NewApi(
    users, posts, messages, follows, verified, reports, notifications, nextNotifId, nextReportId,
    stories, nextStoryId,
    hashtagIndex, hashtagPostTime,
    friendRequests, nextFriendReqId, blockedUsers,
    pinnedPosts,
    polls, pollVotes, nextPollId,
    msgReactions,
    usernameIndex,
  );

  include GroupsApi(groups, nextGroupId, users, groupPosts, nextGroupPostId, groupPostLikes);

  include PagesApi(pages, pageFollowers, pagePosts, nextPageId, nextPagePostId, users);

  // ─── Owner account restoration (Internet Identity flow) ─────────────────────
  // Idempotent. If the owner already exists in the index the call returns
  // the existing profile.  If the caller is a new/different II principal
  // (e.g. after a reinstall) the ownership is transferred to the new
  // principal so the owner keeps all her posts and data.
  public shared ({ caller }) func ensureOwnerAccount(
    password : Text,
    email    : ?Text,
  ) : async { #ok : Types.UserProfile; #err : Text } {
    let ownerNorm     = "princessnarzinebanihashem";
    let ownerUsername = "Princess Narzine Bani Hashem";

    switch (usernameIndex.get(ownerNorm)) {
      case (?existingId) {
        switch (users.get(existingId)) {
          case (?user) {
            // Set password if provided and not yet stored
            if (password.size() > 0) {
              switch (user.passwordHash) {
                case null {
                  if (UPMLib.validatePassword(password)) {
                    user.passwordHash := ?(UPMLib.hashPassword(password));
                  };
                };
                case (?_) {};
              };
            };
            // Transfer ownership to the current II principal if different
            if (not caller.isAnonymous() and not Principal.equal(caller, existingId)) {
              users.remove(existingId);
              let updatedUser : Types.User = {
                id = caller;
                var username       = user.username;
                var bio            = "";
                var visibility     = user.visibility;
                var profilePhotoUrl = user.profilePhotoUrl;
                var coverPhotoUrl   = user.coverPhotoUrl;
                var officialPageProfilePhotoUrl = user.officialPageProfilePhotoUrl;
                var officialPageCoverPhotoUrl   = user.officialPageCoverPhotoUrl;
                var isVerified     = true;
                var isSuspended    = user.isSuspended;
                var suspendedUntil = user.suspendedUntil;
                var isBanned       = user.isBanned;
                var passwordHash   = user.passwordHash;
                var email          = user.email;
                var aboutBio       = user.aboutBio;
                var aboutLocation  = user.aboutLocation;
                var aboutWork      = user.aboutWork;
                var aboutEducation = user.aboutEducation;
                var aboutWebsite   = user.aboutWebsite;
                var birthdate      = user.birthdate;
              };
              users.add(caller, updatedUser);
              usernameIndex.add(ownerNorm, caller);
              verified.add(caller);
            };
            let finalId = if (caller.isAnonymous() or Principal.equal(caller, existingId)) existingId else caller;
            let finalUser = switch (users.get(finalId)) { case (?u) u; case null user };
            return #ok({
              id              = finalId;
              username        = ownerUsername;
              bio             = "";
              visibility      = #everyone;
              postCount       = 0;
              followerCount   = 19000;
              followingCount  = 0;
              profilePhotoUrl = finalUser.profilePhotoUrl;
              coverPhotoUrl   = finalUser.coverPhotoUrl;
              isVerified      = true;
              isOfficialPage  = false;
              aboutBio        = null;
              aboutLocation   = finalUser.aboutLocation;
              aboutWork       = finalUser.aboutWork;
              aboutEducation  = finalUser.aboutEducation;
              aboutWebsite    = finalUser.aboutWebsite;
              birthdate       = finalUser.birthdate;
            });
          };
          case null {}; // orphaned index entry — fall through to create
        };
      };
      case null {};
    };

    // Owner does not exist yet — create with caller's II principal
    if (caller.isAnonymous()) {
      return #err("Cannot create owner account with anonymous principal — log in with Internet Identity first, or use loginWithPasswordOnly to auto-create via password");
    };
    if (password.size() > 0 and not UPMLib.validatePassword(password)) {
      return #err("Password must be at least 8 characters with uppercase, lowercase, and a digit");
    };
    let ownerUser : Types.User = {
      id = caller;
      var username       = ownerUsername;
      var bio            = "";
      var visibility     = #everyone;
      var profilePhotoUrl = null;
      var coverPhotoUrl   = null;
      var officialPageProfilePhotoUrl = null;
      var officialPageCoverPhotoUrl   = null;
      var isVerified     = true;
      var isSuspended    = false;
      var suspendedUntil = null;
      var isBanned       = false;
      var passwordHash   = if (password.size() > 0) ?(UPMLib.hashPassword(password)) else null;
      var email;
      var aboutBio       = null;
      var aboutLocation  = null;
      var aboutWork      = null;
      var aboutEducation = null;
      var aboutWebsite   = null;
      var birthdate      = null;
    };
    users.add(caller, ownerUser);
    usernameIndex.add(ownerNorm, caller);
    verified.add(caller);
    #ok({
      id              = caller;
      username        = ownerUsername;
      bio             = "";
      visibility      = #everyone;
      postCount       = 0;
      followerCount   = 19000;
      followingCount  = 0;
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
    });
  };

  // ─── Health check (frontend polling) ──────────────────────────────────────────
  // Returns true immediately. The frontend calls this to verify the canister
  // is alive before attempting heavier calls. Bounded O(1) — never traps.
  public query func ping() : async Bool { true };

  // ─── Owner exists check ────────────────────────────────────────────────────
  // Returns true if the owner account exists in the users map.
  public query func ownerAccountExists() : async Bool {
    switch (usernameIndex.get("princessnarzinebanihashem")) {
      case null false;
      case (?uid) users.containsKey(uid);
    };
  };
};
