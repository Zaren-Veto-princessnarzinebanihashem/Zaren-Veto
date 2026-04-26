import Common "../types/common";
import Types "../types/groups";
import Principal "mo:core/Principal";

module {
  /// Convert a Group to its shared GroupView projection.
  public func groupToView(group : Types.Group, callerId : Principal) : Types.GroupView {
    let members = group.members.list;
    let isMember = switch (members.find(func(m : Types.GroupMember) : Bool {
      Principal.equal(m.userId, callerId)
    })) {
      case (?_) true;
      case null false;
    };
    {
      id            = group.id;
      name          = group.name;
      description   = group.description;
      hasCoverImage = group.coverImageData != null;
      coverImageData = group.coverImageData;
      isPrivate     = group.isPrivate;
      ownerId       = group.ownerId;
      ownerUsername = group.ownerUsername;
      memberCount   = members.size();
      isMember;
      createdAt     = group.createdAt;
    };
  };
};
