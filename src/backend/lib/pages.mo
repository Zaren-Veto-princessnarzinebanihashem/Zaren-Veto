import Common "../types/common";
import Types "../types/pages";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

module {
  /// Convert a Page to its shared PageView projection.
  public func pageToView(
    page       : Types.Page,
    callerId   : Principal,
    pageFollowers : Map.Map<Types.PageId, Set.Set<Common.UserId>>,
  ) : Types.PageView {
    let isFollowing = switch (pageFollowers.get(page.id)) {
      case null { false };
      case (?followers) { followers.contains(callerId) };
    };
    let followerCount = switch (pageFollowers.get(page.id)) {
      case null { 0 };
      case (?followers) { followers.size() };
    };
    {
      id             = page.id;
      ownerId        = page.ownerId;
      name           = page.name;
      description    = page.description;
      category       = page.category;
      profilePhotoUrl = page.profilePhotoUrl;
      coverPhotoUrl   = page.coverPhotoUrl;
      followerCount;
      createdAt      = page.createdAt;
      isVerified     = page.isVerified;
      isFollowing;
    };
  };
};
