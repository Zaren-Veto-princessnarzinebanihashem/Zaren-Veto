import Common "../types/common";
import PageTypes "../types/pages";
import UPMTypes "../types/users-posts-messages";
import UPMLib "../lib/users-posts-messages";
import Lib "../lib/pages";
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

/// Mixin exposing public endpoints for user-created Pages (Facebook-style).
mixin (
  pages          : Map.Map<PageTypes.PageId, PageTypes.Page>,
  pageFollowers  : Map.Map<PageTypes.PageId, Set.Set<Common.UserId>>,
  pagePosts      : Map.Map<PageTypes.PageId, List.List<UPMTypes.Post>>,
  nextPageId     : { var value : Nat },
  nextPagePostId : { var value : Nat },
  users          : Map.Map<Common.UserId, UPMTypes.User>,
) {

  // ─── Create ───────────────────────────────────────────────────────────────

  /// Create a new Page for the calling user.
  public shared ({ caller }) func createPage(
    name        : Text,
    description : Text,
    category    : Text,
  ) : async { #ok : PageTypes.PageView; #err : Text } {
    if (caller.isAnonymous()) return #err("Must be logged in to create a page");
    if (name.size() == 0) return #err("Page name cannot be empty");
    switch (users.get(caller)) {
      case null return #err("User not registered");
      case (?_) {};
    };
    let id  = nextPageId.value;
    nextPageId.value += 1;
    let now = Time.now();
    let page : PageTypes.Page = {
      id;
      ownerId        = caller;
      var name;
      var description;
      var category;
      var profilePhotoUrl = null;
      var coverPhotoUrl   = null;
      var followerCount   = 0;
      createdAt      = now;
      var isVerified = false;
    };
    pages.add(id, page);
    let fs = Set.empty<Common.UserId>();
    pageFollowers.add(id, fs);
    let pl = List.empty<UPMTypes.Post>();
    pagePosts.add(id, pl);
    #ok(Lib.pageToView(page, caller, pageFollowers));
  };

  // ─── Read ─────────────────────────────────────────────────────────────────

  /// Get a single page by ID.
  public shared query ({ caller }) func getPage(pageId : PageTypes.PageId) : async ?PageTypes.PageView {
    switch (pages.get(pageId)) {
      case null null;
      case (?page) ?Lib.pageToView(page, caller, pageFollowers);
    };
  };

  /// Get all pages owned by the caller.
  public shared query ({ caller }) func getMyPages() : async [PageTypes.PageView] {
    let result = List.empty<PageTypes.PageView>();
    for ((_, page) in pages.entries()) {
      if (Principal.equal(page.ownerId, caller)) {
        result.add(Lib.pageToView(page, caller, pageFollowers));
      };
    };
    result.toArray();
  };

  /// Search pages by name (case-insensitive, max 20 results).
  public shared query ({ caller }) func searchPages(searchTerm : Text) : async [PageTypes.PageView] {
    let lower = searchTerm.toLower();
    let result = List.empty<PageTypes.PageView>();
    for ((_, page) in pages.entries()) {
      if (result.size() >= 20) return result.toArray();
      if (page.name.toLower().contains(#text lower)) {
        result.add(Lib.pageToView(page, caller, pageFollowers));
      };
    };
    result.toArray();
  };

  // ─── Follow / Unfollow ────────────────────────────────────────────────────

  public shared ({ caller }) func followPage(pageId : PageTypes.PageId) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Must be logged in");
    switch (pages.get(pageId)) {
      case null { #err("Page not found") };
      case (?_page) {
        let fs = switch (pageFollowers.get(pageId)) {
          case (?s) s;
          case null {
            let s = Set.empty<Common.UserId>();
            pageFollowers.add(pageId, s);
            s;
          };
        };
        fs.add(caller);
        #ok;
      };
    };
  };

  public shared ({ caller }) func unfollowPage(pageId : PageTypes.PageId) : async { #ok; #err : Text } {
    if (caller.isAnonymous()) return #err("Must be logged in");
    switch (pageFollowers.get(pageId)) {
      case null { #err("Not following this page") };
      case (?fs) {
        fs.remove(caller);
        #ok;
      };
    };
  };

  // ─── Update ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func updatePage(
    pageId      : PageTypes.PageId,
    name        : Text,
    description : Text,
  ) : async { #ok : PageTypes.PageView; #err : Text } {
    switch (pages.get(pageId)) {
      case null { #err("Page not found") };
      case (?page) {
        if (not Principal.equal(page.ownerId, caller)) {
          return #err("Only the page owner can update this page");
        };
        if (name.size() > 0) { page.name := name };
        page.description := description;
        #ok(Lib.pageToView(page, caller, pageFollowers));
      };
    };
  };

  public shared ({ caller }) func updatePageProfilePhoto(pageId : PageTypes.PageId, imageUrl : Text) : async { #ok; #err : Text } {
    switch (pages.get(pageId)) {
      case null { #err("Page not found") };
      case (?page) {
        if (not Principal.equal(page.ownerId, caller)) return #err("Only the page owner can update photos");
        page.profilePhotoUrl := ?imageUrl;
        #ok;
      };
    };
  };

  public shared ({ caller }) func updatePageCoverPhoto(pageId : PageTypes.PageId, imageUrl : Text) : async { #ok; #err : Text } {
    switch (pages.get(pageId)) {
      case null { #err("Page not found") };
      case (?page) {
        if (not Principal.equal(page.ownerId, caller)) return #err("Only the page owner can update photos");
        page.coverPhotoUrl := ?imageUrl;
        #ok;
      };
    };
  };

  // ─── Page posts ───────────────────────────────────────────────────────────

  public shared ({ caller }) func createPagePost(pageId : PageTypes.PageId, content : Text) : async { #ok : UPMTypes.PostView; #err : Text } {
    switch (pages.get(pageId)) {
      case null { #err("Page not found") };
      case (?page) {
        if (not Principal.equal(page.ownerId, caller)) {
          return #err("Only the page owner can post on this page");
        };
        switch (users.get(caller)) {
          case null { #err("User not registered") };
          case (?user) {
            let id  = nextPagePostId.value;
            nextPagePostId.value += 1;
            let now = Time.now();
            let post = UPMLib.newPost(id, user, content, #everyone, [], null, now);
            let pl = switch (pagePosts.get(pageId)) {
              case (?lst) lst;
              case null {
                let lst = List.empty<UPMTypes.Post>();
                pagePosts.add(pageId, lst);
                lst;
              };
            };
            pl.add(post);
            #ok(UPMLib.toPostView(post, user.isVerified, user.profilePhotoUrl));
          };
        };
      };
    };
  };

  public shared query ({ caller }) func getPagePosts(pageId : PageTypes.PageId) : async [UPMTypes.PostView] {
    switch (pagePosts.get(pageId)) {
      case null { [] };
      case (?pl) {
        let sorted = pl.sort(func(a : UPMTypes.Post, b : UPMTypes.Post) : { #less; #equal; #greater } {
          Int.compare(b.createdAt, a.createdAt);
        });
        let sz = sorted.size();
        let limit = if (sz > 50) 50 else sz;
        sorted.sliceToArray(0, limit).map<UPMTypes.Post, UPMTypes.PostView>(func(p) {
          let (av, ap) = switch (users.get(p.authorId)) {
            case (?u) (u.isVerified, u.profilePhotoUrl);
            case null (false, null);
          };
          UPMLib.toPostView(p, av, ap);
        });
      };
    };
  };
};
