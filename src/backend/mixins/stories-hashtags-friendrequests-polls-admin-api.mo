import Common "../types/common";
import NewTypes "../types/stories-hashtags-friendrequests-polls-admin";
import UPMTypes "../types/users-posts-messages";
import EngTypes "../types/engagement";
import Lib "../lib/stories-hashtags-friendrequests-polls-admin";
import UPMLib "../lib/users-posts-messages";
import EngLib "../lib/engagement";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  // ── Shared state ──────────────────────────────────────────────────────────
  users        : Map.Map<Common.UserId, UPMTypes.User>,
  posts        : List.List<UPMTypes.Post>,
  messages     : List.List<UPMTypes.Message>,
  follows      : Map.Map<Common.UserId, Set.Set<Common.UserId>>,
  verified     : Set.Set<Common.UserId>,
  reports      : List.List<EngTypes.Report>,
  notifications : List.List<EngTypes.Notification>,
  nextNotifId  : { var value : Nat },
  nextReportId : { var value : Nat },

  // ── New domain state ──────────────────────────────────────────────────────
  stories      : List.List<NewTypes.Story>,
  nextStoryId  : { var value : Nat },

  hashtagIndex    : Map.Map<Text, List.List<Common.PostId>>,
  hashtagPostTime : Map.Map<Text, List.List<Common.Timestamp>>,

  friendRequests  : List.List<NewTypes.FriendRequest>,
  nextFriendReqId : { var value : Nat },
  blockedUsers    : Map.Map<Common.UserId, Set.Set<Common.UserId>>,

  pinnedPosts  : Map.Map<Common.UserId, Common.PostId>,

  polls        : List.List<NewTypes.Poll>,
  pollVotes    : List.List<NewTypes.PollVote>,
  nextPollId   : { var value : Nat },

  msgReactions : List.List<EngTypes.MessageReaction>,
) {

  // ─── Internal helpers ──────────────────────────────────────────────────────

  private func requireNewUser(caller : Common.UserId) : UPMTypes.User {
    switch (users.get(caller)) {
      case (?u) u;
      case null Runtime.trap("Not registered");
    };
  };

  private func buildProfile(uid : Common.UserId) : ?UPMTypes.UserProfile {
    switch (users.get(uid)) {
      case null null;
      case (?user) {
        let theirFollowing = switch (follows.get(uid)) { case (?s) s; case null Set.empty<Common.UserId>() };
        let followerSet    = Set.empty<Common.UserId>();
        for ((fid, followingSet) in follows.entries()) {
          if (followingSet.contains(uid)) { followerSet.add(fid) };
        };
        ?UPMLib.toProfile(user, posts, followerSet, theirFollowing);
      };
    };
  };

  private func requireProfile(uid : Common.UserId) : UPMTypes.UserProfile {
    switch (buildProfile(uid)) {
      case (?p) p;
      case null Runtime.trap("User not found");
    };
  };

  private func isMutualFollowNew(a : Common.UserId, b : Common.UserId) : Bool {
    let aFollowsB = switch (follows.get(a)) { case (?s) s.contains(b); case null false };
    let bFollowsA = switch (follows.get(b)) { case (?s) s.contains(a); case null false };
    aFollowsB and bFollowsA;
  };

  private func isOwner(caller : Common.UserId) : Bool {
    switch (users.get(caller)) {
      case (?u) u.username == "Princess Narzine Bani Hashem";
      case null false;
    };
  };

  private func buildPostView(post : UPMTypes.Post, caller : Common.UserId) : UPMTypes.PostView {
    let authorVerified = verified.contains(post.authorId);
    let authorProfilePhoto = switch (users.get(post.authorId)) {
      case (?u) u.profilePhotoUrl;
      case null null;
    };
    UPMLib.toPostView(post, authorVerified, authorProfilePhoto);
  };

  // ─── Stories ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func createStory(imageUrl : Text, textOverlay : ?Text) : async NewTypes.StoryView {
    let user = requireNewUser(caller);
    let now  = Time.now();
    let id   = nextStoryId.value;
    nextStoryId.value += 1;
    let story = Lib.newStory(id, caller, imageUrl, textOverlay, now);
    stories.add(story);
    let profile = requireProfile(caller);
    switch (Lib.toStoryView(story, profile, caller, now)) {
      case (?sv) sv;
      case null Runtime.trap("Story creation failed");
    };
  };

  public shared query ({ caller }) func getMyStories() : async [NewTypes.StoryView] {
    let now = Time.now();
    let result = List.empty<NewTypes.StoryView>();
    let profile = switch (buildProfile(caller)) { case (?p) p; case null return [] };
    for (s in stories.values()) {
      if (s.authorId == caller) {
        switch (Lib.toStoryView(s, profile, caller, now)) {
          case (?sv) result.add(sv);
          case null {};
        };
      };
    };
    result.toArray();
  };

  public shared query ({ caller }) func getStoriesFeed() : async [NewTypes.StoryFeed] {
    let now = Time.now();
    let myFollowing = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
    // Group stories by author
    let byAuthor = Map.empty<Common.UserId, List.List<NewTypes.Story>>();
    for (s in stories.values()) {
      if (not s.isDeleted and now <= s.expiresAt and myFollowing.contains(s.authorId)) {
        let bucket = switch (byAuthor.get(s.authorId)) {
          case (?l) l;
          case null {
            let l = List.empty<NewTypes.Story>();
            byAuthor.add(s.authorId, l);
            l;
          };
        };
        bucket.add(s);
      };
    };
    let result = List.empty<NewTypes.StoryFeed>();
    for ((authorId, authorStories) in byAuthor.entries()) {
      switch (buildProfile(authorId)) {
        case null {};
        case (?authorProfile) {
          let views = List.empty<NewTypes.StoryView>();
          var hasUnviewed = false;
          for (s in authorStories.values()) {
            switch (Lib.toStoryView(s, authorProfile, caller, now)) {
              case (?sv) {
                views.add(sv);
                if (not sv.viewedByMe) hasUnviewed := true;
              };
              case null {};
            };
          };
          if (not views.isEmpty()) {
            result.add({ author = authorProfile; stories = views.toArray(); hasUnviewed });
          };
        };
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func viewStory(storyId : Nat) : async () {
    Lib.markViewed(stories, storyId, caller);
  };

  public shared ({ caller }) func deleteStory(storyId : Nat) : async () {
    stories.mapInPlace(func(s : NewTypes.Story) : NewTypes.Story {
      if (s.id == storyId and s.authorId == caller) {
        s.isDeleted := true;
      };
      s;
    });
  };

  public shared query ({ caller }) func getStoryViewers(storyId : Nat) : async [UPMTypes.UserProfile] {
    let story = switch (stories.find(func(s : NewTypes.Story) : Bool { s.id == storyId })) {
      case (?s) s;
      case null Runtime.trap("Story not found");
    };
    if (story.authorId != caller) Runtime.trap("Not authorized");
    let result = List.empty<UPMTypes.UserProfile>();
    for (viewerId in story.views.values()) {
      switch (buildProfile(viewerId)) {
        case (?p) result.add(p);
        case null {};
      };
    };
    result.toArray();
  };

  // ─── Hashtags / Explore ───────────────────────────────────────────────────

  public shared query ({ caller }) func getHashtagPosts(hashtag : Text) : async [UPMTypes.PostView] {
    let tag = hashtag.toLower();
    let postIds = switch (hashtagIndex.get(tag)) {
      case null    { return [] };
      case (?list) { list.toArray() };
    };
    let myFollowing = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
    let result = List.empty<UPMTypes.Post>();
    for (postId in postIds.values()) {
      switch (posts.find(func(p : UPMTypes.Post) : Bool { p.id == postId })) {
        case null {};
        case (?post) {
          let isFollowing = myFollowing.contains(post.authorId);
          let isMutual    = isMutualFollowNew(caller, post.authorId);
          if (UPMLib.canViewPost(caller, post, isFollowing, isMutual)) {
            result.add(post);
          };
        };
      };
    };
    // Sort newest first, max 50
    let sorted = result.sort(func(a : UPMTypes.Post, b : UPMTypes.Post) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt);
    });
    let capped = if (sorted.size() > 50) sorted.sliceToArray(0, 50) else sorted.toArray();
    capped.map<UPMTypes.Post, UPMTypes.PostView>(func(p) { buildPostView(p, caller) });
  };

  public shared query ({ caller }) func getTrendingHashtags() : async [NewTypes.HashtagStat] {
    let sevenDaysNs : Int = 7 * 24 * 60 * 60 * 1_000_000_000;
    let cutoff = Time.now() - sevenDaysNs;
    let stats = List.empty<NewTypes.HashtagStat>();
    for ((tag, timings) in hashtagPostTime.entries()) {
      let recent = timings.filter(func(t : Common.Timestamp) : Bool { t >= cutoff }).size();
      if (recent > 0) {
        stats.add({ hashtag = tag; postCount = recent });
      };
    };
    let sorted = stats.sort(func(a : NewTypes.HashtagStat, b : NewTypes.HashtagStat) : { #less; #equal; #greater } {
      if (b.postCount > a.postCount) #less
      else if (b.postCount < a.postCount) #greater
      else #equal
    });
    let top10 = if (sorted.size() > 10) sorted.sliceToArray(0, 10) else sorted.toArray();
    top10;
  };

  public shared query ({ caller }) func searchContent(searchQuery : Text) : async NewTypes.SearchResults {
    let lower = searchQuery.toLower();
    // Search users by username
    let matchedUsers = List.empty<UPMTypes.UserProfile>();
    for ((uid, user) in users.entries()) {
      if (user.username.toLower().contains(#text lower)) {
        switch (buildProfile(uid)) {
          case (?p) matchedUsers.add(p);
          case null {};
        };
      };
    };
    // Search posts by hashtag or content match
    let myFollowing = switch (follows.get(caller)) { case (?s) s; case null Set.empty<Common.UserId>() };
    let matchedPosts = List.empty<UPMTypes.PostView>();
    for (post in posts.values()) {
      let contentMatch = post.content.toLower().contains(#text lower);
      let isFollowing  = myFollowing.contains(post.authorId);
      let isMutual     = isMutualFollowNew(caller, post.authorId);
      if (contentMatch and UPMLib.canViewPost(caller, post, isFollowing, isMutual)) {
        matchedPosts.add(buildPostView(post, caller));
      };
    };
    { users = matchedUsers.toArray(); posts = matchedPosts.toArray() };
  };

  // ─── Friend Requests ──────────────────────────────────────────────────────

  public shared ({ caller }) func sendFriendRequest(to : Common.UserId) : async Bool {
    if (caller == to) return false;
    switch (users.get(to)) { case null { return false }; case _ {} };
    // Check if blocked
    switch (blockedUsers.get(caller)) {
      case (?blocked) { if (blocked.contains(to)) return false };
      case null {};
    };
    switch (blockedUsers.get(to)) {
      case (?blocked) { if (blocked.contains(caller)) return false };
      case null {};
    };
    // Check if already friends (mutual follow)
    if (isMutualFollowNew(caller, to)) return false;
    // Check if pending request exists
    let existing = friendRequests.find(func(r : NewTypes.FriendRequest) : Bool {
      r.from == caller and r.to == to and r.status == #pending
    });
    switch (existing) { case (?_) { return false }; case null {} };
    let id  = nextFriendReqId.value;
    nextFriendReqId.value += 1;
    friendRequests.add(Lib.newFriendRequest(id, caller, to, Time.now()));
    // Notify recipient
    switch (users.get(caller)) {
      case (?callerUser) {
        EngLib.pushNotification(notifications, nextNotifId, to, caller,
          callerUser.username, #friendRequest { requestId = id }, Time.now());
      };
      case null {};
    };
    true;
  };

  public shared ({ caller }) func respondFriendRequest(requestId : Nat, action : NewTypes.RespondAction) : async Bool {
    var found = false;
    var fromUser : ?Common.UserId = null;
    friendRequests.mapInPlace(func(r : NewTypes.FriendRequest) : NewTypes.FriendRequest {
      if (r.id == requestId and r.to == caller and r.status == #pending) {
        found := true;
        fromUser := ?r.from;
        switch (action) {
          case (#accept)  { r.status := #accepted };
          case (#decline) { r.status := #declined };
          case (#block)   { r.status := #blocked };
        };
      };
      r;
    });
    if (not found) return false;
    switch (action) {
      case (#accept) {
        // Create mutual follow
        switch (fromUser) {
          case (?from) {
            let callerFollowing = switch (follows.get(caller)) {
              case (?s) s;
              case null { let s = Set.empty<Common.UserId>(); follows.add(caller, s); s };
            };
            callerFollowing.add(from);
            let fromFollowing = switch (follows.get(from)) {
              case (?s) s;
              case null { let s = Set.empty<Common.UserId>(); follows.add(from, s); s };
            };
            fromFollowing.add(caller);
          };
          case null {};
        };
      };
      case (#block) {
        switch (fromUser) {
          case (?from) {
            let myBlocked = switch (blockedUsers.get(caller)) {
              case (?s) s;
              case null { let s = Set.empty<Common.UserId>(); blockedUsers.add(caller, s); s };
            };
            myBlocked.add(from);
          };
          case null {};
        };
      };
      case (#decline) {};
    };
    true;
  };

  public shared ({ caller }) func cancelFriendRequest(requestId : Nat) : async Bool {
    var found = false;
    let filtered = friendRequests.filter(func(r : NewTypes.FriendRequest) : Bool {
      if (r.id == requestId and r.from == caller and r.status == #pending) {
        found := true;
        false; // remove it
      } else true;
    });
    if (not found) return false;
    friendRequests.clear();
    friendRequests.append(filtered);
    true;
  };

  public shared query ({ caller }) func getPendingRequests() : async [NewTypes.FriendRequestView] {
    let result = List.empty<NewTypes.FriendRequestView>();
    for (r in friendRequests.values()) {
      if (r.to == caller and r.status == #pending) {
        switch (buildProfile(r.from)) {
          case null {};
          case (?fromProfile) {
            switch (buildProfile(r.to)) {
              case null {};
              case (?toProfile) {
                result.add({
                  id        = r.id;
                  from      = fromProfile;
                  to        = toProfile;
                  status    = Lib.friendRequestStatusText(r.status);
                  createdAt = r.createdAt;
                });
              };
            };
          };
        };
      };
    };
    result.toArray();
  };

  public shared query ({ caller }) func getSentRequests() : async [NewTypes.FriendRequestView] {
    let result = List.empty<NewTypes.FriendRequestView>();
    for (r in friendRequests.values()) {
      if (r.from == caller and r.status == #pending) {
        switch (buildProfile(r.from)) {
          case null {};
          case (?fromProfile) {
            switch (buildProfile(r.to)) {
              case null {};
              case (?toProfile) {
                result.add({
                  id        = r.id;
                  from      = fromProfile;
                  to        = toProfile;
                  status    = Lib.friendRequestStatusText(r.status);
                  createdAt = r.createdAt;
                });
              };
            };
          };
        };
      };
    };
    result.toArray();
  };

  public shared query ({ caller }) func getFriendRequestStatus(userId : Common.UserId) : async Text {
    // Check block first
    switch (blockedUsers.get(caller)) {
      case (?blocked) { if (blocked.contains(userId)) return "blocked" };
      case null {};
    };
    switch (blockedUsers.get(userId)) {
      case (?blocked) { if (blocked.contains(caller)) return "blocked" };
      case null {};
    };
    if (isMutualFollowNew(caller, userId)) return "accepted";
    // Check request sent by caller
    switch (friendRequests.find(func(r : NewTypes.FriendRequest) : Bool {
      r.from == caller and r.to == userId
    })) {
      case (?r) { return Lib.friendRequestStatusText(r.status) };
      case null {};
    };
    // Check request sent to caller
    switch (friendRequests.find(func(r : NewTypes.FriendRequest) : Bool {
      r.from == userId and r.to == caller
    })) {
      case (?r) { return Lib.friendRequestStatusText(r.status) };
      case null {};
    };
    "none";
  };

  public shared ({ caller }) func blockUser(userId : Common.UserId) : async () {
    let myBlocked = switch (blockedUsers.get(caller)) {
      case (?s) s;
      case null { let s = Set.empty<Common.UserId>(); blockedUsers.add(caller, s); s };
    };
    myBlocked.add(userId);
    // Remove follow relationships
    switch (follows.get(caller)) {
      case (?s) s.remove(userId);
      case null {};
    };
    switch (follows.get(userId)) {
      case (?s) s.remove(caller);
      case null {};
    };
  };

  public shared ({ caller }) func unblockUser(userId : Common.UserId) : async () {
    switch (blockedUsers.get(caller)) {
      case null {};
      case (?s) s.remove(userId);
    };
  };

  public shared query ({ caller }) func isBlocked(userId : Common.UserId) : async Bool {
    switch (blockedUsers.get(caller)) {
      case null false;
      case (?s) s.contains(userId);
    };
  };

  // ─── About Section ────────────────────────────────────────────────────────

  public shared ({ caller }) func updateAbout(
    bio       : ?Text,
    location  : ?Text,
    work      : ?Text,
    education : ?Text,
    website   : ?Text,
  ) : async Bool {
    switch (users.get(caller)) {
      case null false;
      case (?user) {
        user.aboutBio       := bio;
        user.aboutLocation  := location;
        user.aboutWork      := work;
        user.aboutEducation := education;
        user.aboutWebsite   := website;
        true;
      };
    };
  };

  // ─── Pinned Posts ─────────────────────────────────────────────────────────

  public shared ({ caller }) func pinPost(postId : Common.PostId) : async Bool {
    // Verify post belongs to caller
    switch (posts.find(func(p : UPMTypes.Post) : Bool { p.id == postId })) {
      case null { return false };
      case (?post) {
        if (post.authorId != caller) return false;
      };
    };
    // Unpin previous pinned post if any
    switch (pinnedPosts.get(caller)) {
      case (?prevId) {
        posts.mapInPlace(func(p : UPMTypes.Post) : UPMTypes.Post {
          if (p.id == prevId) { p.isPinned := false };
          p;
        });
      };
      case null {};
    };
    pinnedPosts.add(caller, postId);
    posts.mapInPlace(func(p : UPMTypes.Post) : UPMTypes.Post {
      if (p.id == postId) { p.isPinned := true };
      p;
    });
    true;
  };

  public shared ({ caller }) func unpinPost() : async Bool {
    switch (pinnedPosts.get(caller)) {
      case null { return false };
      case (?postId) {
        posts.mapInPlace(func(p : UPMTypes.Post) : UPMTypes.Post {
          if (p.id == postId) { p.isPinned := false };
          p;
        });
        pinnedPosts.remove(caller);
        true;
      };
    };
  };

  // ─── Polls ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func createPoll(
    postId   : Common.PostId,
    question : Text,
    options  : [Text],
  ) : async Nat {
    if (options.size() < 2 or options.size() > 4) Runtime.trap("Polls require 2-4 options");
    let id = nextPollId.value;
    nextPollId.value += 1;
    polls.add(Lib.newPoll(id, postId, question, options, Time.now()));
    id;
  };

  public shared ({ caller }) func votePoll(pollId : Nat, optionId : Nat) : async Bool {
    let poll = switch (polls.find(func(p : NewTypes.Poll) : Bool { p.id == pollId })) {
      case (?p) p;
      case null { return false };
    };
    // Validate optionId
    let validOption = poll.options.find(func(o : NewTypes.PollOption) : Bool { o.id == optionId });
    switch (validOption) { case null { return false }; case _ {} };
    // Remove existing vote if any
    let filtered = pollVotes.filter(func(v : NewTypes.PollVote) : Bool {
      not (v.pollId == pollId and v.voter == caller)
    });
    pollVotes.clear();
    pollVotes.append(filtered);
    // Add new vote
    pollVotes.add({ pollId; optionId; voter = caller; createdAt = Time.now() });
    true;
  };

  public shared query ({ caller }) func getPollResults(pollId : Nat) : async NewTypes.PollResults {
    let poll = switch (polls.find(func(p : NewTypes.Poll) : Bool { p.id == pollId })) {
      case (?p) p;
      case null Runtime.trap("Poll not found");
    };
    Lib.getPollResults(poll, pollVotes, caller);
  };

  // ─── Message Reactions & Read Receipts ────────────────────────────────────

  public shared ({ caller }) func reactToMessage(
    messageId : Common.MessageId,
    reaction  : EngTypes.ReactionType,
  ) : async Bool {
    switch (messages.find(func(m : UPMTypes.Message) : Bool { m.id == messageId })) { case null { return false }; case _ {} };
    // Remove existing reaction from caller
    let filtered = msgReactions.filter(func(r : EngTypes.MessageReaction) : Bool {
      not (r.messageId == messageId and r.reactor == caller)
    });
    msgReactions.clear();
    msgReactions.append(filtered);
    msgReactions.add({ messageId; reactor = caller; reaction; createdAt = Time.now() });
    true;
  };

  public shared ({ caller }) func removeMessageReaction(messageId : Common.MessageId) : async Bool {
    let before = msgReactions.size();
    let filtered = msgReactions.filter(func(r : EngTypes.MessageReaction) : Bool {
      not (r.messageId == messageId and r.reactor == caller)
    });
    if (filtered.size() == before) return false;
    msgReactions.clear();
    msgReactions.append(filtered);
    true;
  };

  public shared query ({ caller }) func getMessageReactions(messageId : Common.MessageId) : async [NewTypes.MessageReactionView] {
    let result = List.empty<NewTypes.MessageReactionView>();
    for (r in msgReactions.values()) {
      if (r.messageId == messageId) {
        switch (buildProfile(r.reactor)) {
          case (?reactorProfile) {
            let reactionText = switch (r.reaction) {
              case (#like)  "like";
              case (#love)  "love";
              case (#haha)  "haha";
              case (#wow)   "wow";
              case (#sad)   "sad";
              case (#angry) "angry";
            };
            result.add({ reactor = reactorProfile; reaction = reactionText });
          };
          case null {};
        };
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func markMessageRead(messageId : Common.MessageId) : async () {
    messages.mapInPlace(func(m : UPMTypes.Message) : UPMTypes.Message {
      if (m.id == messageId) {
        let alreadyRead = m.readBy.any(func(u : Common.UserId) : Bool { u == caller });
        if (not alreadyRead) {
          m.readBy := m.readBy.concat([caller]);
        };
      };
      m;
    });
  };

  // ─── Admin Dashboard ──────────────────────────────────────────────────────

  public shared query ({ caller }) func getAdminStats() : async NewTypes.AdminStats {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    let pendingReports = reports.filter(func(r : EngTypes.Report) : Bool { r.status == #pending }).size();
    {
      totalUsers     = users.size();
      totalPosts     = posts.size();
      totalStories   = stories.size();
      totalMessages  = messages.size();
      verifiedUsers  = verified.size();
      pendingReports;
    };
  };

  public shared query ({ caller }) func getAllUsers(page : Nat, pageSize : Nat) : async [UPMTypes.UserProfile] {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    let allUsers = List.empty<UPMTypes.UserProfile>();
    for ((uid, _user) in users.entries()) {
      switch (buildProfile(uid)) {
        case (?p) allUsers.add(p);
        case null {};
      };
    };
    let sorted = allUsers.sort(func(a : UPMTypes.UserProfile, b : UPMTypes.UserProfile) : { #less; #equal; #greater } {
      // Sort by id text for determinism
      Text.compare(b.id.toText(), a.id.toText());
    });
    let start = page * pageSize;
    let total = sorted.size();
    if (start >= total) return [];
    let stop = if (start + pageSize > total) total else start + pageSize;
    sorted.sliceToArray(start, stop);
  };

  public shared ({ caller }) func grantVerification(userId : Common.UserId) : async Bool {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    switch (users.get(userId)) {
      case null { false };
      case (?user) {
        verified.add(userId);
        user.isVerified := true;
        EngLib.pushNotification(notifications, nextNotifId, userId, caller,
          "Zaren Veto", #verified {}, Time.now());
        true;
      };
    };
  };

  public shared ({ caller }) func revokeVerification(userId : Common.UserId) : async Bool {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    switch (users.get(userId)) {
      case null { false };
      case (?user) {
        verified.remove(userId);
        user.isVerified := false;
        true;
      };
    };
  };

  public shared query ({ caller }) func getReports(page : Nat, pageSize : Nat) : async [NewTypes.ReportView] {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    let all = List.empty<NewTypes.ReportView>();
    for (r in reports.values()) {
      let reporterProfile = switch (buildProfile(r.reporterId)) { case (?p) p; case null return [] };
      let reportedUser : ?UPMTypes.UserProfile = switch (r.target) {
        case (#user uid) buildProfile(uid);
        case (#post _)   null;
      };
      let reportedPost : ?UPMTypes.PostView = switch (r.target) {
        case (#post pid) {
          switch (posts.find(func(p : UPMTypes.Post) : Bool { p.id == pid })) {
            case (?p) ?buildPostView(p, caller);
            case null null;
          };
        };
        case (#user _) null;
      };
      let statusText = switch (r.status) {
        case (#pending)   "pending";
        case (#dismissed) "dismissed";
        case (#resolved)  "resolved";
      };
      all.add({
        id           = r.id;
        reporter     = reporterProfile;
        reportedUser;
        reportedPost;
        reason       = r.reason;
        status       = statusText;
        createdAt    = r.createdAt;
      });
    };
    let sorted = all.sort(func(a : NewTypes.ReportView, b : NewTypes.ReportView) : { #less; #equal; #greater } {
      Int.compare(b.createdAt, a.createdAt);
    });
    let start = page * pageSize;
    let total = sorted.size();
    if (start >= total) return [];
    let stop = if (start + pageSize > total) total else start + pageSize;
    sorted.sliceToArray(start, stop);
  };

  public shared ({ caller }) func resolveReport(reportId : Nat, action : NewTypes.ResolveAction) : async Bool {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    var found = false;
    reports.mapInPlace(func(r : EngTypes.Report) : EngTypes.Report {
      if (r.id == reportId) {
        found := true;
        switch (action) {
          case (#dismiss) { r.status := #dismissed };
          case (#deleteContent) {
            r.status := #resolved;
            // Delete post if target is a post
            switch (r.target) {
              case (#post pid) {
                let filtered = posts.filter(func(p : UPMTypes.Post) : Bool { p.id != pid });
                posts.clear();
                posts.append(filtered);
              };
              case (#user _) {};
            };
          };
          case (#suspendUser) {
            r.status := #resolved;
            // 24h suspension
            switch (r.target) {
              case (#user uid) {
                switch (users.get(uid)) {
                  case (?u) {
                    u.isSuspended    := true;
                    u.suspendedUntil := ?(Time.now() + 86_400_000_000_000);
                  };
                  case null {};
                };
              };
              case (#post _) {};
            };
          };
          case (#banUser) {
            r.status := #resolved;
            switch (r.target) {
              case (#user uid) {
                switch (users.get(uid)) {
                  case (?u) { u.isBanned := true };
                  case null {};
                };
              };
              case (#post _) {};
            };
          };
        };
      };
      r;
    });
    found;
  };

  public shared ({ caller }) func suspendUser(userId : Common.UserId, durationHours : Nat) : async Bool {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    switch (users.get(userId)) {
      case null { false };
      case (?user) {
        let durationNs : Int = durationHours * 3_600_000_000_000;
        user.isSuspended    := true;
        user.suspendedUntil := ?(Time.now() + durationNs);
        true;
      };
    };
  };

  public shared ({ caller }) func banUser(userId : Common.UserId) : async Bool {
    if (not isOwner(caller)) Runtime.trap("Not authorized");
    switch (users.get(userId)) {
      case null { false };
      case (?user) {
        user.isBanned := true;
        true;
      };
    };
  };
};
