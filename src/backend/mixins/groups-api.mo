import Common "../types/common";
import Types "../types/groups";
import UPMTypes "../types/users-posts-messages";
import Lib "../lib/groups";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

/// Mixin exposing all public group endpoints.
/// State slices are injected at construction time from main.mo.
mixin (
  groups     : Map.Map<Types.GroupId, Types.Group>,
  nextGroupId : { var value : Nat },
  // Users map needed to look up usernames for invite
  users      : Map.Map<Common.UserId, UPMTypes.User>,
) {

  // ─── Create ───────────────────────────────────────────────────────────────

  /// Create a new group. Caller must be authenticated.
  /// Returns the GroupView of the created group.
  public shared ({ caller }) func createGroup(
    name          : Text,
    description   : Text,
    isPrivate     : Bool,
    coverImageData : ?Text,
  ) : async Types.CreateGroupResult {
    if (caller.isAnonymous()) return #err("Must be logged in to create a group");
    if (name.size() == 0) return #err("Group name cannot be empty");

    // Resolve caller's username
    let ownerUsername = switch (users.get(caller)) {
      case (?u) u.username;
      case null return #err("User not registered");
    };

    let id = nextGroupId.value;
    nextGroupId.value += 1;
    let now = Time.now();

    let creatorMember : Types.GroupMember = {
      userId   = caller;
      username = ownerUsername;
      joinedAt = now;
    };

    let group : Types.Group = {
      id;
      var name;
      var description;
      var coverImageData;
      var isPrivate;
      ownerId       = caller;
      ownerUsername;
      members       = { var list = [creatorMember] };
      createdAt     = now;
    };

    groups.add(id, group);
    #ok(Lib.groupToView(group, caller));
  };

  // ─── Read ─────────────────────────────────────────────────────────────────

  /// Return all groups, with isMember flag for the caller.
  public shared query ({ caller }) func getGroups() : async [Types.GroupView] {
    let result = List.empty<Types.GroupView>();
    for ((_, group) in groups.entries()) {
      result.add(Lib.groupToView(group, caller));
    };
    result.toArray();
  };

  /// Return only the groups the caller is a member of.
  public shared query ({ caller }) func getMyGroups() : async [Types.GroupView] {
    let result = List.empty<Types.GroupView>();
    for ((_, group) in groups.entries()) {
      let view = Lib.groupToView(group, caller);
      if (view.isMember) {
        result.add(view);
      };
    };
    result.toArray();
  };

  /// Get a single group by ID.
  public shared query ({ caller }) func getGroup(groupId : Types.GroupId) : async ?Types.GroupView {
    switch (groups.get(groupId)) {
      case null null;
      case (?g) ?Lib.groupToView(g, caller);
    };
  };

  // ─── Join / Leave ─────────────────────────────────────────────────────────

  /// Join a group as the calling user.
  public shared ({ caller }) func joinGroup(groupId : Types.GroupId) : async Types.JoinLeaveGroupResult {
    if (caller.isAnonymous()) return #err("Must be logged in to join a group");
    switch (groups.get(groupId)) {
      case null { #err("Group not found") };
      case (?group) {
        let existing = group.members.list.find(func(m : Types.GroupMember) : Bool {
          Principal.equal(m.userId, caller)
        });
        if (existing != null) return #err("Already a member of this group");
        let username = switch (users.get(caller)) {
          case (?u) u.username;
          case null return #err("User not registered");
        };
        let newMember : Types.GroupMember = {
          userId   = caller;
          username;
          joinedAt = Time.now();
        };
        group.members.list := group.members.list.concat([newMember]);
        #ok(true);
      };
    };
  };

  /// Leave a group. The owner cannot leave (must delete instead).
  public shared ({ caller }) func leaveGroup(groupId : Types.GroupId) : async Types.JoinLeaveGroupResult {
    if (caller.isAnonymous()) return #err("Must be logged in to leave a group");
    switch (groups.get(groupId)) {
      case null { #err("Group not found") };
      case (?group) {
        if (Principal.equal(group.ownerId, caller)) {
          return #err("Group owner cannot leave — delete the group instead");
        };
        let before = group.members.list.size();
        let filtered = group.members.list.filter(func(m : Types.GroupMember) : Bool {
          not Principal.equal(m.userId, caller)
        });
        if (filtered.size() == before) return #err("Not a member of this group");
        group.members.list := filtered;
        #ok(true);
      };
    };
  };

  // ─── Invite ───────────────────────────────────────────────────────────────

  /// Invite a user by username (owner only).
  public shared ({ caller }) func inviteMember(groupId : Types.GroupId, username : Text) : async Types.JoinLeaveGroupResult {
    if (caller.isAnonymous()) return #err("Must be logged in to invite members");
    switch (groups.get(groupId)) {
      case null { #err("Group not found") };
      case (?group) {
        if (not Principal.equal(group.ownerId, caller)) {
          return #err("Only the group owner can invite members");
        };
        // Find the target user by username
        var targetUser : ?UPMTypes.User = null;
        for ((_, u) in users.entries()) {
          if (u.username == username) {
            targetUser := ?u;
          };
        };
        switch (targetUser) {
          case null { #err("User not found: " # username) };
          case (?u) {
            let existing = group.members.list.find(func(m : Types.GroupMember) : Bool {
              Principal.equal(m.userId, u.id)
            });
            if (existing != null) return #err("User is already a member");
            let newMember : Types.GroupMember = {
              userId   = u.id;
              username = u.username;
              joinedAt = Time.now();
            };
            group.members.list := group.members.list.concat([newMember]);
            #ok(true);
          };
        };
      };
    };
  };

  // ─── Delete ───────────────────────────────────────────────────────────────

  /// Delete a group. Only the group owner or the app owner may delete.
  public shared ({ caller }) func deleteGroup(groupId : Types.GroupId) : async Bool {
    switch (groups.get(groupId)) {
      case null { false };
      case (?group) {
        // Allow group owner or app owner (Princess Narzine Bani Hashem)
        let isGroupOwner = Principal.equal(group.ownerId, caller);
        let isAppOwner = switch (users.get(caller)) {
          case (?u) u.username == "Princess Narzine Bani Hashem";
          case null false;
        };
        if (not isGroupOwner and not isAppOwner) return false;
        groups.remove(groupId);
        true;
      };
    };
  };
};
