/// Migration: adds `isRepost` and `originalPostId` fields to Post records
/// in `posts` and `officialPagePosts` lists.
import List "mo:core/Map";
import NewTypes "types/users-posts-messages";
import List2 "mo:core/List";
import Principal "mo:core/Principal";

module {
  // ── Old inline types (copied from .old/src/backend/types) ─────────────────

  type UserId    = Principal;
  type PostId    = Nat;
  type Timestamp = Int;

  type Visibility = {
    #everyone;
    #followersOnly;
    #friendsOnly;
    #customList;
  };

  type OldPost = {
    id         : PostId;
    authorId   : UserId;
    authorName : Text;
    var content    : Text;
    visibility : Visibility;
    var customAllowList : [UserId];
    createdAt  : Timestamp;
    var updatedAt  : Timestamp;
    var isPinned   : Bool;
    var imageUrl   : ?Text;
  };

  // ── Migration types ────────────────────────────────────────────────────────

  type OldActor = {
    posts             : List2.List<OldPost>;
    officialPagePosts : List2.List<OldPost>;
  };

  type NewPost = NewTypes.Post;

  type NewActor = {
    posts             : List2.List<NewPost>;
    officialPagePosts : List2.List<NewPost>;
  };

  // ── Migration function ─────────────────────────────────────────────────────

  func migratePost(old : OldPost) : NewPost {
    {
      id             = old.id;
      authorId       = old.authorId;
      authorName     = old.authorName;
      var content    = old.content;
      visibility     = old.visibility;
      var customAllowList = old.customAllowList;
      createdAt      = old.createdAt;
      var updatedAt  = old.updatedAt;
      var isPinned   = old.isPinned;
      var imageUrl   = old.imageUrl;
      var isRepost       = false;
      var originalPostId = null;
    };
  };

  public func run(old : OldActor) : NewActor {
    let posts             = old.posts.map<OldPost, NewPost>(migratePost);
    let officialPagePosts = old.officialPagePosts.map<OldPost, NewPost>(migratePost);
    { posts; officialPagePosts };
  };
};
