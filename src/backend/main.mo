import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
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
import Migration "migration";

(with migration = Migration.run)
actor {
  // ─── Users / Posts / Messages state ──────────────────────────────────────
  let users         : Map.Map<Common.UserId, Types.User>                   = Map.empty();
  let posts         : List.List<Types.Post>                                = List.empty();
  let messages      : List.List<Types.Message>                             = List.empty();
  let follows       : Map.Map<Common.UserId, Set.Set<Common.UserId>>       = Map.empty();
  let verified      : Set.Set<Common.UserId>                               = Set.empty();
  let nextPostId    : { var value : Nat }                                  = { var value = 0 };
  let nextMessageId : { var value : Nat }                                  = { var value = 0 };

  // ─── Hashtag index (shared with UPMApi and NewApi) ────────────────────────
  let hashtagIndex    : Map.Map<Text, List.List<Common.PostId>>            = Map.empty();
  let hashtagPostTime : Map.Map<Text, List.List<Common.Timestamp>>         = Map.empty();

  // ─── Official page posts ──────────────────────────────────────────────────
  let officialPagePosts : List.List<Types.Post>                            = List.empty();

  // ─── Followers reverse index (who follows userId) — avoids O(n) full scan ──
  let followers     : Map.Map<Common.UserId, List.List<Common.UserId>>                            = Map.empty();

  // ─── Engagement state ─────────────────────────────────────────────────────
  let likes         : Map.Map<Common.PostId, Set.Set<Common.UserId>>                              = Map.empty();
  let reactions     : Map.Map<Common.PostId, Map.Map<Common.UserId, EngTypes.ReactionType>>       = Map.empty();
  let comments      : List.List<EngTypes.Comment>                                                 = List.empty();
  let shares        : List.List<EngTypes.Share>                                                   = List.empty();
  let notifications : List.List<EngTypes.Notification>                                            = List.empty();
  let savedPosts    : Map.Map<Common.UserId, Set.Set<Common.PostId>>                              = Map.empty();
  let reports       : List.List<EngTypes.Report>                                                  = List.empty();
  let nextCommentId : { var value : Nat }                                                         = { var value = 0 };
  let nextNotifId   : { var value : Nat }                                                         = { var value = 0 };
  let nextReportId  : { var value : Nat }                                                         = { var value = 0 };

  // ─── Post-comments index (postId → [commentId]) — avoids O(n) full scan ──
  let postCommentsIndex : Map.Map<Common.PostId, List.List<EngTypes.CommentId>>                   = Map.empty();

  // ─── Stories state ────────────────────────────────────────────────────────
  let stories       : List.List<NewTypes.Story>                            = List.empty();
  let nextStoryId   : { var value : Nat }                                  = { var value = 0 };

  // ─── Friend requests / block state ────────────────────────────────────────
  let friendRequests  : List.List<NewTypes.FriendRequest>                  = List.empty();
  let nextFriendReqId : { var value : Nat }                                = { var value = 0 };
  let blockedUsers    : Map.Map<Common.UserId, Set.Set<Common.UserId>>     = Map.empty();

  // ─── Pinned posts ─────────────────────────────────────────────────────────
  let pinnedPosts   : Map.Map<Common.UserId, Common.PostId>                = Map.empty();

  // ─── Polls state ──────────────────────────────────────────────────────────
  let polls         : List.List<NewTypes.Poll>                             = List.empty();
  let pollVotes     : List.List<NewTypes.PollVote>                         = List.empty();
  let nextPollId    : { var value : Nat }                                  = { var value = 0 };

  // ─── Message reactions ────────────────────────────────────────────────────
  let msgReactions  : List.List<EngTypes.MessageReaction>                  = List.empty();

  // ─── Groups state ────────────────────────────────────────────────────────
  let groups        : Map.Map<GroupTypes.GroupId, GroupTypes.Group>        = Map.empty();
  let nextGroupId   : { var value : Nat }                                  = { var value = 0 };

  // ─── Pages state ─────────────────────────────────────────────────────────
  let pages          : Map.Map<PageTypes.PageId, PageTypes.Page>                    = Map.empty();
  let pageFollowers  : Map.Map<PageTypes.PageId, Set.Set<Common.UserId>>            = Map.empty();
  let pagePosts      : Map.Map<PageTypes.PageId, List.List<Types.Post>>             = Map.empty();
  let nextPageId     : { var value : Nat }                                          = { var value = 0 };
  let nextPagePostId : { var value : Nat }                                          = { var value = 0 };

  // ─── Mixin composition ────────────────────────────────────────────────────
  include UPMApi(users, posts, messages, follows, followers, verified, nextPostId, nextMessageId,
                 hashtagIndex, hashtagPostTime, officialPagePosts);

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
  );

  include GroupsApi(groups, nextGroupId, users);

  include PagesApi(pages, pageFollowers, pagePosts, nextPageId, nextPagePostId, users);
};
