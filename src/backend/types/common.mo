module {
  public type UserId = Principal;
  public type Timestamp = Int;
  public type PostId = Nat;
  public type MessageId = Nat;
  public type ConversationId = Text; // canonical: sorted pair of user principals joined with ":"
};
