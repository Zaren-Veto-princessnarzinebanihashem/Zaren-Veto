import Common "common";

module {
  public type PageId = Nat;

  public type Page = {
    id             : PageId;
    ownerId        : Common.UserId;
    var name       : Text;
    var description : Text;
    var category   : Text; // e.g. "Business", "Artist", "Community"
    var profilePhotoUrl : ?Text;
    var coverPhotoUrl   : ?Text;
    var followerCount   : Nat;
    createdAt      : Common.Timestamp;
    var isVerified : Bool;
  };

  public type PageView = {
    id             : PageId;
    ownerId        : Common.UserId;
    name           : Text;
    description    : Text;
    category       : Text;
    profilePhotoUrl : ?Text;
    coverPhotoUrl   : ?Text;
    followerCount   : Nat;
    createdAt      : Common.Timestamp;
    isVerified     : Bool;
    isFollowing    : Bool;
  };
};
