import Common "../types/common";
import Types "../types/stories-hashtags-friendrequests-polls-admin";
import UPMTypes "../types/users-posts-messages";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";

module {

  // ─── Story helpers ─────────────────────────────────────────────────────────

  let STORY_TTL : Int = 86_400_000_000_000; // 24 hours in nanoseconds

  public func newStory(
    id          : Types.StoryId,
    author      : Common.UserId,
    imageUrl    : Text,
    textOverlay : ?Text,
    now         : Common.Timestamp,
  ) : Types.Story {
    {
      id;
      authorId    = author;
      imageUrl;
      textOverlay;
      createdAt   = now;
      expiresAt   = now + STORY_TTL;
      var views   = [];
      var isDeleted = false;
    };
  };

  public func toStoryView(
    story      : Types.Story,
    author     : UPMTypes.UserProfile,
    caller     : Common.UserId,
    now        : Common.Timestamp,
  ) : ?Types.StoryView {
    if (story.isDeleted or now > story.expiresAt) return null;
    let viewedByMe = story.views.any(func(v : Common.UserId) : Bool { v == caller });
    ?{
      id          = story.id;
      author;
      imageUrl    = story.imageUrl;
      textOverlay = story.textOverlay;
      createdAt   = story.createdAt;
      expiresAt   = story.expiresAt;
      viewCount   = story.views.size();
      viewedByMe;
    };
  };

  public func markViewed(
    stories  : List.List<Types.Story>,
    storyId  : Types.StoryId,
    caller   : Common.UserId,
  ) {
    stories.mapInPlace(func(s : Types.Story) : Types.Story {
      if (s.id == storyId and not s.isDeleted) {
        let alreadySeen = s.views.any(func(v : Common.UserId) : Bool { v == caller });
        if (not alreadySeen) {
          s.views := s.views.concat([caller]);
        };
      };
      s;
    });
  };

  // ─── Hashtag helpers ───────────────────────────────────────────────────────

  /// Extract all #hashtag tokens from post content (lowercase, no '#').
  public func extractHashtags(content : Text) : [Text] {
    let words = content.split(#char ' ');
    let tags = List.empty<Text>();
    for (word in words) {
      if (word.startsWith(#char '#') and word.size() > 1) {
        // Strip leading '#' and lowercase
        let tag = word.trimStart(#char '#').toLower();
        if (tag.size() > 0) {
          tags.add(tag);
        };
      };
    };
    tags.toArray();
  };

  /// Index hashtags extracted from a post into the hashtag map.
  public func indexHashtags(
    hashtagIndex : Map.Map<Text, List.List<Common.PostId>>,
    postId       : Common.PostId,
    content      : Text,
    now          : Common.Timestamp,
    hashtagPostTime : Map.Map<Text, List.List<Common.Timestamp>>,
  ) {
    let tags = extractHashtags(content);
    for (tag in tags.values()) {
      let postList = switch (hashtagIndex.get(tag)) {
        case (?l) l;
        case null {
          let l = List.empty<Common.PostId>();
          hashtagIndex.add(tag, l);
          l;
        };
      };
      // Avoid duplicate entries
      if (not postList.contains(postId)) {
        postList.add(postId);
      };
      // Track timestamps for trending
      let timeList = switch (hashtagPostTime.get(tag)) {
        case (?l) l;
        case null {
          let l = List.empty<Common.Timestamp>();
          hashtagPostTime.add(tag, l);
          l;
        };
      };
      timeList.add(now);
    };
  };

  /// Remove a post's hashtag entries (called on deletePost).
  public func removeHashtagEntries(
    hashtagIndex : Map.Map<Text, List.List<Common.PostId>>,
    postId       : Common.PostId,
    content      : Text,
  ) {
    let tags = extractHashtags(content);
    for (tag in tags.values()) {
      switch (hashtagIndex.get(tag)) {
        case null {};
        case (?postList) {
          let filtered = postList.filter(func(pid : Common.PostId) : Bool { pid != postId });
          postList.clear();
          postList.append(filtered);
        };
      };
    };
  };

  // ─── Friend request helpers ────────────────────────────────────────────────

  public func newFriendRequest(
    id    : Types.FriendRequestId,
    from  : Common.UserId,
    to    : Common.UserId,
    now   : Common.Timestamp,
  ) : Types.FriendRequest {
    { id; from; to; var status = #pending; createdAt = now };
  };

  public func friendRequestStatusText(s : Types.FriendRequestStatus) : Text {
    switch (s) {
      case (#pending)  "pending";
      case (#accepted) "accepted";
      case (#declined) "declined";
      case (#blocked)  "blocked";
    };
  };

  // ─── Poll helpers ──────────────────────────────────────────────────────────

  public func newPoll(
    id       : Types.PollId,
    postId   : Common.PostId,
    question : Text,
    optTexts : [Text],
    now      : Common.Timestamp,
  ) : Types.Poll {
    let options = optTexts.mapEntries(func(t, i) {
      { id = i; text = t };
    });
    { id; postId; question; options; createdAt = now };
  };

  public func getPollResults(
    poll   : Types.Poll,
    votes  : List.List<Types.PollVote>,
    caller : Common.UserId,
  ) : Types.PollResults {
    let pollVotes = votes.filter(func(v : Types.PollVote) : Bool { v.pollId == poll.id });
    let total = pollVotes.size();
    let myVoteOpt = pollVotes.find(func(v : Types.PollVote) : Bool {
      v.voter == caller
    });
    let myVote : ?Nat = switch (myVoteOpt) { case (?v) ?v.optionId; case null null };
    let optResults = poll.options.map(func(opt : Types.PollOption) : Types.PollOptionResult {
      let count = pollVotes.filter(func(v : Types.PollVote) : Bool { v.optionId == opt.id }).size();
      let percent : Float = if (total == 0) 0.0 else count.toFloat() / total.toFloat() * 100.0;
      { id = opt.id; text = opt.text; votes = count; percent };
    });
    { options = optResults; totalVotes = total; myVote };
  };

  public func toPollSummary(
    poll   : Types.Poll,
    votes  : List.List<Types.PollVote>,
    caller : Common.UserId,
  ) : Types.PollSummary {
    let pollVotes = votes.filter(func(v : Types.PollVote) : Bool { v.pollId == poll.id });
    let myVoteOpt = pollVotes.find(func(v : Types.PollVote) : Bool { v.voter == caller });
    let myVote : ?Nat = switch (myVoteOpt) { case (?v) ?v.optionId; case null null };
    {
      pollId     = poll.id;
      question   = poll.question;
      options    = poll.options;
      totalVotes = pollVotes.size();
      myVote;
    };
  };
};
