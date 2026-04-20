import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Principal "mo:core/Principal";
import NewTypes "./types/users-posts-messages";
import NewEngTypes "./types/engagement";
import NewStoryTypes "./types/stories-hashtags-friendrequests-polls-admin";
import Common "./types/common";

/// Explicit migration: adds officialPageProfilePhotoUrl and officialPageCoverPhotoUrl
/// to every existing User record (both default to null).
module {

  // ── Old type definitions (copied inline from .old/src/backend/types/) ───────

  type OldVisibility = {
    #everyone;
    #followersOnly;
    #friendsOnly;
    #customList;
  };

  type OldUser = {
    id                : Common.UserId;
    var username      : Text;
    var bio           : Text;
    var visibility    : OldVisibility;
    var profilePhotoUrl : ?Text;
    var coverPhotoUrl   : ?Text;
    var isVerified    : Bool;
    var isSuspended   : Bool;
    var suspendedUntil : ?Common.Timestamp;
    var isBanned      : Bool;
    var passwordHash  : ?Text;
    var email         : ?Text;
    var aboutBio      : ?Text;
    var aboutLocation : ?Text;
    var aboutWork     : ?Text;
    var aboutEducation : ?Text;
    var aboutWebsite  : ?Text;
    var birthdate     : ?Text;
  };

  type OldPost = {
    id         : Common.PostId;
    authorId   : Common.UserId;
    authorName : Text;
    var content    : Text;
    visibility : OldVisibility;
    var customAllowList : [Common.UserId];
    createdAt  : Common.Timestamp;
    var updatedAt  : Common.Timestamp;
    var isPinned   : Bool;
    var imageUrl   : ?Text;
  };

  type OldMessage = {
    id               : Common.MessageId;
    conversationId   : Common.ConversationId;
    senderId         : Common.UserId;
    encryptedContent : Blob;
    createdAt        : Common.Timestamp;
    var readBy       : [Common.UserId];
  };

  // ── Old state record (must match previous actor's stable field names/types) ──

  type OldActor = {
    users             : Map.Map<Common.UserId, OldUser>;
    posts             : List.List<OldPost>;
    messages          : List.List<OldMessage>;
    follows           : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    verified          : Set.Set<Common.UserId>;
    nextPostId        : { var value : Nat };
    nextMessageId     : { var value : Nat };
    hashtagIndex      : Map.Map<Text, List.List<Common.PostId>>;
    hashtagPostTime   : Map.Map<Text, List.List<Common.Timestamp>>;
    officialPagePosts : List.List<OldPost>;
    likes             : Map.Map<Common.PostId, Set.Set<Common.UserId>>;
    reactions         : Map.Map<Common.PostId, Map.Map<Common.UserId, NewEngTypes.ReactionType>>;
    comments          : List.List<NewEngTypes.Comment>;
    shares            : List.List<NewEngTypes.Share>;
    notifications     : List.List<NewEngTypes.Notification>;
    savedPosts        : Map.Map<Common.UserId, Set.Set<Common.PostId>>;
    reports           : List.List<NewEngTypes.Report>;
    nextCommentId     : { var value : Nat };
    nextNotifId       : { var value : Nat };
    nextReportId      : { var value : Nat };
    stories           : List.List<NewStoryTypes.Story>;
    nextStoryId       : { var value : Nat };
    friendRequests    : List.List<NewStoryTypes.FriendRequest>;
    nextFriendReqId   : { var value : Nat };
    blockedUsers      : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    pinnedPosts       : Map.Map<Common.UserId, Common.PostId>;
    polls             : List.List<NewStoryTypes.Poll>;
    pollVotes         : List.List<NewStoryTypes.PollVote>;
    nextPollId        : { var value : Nat };
    msgReactions      : List.List<NewEngTypes.MessageReaction>;
  };

  // ── New state record ─────────────────────────────────────────────────────────

  type NewActor = {
    users             : Map.Map<Common.UserId, NewTypes.User>;
    posts             : List.List<NewTypes.Post>;
    messages          : List.List<NewTypes.Message>;
    follows           : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    verified          : Set.Set<Common.UserId>;
    nextPostId        : { var value : Nat };
    nextMessageId     : { var value : Nat };
    hashtagIndex      : Map.Map<Text, List.List<Common.PostId>>;
    hashtagPostTime   : Map.Map<Text, List.List<Common.Timestamp>>;
    officialPagePosts : List.List<NewTypes.Post>;
    likes             : Map.Map<Common.PostId, Set.Set<Common.UserId>>;
    reactions         : Map.Map<Common.PostId, Map.Map<Common.UserId, NewEngTypes.ReactionType>>;
    comments          : List.List<NewEngTypes.Comment>;
    shares            : List.List<NewEngTypes.Share>;
    notifications     : List.List<NewEngTypes.Notification>;
    savedPosts        : Map.Map<Common.UserId, Set.Set<Common.PostId>>;
    reports           : List.List<NewEngTypes.Report>;
    nextCommentId     : { var value : Nat };
    nextNotifId       : { var value : Nat };
    nextReportId      : { var value : Nat };
    stories           : List.List<NewStoryTypes.Story>;
    nextStoryId       : { var value : Nat };
    friendRequests    : List.List<NewStoryTypes.FriendRequest>;
    nextFriendReqId   : { var value : Nat };
    blockedUsers      : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    pinnedPosts       : Map.Map<Common.UserId, Common.PostId>;
    polls             : List.List<NewStoryTypes.Poll>;
    pollVotes         : List.List<NewStoryTypes.PollVote>;
    nextPollId        : { var value : Nat };
    msgReactions      : List.List<NewEngTypes.MessageReaction>;
  };

  // ── Migration function ───────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate each user: add the two new optional photo fields defaulting to null.
    // Record spread with `with` does not work on records containing var fields,
    // so fields are copied explicitly.
    let users = old.users.map<Common.UserId, OldUser, NewTypes.User>(
      func(_id, u) {
        {
          id                              = u.id;
          var username                    = u.username;
          var bio                         = u.bio;
          var visibility                  = u.visibility;
          var profilePhotoUrl             = u.profilePhotoUrl;
          var coverPhotoUrl               = u.coverPhotoUrl;
          var officialPageProfilePhotoUrl = null : ?Text;
          var officialPageCoverPhotoUrl   = null : ?Text;
          var isVerified                  = u.isVerified;
          var isSuspended                 = u.isSuspended;
          var suspendedUntil              = u.suspendedUntil;
          var isBanned                    = u.isBanned;
          var passwordHash                = u.passwordHash;
          var email                       = u.email;
          var aboutBio                    = u.aboutBio;
          var aboutLocation               = u.aboutLocation;
          var aboutWork                   = u.aboutWork;
          var aboutEducation              = u.aboutEducation;
          var aboutWebsite                = u.aboutWebsite;
          var birthdate                   = u.birthdate;
        }
      }
    );

    {
      users;
      posts             = old.posts;
      messages          = old.messages;
      follows           = old.follows;
      verified          = old.verified;
      nextPostId        = old.nextPostId;
      nextMessageId     = old.nextMessageId;
      hashtagIndex      = old.hashtagIndex;
      hashtagPostTime   = old.hashtagPostTime;
      officialPagePosts = old.officialPagePosts;
      likes             = old.likes;
      reactions         = old.reactions;
      comments          = old.comments;
      shares            = old.shares;
      notifications     = old.notifications;
      savedPosts        = old.savedPosts;
      reports           = old.reports;
      nextCommentId     = old.nextCommentId;
      nextNotifId       = old.nextNotifId;
      nextReportId      = old.nextReportId;
      stories           = old.stories;
      nextStoryId       = old.nextStoryId;
      friendRequests    = old.friendRequests;
      nextFriendReqId   = old.nextFriendReqId;
      blockedUsers      = old.blockedUsers;
      pinnedPosts       = old.pinnedPosts;
      polls             = old.polls;
      pollVotes         = old.pollVotes;
      nextPollId        = old.nextPollId;
      msgReactions      = old.msgReactions;
    };
  };
};
