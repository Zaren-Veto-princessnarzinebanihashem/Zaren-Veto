import Common "common";

module {
  public type GroupId = Nat;

  public type GroupMember = {
    userId   : Common.UserId;
    username : Text;
    joinedAt : Common.Timestamp;
  };

  public type Group = {
    id           : GroupId;
    var name     : Text;
    var description : Text;
    var coverImageData : ?Text; // base64 encoded cover image
    var isPrivate : Bool;
    ownerId      : Common.UserId;
    ownerUsername : Text;
    members      : { var list : [GroupMember] }; // mutable member list
    createdAt    : Common.Timestamp;
  };

  public type GroupView = {
    id           : GroupId;
    name         : Text;
    description  : Text;
    hasCoverImage : Bool;
    coverImageData : ?Text;
    isPrivate    : Bool;
    ownerId      : Common.UserId;
    ownerUsername : Text;
    memberCount  : Nat;
    isMember     : Bool;
    createdAt    : Common.Timestamp;
  };

  public type CreateGroupResult  = { #ok : GroupView; #err : Text };
  public type JoinLeaveGroupResult = { #ok : Bool; #err : Text };
};
