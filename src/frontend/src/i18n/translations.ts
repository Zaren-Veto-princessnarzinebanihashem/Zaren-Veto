export type Language = "ar" | "fr" | "en";

export interface Translations {
  // App / Header
  appName: string;
  viewProfile: string;
  signOut: string;
  userMenuAriaLabel: string;

  // Navigation
  feed: string;
  messages: string;
  settings: string;
  profile: string;

  // Language switcher
  language: string;
  langAr: string;
  langFr: string;
  langEn: string;

  // Login page
  tagline: string;
  taglineHighlight: string;
  loginSubtitle: string;
  featureDigitalSovereignty: string;
  featureDigitalSovereigntyDesc: string;
  featureEncryptedMessages: string;
  featureEncryptedMessagesDesc: string;
  featureVisibilityControl: string;
  featureVisibilityControlDesc: string;
  featureNoBiometrics: string;
  featureNoBiometricsDesc: string;
  signInSecurely: string;
  signInDesc: string;
  continueWithII: string;
  connecting: string;
  loginDisclaimer: string;
  securedBy: string;

  // Registration form
  createYourProfile: string;
  createProfileSubtitle: string;
  username: string;
  usernameRequired: string;
  usernamePlaceholder: string;
  bio: string;
  bioOptional: string;
  bioPlaceholder: string;
  joiningLabel: string;
  joinButton: string;
  registrationFailed: string;
  welcomeToast: string;
  usernameRequired2: string;

  // Feed page
  yourFeed: string;
  posts: string;
  post: string;
  whatsOnYourMind: string;
  everyone: string;
  followersOnly: string;
  publishing: string;
  publish: string;
  feedIsQuiet: string;
  feedIsQuietDesc: string;
  couldNotLoadFeed: string;
  tryAgain: string;
  loadMorePosts: string;
  postPublished: string;
  failedToPublishPost: string;
  postUpdated: string;
  failedToUpdatePost: string;
  postDeleted: string;
  failedToDeletePost: string;
  edited: string;
  followers: string;
  editPost: string;
  deletePost: string;
  cancel: string;
  saveChanges: string;
  saving: string;
  remaining: string;
  deletePostTitle: string;
  deletePostDesc: string;
  deleting: string;

  // Profile page
  editProfile: string;
  follow: string;
  unfollow: string;
  following: string;
  profilePosts: string;
  profileFollowers: string;
  profileFollowing: string;
  postVisibility: string;
  saveChangesBtn: string;
  cancelBtn: string;
  savingBtn: string;
  profileUpdated: string;
  failedToUpdateProfile: string;
  userNotFound: string;
  userNotFoundDesc: string;
  backToFeed: string;
  noPostsYet: string;
  youFollowThisUser: string;
  usernameIsRequired: string;

  // Messages page
  messagesTitle: string;
  allEncrypted: string;
  e2eEncrypted: string;
  searchUsersPlaceholder: string;
  searching: string;
  noUsersFound: string;
  encrypted: string;
  noConversationsYet: string;
  noConversationsDesc: string;
  findSomeoneToMessage: string;
  noMessagesYet: string;

  // Settings page
  settingsTitle: string;
  settingsSubtitle: string;
  accountSection: string;
  accountSectionDesc: string;
  privacySection: string;
  privacySectionDesc: string;
  aboutSection: string;
  usernameLabel: string;
  usernameHint: string;
  bioLabel: string;
  bioHint: string;
  everyoneDesc: string;
  followersOnlyDesc: string;
  visibilityHint: string;
  aboutTitle: string;
  aboutDesc: string;
  aboutVersion: string;
  saveBtn: string;
  savingBtnLabel: string;
  settingsSaved: string;
  settingsSaveFailed: string;
  settingsSaveError: string;
  usernameCannotBeEmpty: string;

  // Reactions & Post actions
  like: string;
  liked: string;
  react: string;
  comment: string;
  share: string;
  savePost: string;
  unsavePost: string;
  reportPost: string;
  reactionHeart: string;
  reactionHaha: string;
  reactionWow: string;
  reactionSad: string;
  reactionAngry: string;
  viewComments: string;
  addComment: string;
  postComment: string;
  replyTo: string;
  viewReplies: string;
  hideReplies: string;
  shareToFeed: string;
  copyLink: string;
  linkCopied: string;

  // Notifications
  notificationsTitle: string;
  notificationsEmpty: string;
  notificationsEmptyDesc: string;
  markAllRead: string;
  notifLiked: string;
  notifCommented: string;
  notifFollowed: string;
  notifMentioned: string;
  notifShared: string;
  notifReplied: string;

  // Profile media upload
  changeCoverPhoto: string;
  changeProfilePhoto: string;
  uploadPhoto: string;
  removePhoto: string;
  photoUploaded: string;
  photoUploadFailed: string;
  coverPhotoUpdated: string;
  profilePhotoUpdated: string;

  // Report
  reportTitle: string;
  reportSpam: string;
  reportHarassment: string;
  reportHateSpeech: string;
  reportViolence: string;
  reportMisinformation: string;
  reportNudity: string;
  reportOther: string;
  reportSubmitted: string;
  reportFailed: string;
  submitReport: string;

  // Policies — navigation / headers
  privacyPolicy: string;
  termsOfService: string;
  communityGuidelines: string;
  privacyPolicyTitle: string;
  termsTitle: string;
  guidelinesTitle: string;
  lastUpdated: string;
  backToHome: string;

  // Privacy Policy sections
  ppIntro: string;
  ppSection1Title: string;
  ppSection1Body: string;
  ppSection2Title: string;
  ppSection2Body: string;
  ppSection3Title: string;
  ppSection3Body: string;
  ppSection4Title: string;
  ppSection4Body: string;
  ppSection5Title: string;
  ppSection5Body: string;
  ppSection6Title: string;
  ppSection6Body: string;
  ppSection7Title: string;
  ppSection7Body: string;
  ppSection8Title: string;
  ppSection8Body: string;
  ppContactTitle: string;
  ppContactBody: string;

  // Terms of Service sections
  tosIntro: string;
  tosSection1Title: string;
  tosSection1Body: string;
  tosSection2Title: string;
  tosSection2Body: string;
  tosSection3Title: string;
  tosSection3Body: string;
  tosSection4Title: string;
  tosSection4Body: string;
  tosSection5Title: string;
  tosSection5Body: string;
  tosSection6Title: string;
  tosSection6Body: string;
  tosSection7Title: string;
  tosSection7Body: string;
  tosSection8Title: string;
  tosSection8Body: string;
  tosSection9Title: string;
  tosSection9Body: string;

  // Community Guidelines sections
  cgIntro: string;
  cgSection1Title: string;
  cgSection1Body: string;
  cgSection2Title: string;
  cgSection2Body: string;
  cgSection3Title: string;
  cgSection3Body: string;
  cgSection4Title: string;
  cgSection4Body: string;
  cgSection5Title: string;
  cgSection5Body: string;
  cgSection6Title: string;
  cgSection6Body: string;
  cgSection7Title: string;
  cgSection7Body: string;
  cgSection8Title: string;
  cgSection8Body: string;
  cgReportTitle: string;
  cgReportBody: string;
  cgEnforcementTitle: string;
  cgEnforcementBody: string;

  // Verification
  verifiedAccount: string;
  verifiedAccountDesc: string;

  // Stories
  storiesCreate: string;
  storiesAddTextOverlay: string;
  storiesViewedBy: string;
  storiesExpiresIn: string;
  storiesDelete: string;
  storiesNoStories: string;
  storiesYourStory: string;
  storiesPost: string;
  storiesAddImage: string;
  storiesViewers: string;
  storiesExpired: string;
  storiesCreateStory: string;
  storiesLoadFailed: string;
  storiesDeleteConfirm: string;
  storiesDeleteSuccess: string;
  storiesCreated: string;

  // Navigation — new tabs
  explore: string;
  friends: string;

  // Explore page
  exploreTitle: string;
  exploreSearchPlaceholder: string;
  exploreTrendingHashtags: string;
  explorePosts: string;
  exploreUsers: string;
  exploreNoResults: string;
  exploreSearchResults: string;
  exploreHashtagPosts: string;
  exploreTypeToSearch: string;

  // Friend requests
  friendsSendRequest: string;
  friendsAcceptRequest: string;
  friendsDeclineRequest: string;
  friendsCancelRequest: string;
  friendsBlockUser: string;
  friendsUnblockUser: string;
  friendsPendingRequests: string;
  friendsSentRequests: string;
  friendsNoPendingRequests: string;
  friendsNoSentRequests: string;
  friendsRequestSent: string;
  friendsRequestAccepted: string;
  friendsRequestDeclined: string;
  friendsRequestCancelled: string;
  friendsUserBlocked: string;
  friendsUserUnblocked: string;
  friendsRequestFailed: string;
  friendsTitle: string;
  friendsRequestsReceived: string;
  friendsRequestsSent: string;

  // About section (profile)
  aboutBio: string;
  aboutLocation: string;
  aboutWork: string;
  aboutEducation: string;
  aboutWebsite: string;
  aboutEditAbout: string;
  aboutSaveAbout: string;
  aboutSectionTitle: string;
  aboutUpdated: string;
  aboutUpdateFailed: string;
  aboutLocationPlaceholder: string;
  aboutWorkPlaceholder: string;
  aboutEducationPlaceholder: string;
  aboutWebsitePlaceholder: string;

  // Admin dashboard
  adminDashboard: string;
  adminUsers: string;
  adminReports: string;
  adminStats: string;
  adminGrantBadge: string;
  adminRevokeBadge: string;
  adminSuspendUser: string;
  adminBanUser: string;
  adminResolveReport: string;
  adminDismissReport: string;
  adminTotalUsers: string;
  adminTotalPosts: string;
  adminVerifiedUsers: string;
  adminPendingReports: string;
  adminTotalMessages: string;
  adminTotalStories: string;
  adminSuspendDuration: string;
  adminSuspendHours: string;
  adminUserSuspended: string;
  adminUserBanned: string;
  adminBadgeGranted: string;
  adminBadgeRevoked: string;
  adminReportResolved: string;
  adminActionFailed: string;
  adminNoReports: string;
  adminNoUsers: string;
  adminPage: string;
  adminNextPage: string;
  adminPrevPage: string;

  // Polls
  pollCreate: string;
  pollAddOption: string;
  pollVote: string;
  pollResults: string;
  pollTotalVotes: string;
  pollQuestion: string;
  pollOption: string;
  pollVoted: string;
  pollVoteFailed: string;
  pollRemoveOption: string;
  pollQuestionPlaceholder: string;
  pollOptionPlaceholder: string;

  // Message reactions
  msgReact: string;
  msgRemoveReaction: string;
  msgReactions: string;
  msgReactionAdded: string;
  msgReactionRemoved: string;

  // Read receipts
  msgRead: string;
  msgDelivered: string;
  msgReadAt: string;

  // Pin post
  postPin: string;
  postUnpin: string;
  postPinned: string;
  postUnpinned: string;
  postPinnedLabel: string;

  // Convenience aliases used by existing pages
  actionFailed: string;
  verificationGranted: string;
  verificationRevoked: string;
  revoke: string;
  grant: string;
  suspend: string;
  ban: string;
  reportResolved: string;
  reportedBy: string;
  reportedUser: string;
  reportedPost: string;
  deleteContent: string;
  dismiss: string;
  accessDenied: string;
  accessDeniedDesc: string;
  totalUsers: string;
  totalPosts: string;
  totalStories: string;
  totalMessages: string;
  verifiedUsers: string;
  pendingReports: string;
  adminDashboardDesc: string;
  usersTab: string;
  reportsTab: string;
  noUsersYet: string;
  noReportsYet: string;

  // Profile About aliases
  aboutMe: string;
  editAbout: string;
  location: string;
  work: string;
  education: string;
  website: string;
  noAboutYet: string;
  pinnedPost: string;
  unpinPost: string;
  pinPost: string;
  friendRequestSent: string;
  pendingRequest: string;
  blocked: string;
  addFriend: string;

  // Stories feed label
  storiesFeed: string;

  // Short aliases for polls and admin actions
  addPollOption: string;
  addPoll: string;
  userSuspended: string;
  userBanned: string;

  // Password registration
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  passwordRuleMinLength: string;
  passwordRuleUppercase: string;
  passwordRuleLowercase: string;
  passwordRuleDigit: string;
  passwordMismatch: string;
  passwordTooWeak: string;
  passwordSectionTitle: string;
  passwordSectionSubtitle: string;
  emailLabel: string;
  securityProtectionMsg: string;
  usernameReservedError: string;
}

const en: Translations = {
  // App / Header
  appName: "ZAREN VETO",
  viewProfile: "View Profile",
  signOut: "Sign Out",
  userMenuAriaLabel: "User menu",

  // Navigation
  feed: "Feed",
  messages: "Messages",
  settings: "Settings",
  profile: "Profile",

  // Language switcher
  language: "Language",
  langAr: "AR",
  langFr: "FR",
  langEn: "EN",

  // Login page
  tagline: "Your network,",
  taglineHighlight: "your rules.",
  loginSubtitle:
    "A premium social platform built on digital sovereignty. No passwords to steal, no tracking, no compromises.",
  featureDigitalSovereignty: "Digital Sovereignty",
  featureDigitalSovereigntyDesc:
    "You own your data. No tracking, no data mining.",
  featureEncryptedMessages: "Encrypted Messages",
  featureEncryptedMessagesDesc: "End-to-end encryption on every conversation.",
  featureVisibilityControl: "Visibility Control",
  featureVisibilityControlDesc:
    "Choose who sees your posts — everyone or followers.",
  featureNoBiometrics: "No Biometrics",
  featureNoBiometricsDesc:
    "No selfies, no fingerprints, no biometric tracking ever.",
  signInSecurely: "Sign In Securely",
  signInDesc:
    "Internet Identity uses cryptographic keys stored on your device — no passwords to leak or guess.",
  continueWithII: "Continue with Internet Identity",
  connecting: "Connecting…",
  loginDisclaimer:
    "By continuing, you agree to Zaren Veto's commitment to your privacy. No biometric data is collected.",
  securedBy: "Secured by Internet Computer cryptography",

  // Registration form
  createYourProfile: "Create Your Profile",
  createProfileSubtitle:
    "Set up your identity on Zaren Veto. No avatar required.",
  username: "Username",
  usernameRequired: "Username *",
  usernamePlaceholder: "e.g. sovereign_user",
  bio: "Bio",
  bioOptional: "(optional)",
  bioPlaceholder: "Tell the world who you are…",
  joiningLabel: "Creating profile…",
  joinButton: "Join Zaren Veto",
  registrationFailed: "Registration failed. Please try again.",
  welcomeToast: "Welcome to Zaren Veto!",
  usernameRequired2: "Username is required",

  // Feed page
  yourFeed: "Your Feed",
  posts: "posts",
  post: "post",
  whatsOnYourMind: "What's on your mind? Share with your network…",
  everyone: "Everyone",
  followersOnly: "Followers Only",
  publishing: "Publishing…",
  publish: "Publish",
  feedIsQuiet: "Your feed is quiet",
  feedIsQuietDesc:
    "Be the first to share something. Your posts reach everyone in your network — or just your followers.",
  couldNotLoadFeed: "Couldn't load your feed right now.",
  tryAgain: "Try again",
  loadMorePosts: "Load more posts",
  postPublished: "Post published!",
  failedToPublishPost: "Failed to publish post.",
  postUpdated: "Post updated.",
  failedToUpdatePost: "Failed to update post.",
  postDeleted: "Post deleted.",
  failedToDeletePost: "Failed to delete post.",
  edited: "edited",
  followers: "Followers",
  editPost: "Edit post",
  deletePost: "Delete post",
  cancel: "Cancel",
  saveChanges: "Save changes",
  saving: "Saving…",
  remaining: "remaining",
  deletePostTitle: "Delete post?",
  deletePostDesc:
    "This action cannot be undone. Your post will be permanently removed.",
  deleting: "Deleting…",

  // Profile page
  editProfile: "Edit Profile",
  follow: "Follow",
  unfollow: "Unfollow",
  following: "Following",
  profilePosts: "Posts",
  profileFollowers: "Followers",
  profileFollowing: "Following",
  postVisibility: "Post Visibility",
  saveChangesBtn: "Save Changes",
  cancelBtn: "Cancel",
  savingBtn: "Saving…",
  profileUpdated: "Profile updated",
  failedToUpdateProfile: "Failed to update profile",
  userNotFound: "User not found",
  userNotFoundDesc: "This profile doesn't exist or may have been removed.",
  backToFeed: "Back to Feed",
  noPostsYet: "No posts yet",
  youFollowThisUser: "You follow this user",
  usernameIsRequired: "Username is required",

  // Messages page
  messagesTitle: "Messages",
  allEncrypted: "All conversations are end-to-end encrypted",
  e2eEncrypted: "E2E Encrypted",
  searchUsersPlaceholder: "Search users to start a new conversation…",
  searching: "Searching…",
  noUsersFound: 'No users found for "{term}"',
  encrypted: "Encrypted",
  noConversationsYet: "No conversations yet",
  noConversationsDesc:
    "Search for a user above and start your first encrypted conversation.",
  findSomeoneToMessage: "Find someone to message",
  noMessagesYet: "No messages yet",

  // Settings page
  settingsTitle: "Settings",
  settingsSubtitle: "Manage your account information and privacy preferences.",
  accountSection: "Account",
  accountSectionDesc: "Update your public profile information.",
  privacySection: "Privacy",
  privacySectionDesc: "Control who can see your posts and profile activity.",
  aboutSection: "About",
  usernameLabel: "Username",
  usernameHint: "Shown to other users on your profile and posts.",
  bioLabel: "Bio",
  bioHint: "Tell others a bit about yourself…",
  everyoneDesc:
    "Your posts and profile are visible to all users on Zaren Veto, including people who don't follow you.",
  followersOnlyDesc:
    "Only users who follow you can see your posts and profile. New visitors will see a locked profile.",
  visibilityHint:
    "This setting applies to all your posts. You can change it at any time — changes take effect immediately.",
  aboutTitle: "Zaren Veto — Digital Sovereignty Platform",
  aboutDesc:
    "Zaren Veto is a privacy-first social network where you own your data. No tracking, no ads, no third-party access. Your messages are encrypted and your profile is yours alone. Built on the Internet Computer — a decentralized, tamper-proof platform designed for true digital sovereignty.",
  aboutVersion: "Version 1.0 · Internet Computer",
  saveBtn: "Save changes",
  savingBtnLabel: "Saving…",
  settingsSaved: "Settings saved successfully.",
  settingsSaveFailed: "Could not save settings. Please try again.",
  settingsSaveError: "An error occurred while saving. Please try again.",
  usernameCannotBeEmpty: "Username cannot be empty.",

  // Reactions & Post actions
  like: "Like",
  liked: "Liked",
  react: "React",
  comment: "Comment",
  share: "Share",
  savePost: "Save post",
  unsavePost: "Unsave post",
  reportPost: "Report post",
  reactionHeart: "Love",
  reactionHaha: "Haha",
  reactionWow: "Wow",
  reactionSad: "Sad",
  reactionAngry: "Angry",
  viewComments: "View comments",
  addComment: "Write a comment…",
  postComment: "Post",
  replyTo: "Reply to",
  viewReplies: "View replies",
  hideReplies: "Hide replies",
  shareToFeed: "Share to feed",
  copyLink: "Copy link",
  linkCopied: "Link copied!",

  // Notifications
  notificationsTitle: "Notifications",
  notificationsEmpty: "No notifications yet",
  notificationsEmptyDesc:
    "When someone likes, comments, or follows you, it'll show up here.",
  markAllRead: "Mark all as read",
  notifLiked: "liked your post",
  notifCommented: "commented on your post",
  notifFollowed: "started following you",
  notifMentioned: "mentioned you in a post",
  notifShared: "shared your post",
  notifReplied: "replied to your comment",

  // Profile media upload
  changeCoverPhoto: "Change Cover Photo",
  changeProfilePhoto: "Change Profile Photo",
  uploadPhoto: "Upload photo",
  removePhoto: "Remove photo",
  photoUploaded: "Photo uploaded successfully.",
  photoUploadFailed: "Failed to upload photo.",
  coverPhotoUpdated: "Cover photo updated.",
  profilePhotoUpdated: "Profile photo updated.",

  // Report
  reportTitle: "Report this post",
  reportSpam: "Spam",
  reportHarassment: "Harassment or bullying",
  reportHateSpeech: "Hate speech",
  reportViolence: "Violence or dangerous content",
  reportMisinformation: "False information",
  reportNudity: "Nudity or sexual content",
  reportOther: "Something else",
  reportSubmitted: "Report submitted. Thank you.",
  reportFailed: "Failed to submit report.",
  submitReport: "Submit report",

  // Policies — navigation / headers
  privacyPolicy: "Privacy Policy",
  termsOfService: "Terms of Service",
  communityGuidelines: "Community Guidelines",
  privacyPolicyTitle: "Privacy Policy — Zaren Veto",
  termsTitle: "Terms of Service — Zaren Veto",
  guidelinesTitle: "Community Guidelines — Zaren Veto",
  lastUpdated: "Last updated",
  backToHome: "Back to home",

  // Privacy Policy sections
  ppIntro:
    "Zaren Veto is built on a foundational commitment to your privacy. This policy explains exactly what data we collect, how we use it, and what rights you have — in plain language.",
  ppSection1Title: "1. Data We Collect",
  ppSection1Body:
    "We collect only the data you explicitly provide: your username, bio, posts, and messages. We do not collect device identifiers, IP addresses, location data, browsing history, or behavioral analytics. Your Internet Identity is cryptographically bound to your device and is never stored on our servers.",
  ppSection2Title: "2. Data Encryption",
  ppSection2Body:
    "All data stored on Zaren Veto is encrypted at rest on the Internet Computer — a decentralized, tamper-proof network. Private messages are encrypted in transit. We apply encryption-first principles throughout the platform architecture.",
  ppSection3Title: "3. No Tracking Policy",
  ppSection3Body:
    "Zaren Veto does not use tracking cookies, web beacons, pixel tags, advertising networks, behavioral profiling, or any cross-site tracking mechanisms. We do not track your activity inside or outside the platform. There are no third-party analytics SDKs embedded in this application.",
  ppSection4Title: "4. No Biometrics — Ever",
  ppSection4Body:
    "Zaren Veto will never require, request, or store biometric data of any kind — including face scans, fingerprints, voiceprints, iris scans, or retinal data. This is an irrevocable, permanent commitment to your bodily privacy.",
  ppSection5Title: "5. No Third-Party Data Sharing",
  ppSection5Body:
    "Your data is never sold, rented, licensed, or shared with any third party — not advertisers, data brokers, governments (absent a valid legal order), or partner companies. Your information exists solely to power your experience on Zaren Veto.",
  ppSection6Title: "6. Data Ownership & Sovereignty",
  ppSection6Body:
    "You retain full ownership of all content you create on Zaren Veto. Your posts, messages, and profile data belong to you. Zaren Veto holds only a limited, non-exclusive license to store and display your content as directed by your privacy settings.",
  ppSection7Title: "7. Your Rights",
  ppSection7Body:
    "You have the right to access, export, and permanently delete all data associated with your account at any time. Deleting your account removes all posts, messages, and profile data from our systems permanently. Internet Identity credentials remain under your sole control and cannot be recovered by us.",
  ppSection8Title: "8. Changes to This Policy",
  ppSection8Body:
    "Any material changes to this Privacy Policy will be announced in-app with at least 30 days notice before taking effect. Continued use of Zaren Veto after the effective date constitutes acceptance of the revised policy.",
  ppContactTitle: "Contact",
  ppContactBody:
    "For privacy-related questions, concerns, or data requests, please use the in-app reporting tools or reach out through our official support channels. We are committed to responding within 48 hours.",

  // Terms of Service sections
  tosIntro:
    "These Terms of Service govern your use of Zaren Veto. By accessing or using the platform, you agree to be bound by these terms. Please read them carefully.",
  tosSection1Title: "1. Acceptance of Terms",
  tosSection1Body:
    "By creating an account or using Zaren Veto, you confirm that you have read, understood, and agree to these Terms of Service. If you do not agree, you must not use the platform.",
  tosSection2Title: "2. Account Eligibility",
  tosSection2Body:
    "You must be at least 13 years of age to create an account. Users between 13 and 18 should have parental or guardian consent. One account per person — operating multiple accounts to circumvent enforcement actions is prohibited.",
  tosSection3Title: "3. Account Accuracy",
  tosSection3Body:
    "You agree to provide accurate, truthful information in your profile. Impersonating another person, organization, or public figure is strictly prohibited and will result in immediate account termination.",
  tosSection4Title: "4. Prohibited Content & Conduct",
  tosSection4Body:
    "You must not post, share, or promote: spam or unsolicited commercial content; harassment, bullying, or targeted abuse; hate speech based on race, ethnicity, religion, gender, sexuality, or disability; threats of violence or self-harm; illegal content; sexual content involving minors; or content designed to manipulate platform algorithms. Coordinated inauthentic behavior is also prohibited.",
  tosSection5Title: "5. Content Ownership",
  tosSection5Body:
    "You retain full copyright and ownership of all content you post on Zaren Veto. By posting, you grant Zaren Veto a limited, non-exclusive, royalty-free license to store, display, and distribute your content to your chosen audience as defined by your visibility settings.",
  tosSection6Title: "6. Account Responsibility",
  tosSection6Body:
    "Your Internet Identity is your sole responsibility. You are accountable for all activity conducted through your account. Zaren Veto cannot recover lost Internet Identity credentials — keep your recovery phrase secure.",
  tosSection7Title: "7. Termination & Suspension",
  tosSection7Body:
    "We reserve the right to suspend or permanently terminate accounts that violate these Terms, with or without prior notice depending on violation severity. You may delete your own account at any time, which permanently removes all associated data.",
  tosSection8Title: "8. Service Availability",
  tosSection8Body:
    "Zaren Veto is provided on an 'as is' basis without warranties of availability, fitness, or merchantability. We reserve the right to modify, suspend, or discontinue features at any time. Scheduled maintenance will be communicated in advance when possible.",
  tosSection9Title: "9. Governing Law",
  tosSection9Body:
    "These Terms are governed by applicable international digital commerce regulations. Any disputes shall be resolved first through good-faith negotiation. If unresolved, disputes are subject to binding arbitration under internationally recognized rules.",

  // Community Guidelines sections
  cgIntro:
    "Zaren Veto is a community built on trust, privacy, and respect. These guidelines define the standards of behavior expected from every member. Violations are taken seriously and handled fairly.",
  cgSection1Title: "Be Respectful",
  cgSection1Body:
    "Treat every person on this platform with dignity and respect. Harassment, bullying, personal attacks, and targeted abuse have no place on Zaren Veto. Healthy debate is welcome — cruelty is not. You may disagree with ideas without attacking the people who hold them.",
  cgSection2Title: "No Hate Speech",
  cgSection2Body:
    "Content that promotes hatred, discrimination, or violence based on race, ethnicity, national origin, religion, gender, sexual orientation, disability, or immigration status is strictly prohibited. This includes slurs, dehumanizing language, and calls for exclusion or harm.",
  cgSection3Title: "Authentic Identity",
  cgSection3Body:
    "Use your real identity. Do not create fake or duplicate accounts, impersonate real people or public figures, or misrepresent your affiliation with organizations. Verification badges are only issued to legitimate, confirmed accounts.",
  cgSection4Title: "Protect Others' Privacy",
  cgSection4Body:
    "Never share another person's private information without their explicit consent. This includes home addresses, phone numbers, financial details, identification documents, private messages, or location data. Doxxing is a serious violation that results in immediate account termination.",
  cgSection5Title: "No Spam or Unsolicited Promotion",
  cgSection5Body:
    "Automated posting, bulk messaging, repetitive content, coordinated inauthentic behavior, and unsolicited commercial promotion are prohibited. Do not use Zaren Veto to artificially amplify content, manipulate trends, or operate bot accounts.",
  cgSection6Title: "No Harmful or Dangerous Content",
  cgSection6Body:
    "Do not post content that promotes violence, self-harm, terrorism, dangerous challenges, or illegal activity. Content involving minors in any sexual or exploitative context is strictly forbidden and will result in immediate account termination and reporting to relevant authorities.",
  cgSection7Title: "Intellectual Property",
  cgSection7Body:
    "Only post content you have the right to share. Respect copyright, trademarks, and intellectual property rights. If you believe your rights have been violated, use the in-app report function. Repeat infringers will have their accounts terminated.",
  cgSection8Title: "Fight Misinformation",
  cgSection8Body:
    "Do not knowingly share false or misleading information, especially content that could cause real-world harm. Clearly label opinions as opinions. When sharing news or statistics, cite credible, verifiable sources.",
  cgReportTitle: "How to Report Violations",
  cgReportBody:
    "Use the '…' menu on any post or profile to submit a report. Select the most accurate reason and add context if possible. All reports are reviewed by our moderation team. You will receive a notification once your report has been actioned. Reporting in good faith is always protected — false reports made to harass others will themselves result in enforcement action.",
  cgEnforcementTitle: "Enforcement",
  cgEnforcementBody:
    "Violations result in graduated enforcement: (1) Warning for minor or first-time violations. (2) Temporary suspension for repeated or moderate violations. (3) Permanent ban for severe violations, including CSAM, terrorism promotion, or repeated harassment. Severe violations involving illegal content are reported to relevant authorities. All enforcement decisions may be appealed through our official appeals process.",

  // Verification
  verifiedAccount: "Verified account",
  verifiedAccountDesc: "This account has been verified as authentic.",

  // Stories
  storiesCreate: "Create Story",
  storiesAddTextOverlay: "Add text overlay…",
  storiesViewedBy: "Viewed by",
  storiesExpiresIn: "Expires in",
  storiesDelete: "Delete Story",
  storiesNoStories: "No stories yet",
  storiesYourStory: "Your Story",
  storiesPost: "Post Story",
  storiesAddImage: "Add Image",
  storiesViewers: "Viewers",
  storiesExpired: "Expired",
  storiesCreateStory: "Create a new story",
  storiesLoadFailed: "Could not load stories",
  storiesDeleteConfirm: "Delete this story?",
  storiesDeleteSuccess: "Story deleted",
  storiesCreated: "Story posted!",

  // Navigation — new tabs
  explore: "Explore",
  friends: "Friends",

  // Explore page
  exploreTitle: "Explore",
  exploreSearchPlaceholder: "Search users, posts, or hashtags…",
  exploreTrendingHashtags: "Trending Hashtags",
  explorePosts: "Posts",
  exploreUsers: "People",
  exploreNoResults: "No results found",
  exploreSearchResults: "Search results",
  exploreHashtagPosts: "Posts tagged",
  exploreTypeToSearch: "Type something to search…",

  // Friend requests
  friendsSendRequest: "Add Friend",
  friendsAcceptRequest: "Accept",
  friendsDeclineRequest: "Decline",
  friendsCancelRequest: "Cancel Request",
  friendsBlockUser: "Block",
  friendsUnblockUser: "Unblock",
  friendsPendingRequests: "Friend Requests",
  friendsSentRequests: "Sent Requests",
  friendsNoPendingRequests: "No friend requests",
  friendsNoSentRequests: "No sent requests",
  friendsRequestSent: "Friend request sent",
  friendsRequestAccepted: "Request accepted",
  friendsRequestDeclined: "Request declined",
  friendsRequestCancelled: "Request cancelled",
  friendsUserBlocked: "User blocked",
  friendsUserUnblocked: "User unblocked",
  friendsRequestFailed: "Action failed. Please try again.",
  friendsTitle: "Friends",
  friendsRequestsReceived: "Received",
  friendsRequestsSent: "Sent",

  // About section (profile)
  aboutBio: "Bio",
  aboutLocation: "Location",
  aboutWork: "Work",
  aboutEducation: "Education",
  aboutWebsite: "Website",
  aboutEditAbout: "Edit About",
  aboutSaveAbout: "Save",
  aboutSectionTitle: "About",
  aboutUpdated: "About section updated",
  aboutUpdateFailed: "Failed to update about section",
  aboutLocationPlaceholder: "Where do you live?",
  aboutWorkPlaceholder: "Where do you work?",
  aboutEducationPlaceholder: "Where did you study?",
  aboutWebsitePlaceholder: "https://yourwebsite.com",

  // Admin dashboard
  adminDashboard: "Admin Dashboard",
  adminUsers: "Users",
  adminReports: "Reports",
  adminStats: "Statistics",
  adminGrantBadge: "Grant Badge",
  adminRevokeBadge: "Revoke Badge",
  adminSuspendUser: "Suspend",
  adminBanUser: "Ban",
  adminResolveReport: "Resolve",
  adminDismissReport: "Dismiss",
  adminTotalUsers: "Total Users",
  adminTotalPosts: "Total Posts",
  adminVerifiedUsers: "Verified Users",
  adminPendingReports: "Pending Reports",
  adminTotalMessages: "Total Messages",
  adminTotalStories: "Total Stories",
  adminSuspendDuration: "Suspend Duration",
  adminSuspendHours: "hours",
  adminUserSuspended: "User suspended",
  adminUserBanned: "User banned",
  adminBadgeGranted: "Verification badge granted",
  adminBadgeRevoked: "Verification badge revoked",
  adminReportResolved: "Report resolved",
  adminActionFailed: "Action failed. Please try again.",
  adminNoReports: "No pending reports",
  adminNoUsers: "No users found",
  adminPage: "Page",
  adminNextPage: "Next",
  adminPrevPage: "Previous",

  // Polls
  pollCreate: "Create Poll",
  pollAddOption: "Add option",
  pollVote: "Vote",
  pollResults: "Poll Results",
  pollTotalVotes: "votes",
  pollQuestion: "Question",
  pollOption: "Option",
  pollVoted: "Vote recorded!",
  pollVoteFailed: "Failed to record vote.",
  pollRemoveOption: "Remove option",
  pollQuestionPlaceholder: "Ask a question…",
  pollOptionPlaceholder: "Option",

  // Message reactions
  msgReact: "React",
  msgRemoveReaction: "Remove reaction",
  msgReactions: "Reactions",
  msgReactionAdded: "Reaction added",
  msgReactionRemoved: "Reaction removed",

  // Read receipts
  msgRead: "Read",
  msgDelivered: "Delivered",
  msgReadAt: "Read at",

  // Pin post
  postPin: "Pin post",
  postUnpin: "Unpin post",
  postPinned: "Post pinned",
  postUnpinned: "Post unpinned",
  postPinnedLabel: "Pinned",

  // Convenience aliases
  actionFailed: "Action failed. Please try again.",
  verificationGranted: "Verification badge granted",
  verificationRevoked: "Verification badge revoked",
  revoke: "Revoke",
  grant: "Grant",
  suspend: "Suspend",
  ban: "Ban",
  reportResolved: "Report resolved",
  reportedBy: "Reported by",
  reportedUser: "Reported user",
  reportedPost: "Reported post",
  deleteContent: "Delete content",
  dismiss: "Dismiss",
  accessDenied: "Access denied",
  accessDeniedDesc: "You need admin privileges to access this page.",
  totalUsers: "Total Users",
  totalPosts: "Total Posts",
  totalStories: "Total Stories",
  totalMessages: "Total Messages",
  verifiedUsers: "Verified Users",
  pendingReports: "Pending Reports",
  adminDashboardDesc: "Manage users, reports, and verification badges.",
  usersTab: "Users",
  reportsTab: "Reports",
  noUsersYet: "No users found",
  noReportsYet: "No pending reports",

  // Profile About aliases
  aboutMe: "About",
  editAbout: "Edit About",
  location: "Location",
  work: "Work",
  education: "Education",
  website: "Website",
  noAboutYet: "No about info yet",
  pinnedPost: "Pinned Post",
  unpinPost: "Unpin post",
  pinPost: "Pin post",
  friendRequestSent: "Friend request sent",
  pendingRequest: "Pending",
  blocked: "Blocked",
  addFriend: "Add Friend",

  // Stories feed label
  storiesFeed: "Stories",
  addPollOption: "Add option",
  addPoll: "Poll",
  userSuspended: "User suspended",
  userBanned: "User banned",

  // Password registration
  passwordLabel: "Password",
  passwordPlaceholder: "Create a secure password",
  confirmPasswordLabel: "Confirm Password",
  confirmPasswordPlaceholder: "Re-enter your password",
  passwordRuleMinLength: "At least 8 characters",
  passwordRuleUppercase: "At least 1 uppercase letter",
  passwordRuleLowercase: "At least 1 lowercase letter",
  passwordRuleDigit: "At least 1 number",
  passwordMismatch: "Passwords do not match",
  passwordTooWeak: "Password does not meet the requirements",
  passwordSectionTitle: "Secure your account",
  passwordSectionSubtitle:
    "Create a password to protect your Zaren Veto account.",
  emailLabel: "Email (optional)",
  securityProtectionMsg:
    "Your account is protected with a secure password. Only you can access it.",
  usernameReservedError: "This username is reserved and cannot be used.",
};

const fr: Translations = {
  // App / Header
  appName: "ZAREN VETO",
  viewProfile: "Voir le profil",
  signOut: "Se déconnecter",
  userMenuAriaLabel: "Menu utilisateur",

  // Navigation
  feed: "Fil d'actualité",
  messages: "Messages",
  settings: "Paramètres",
  profile: "Profil",

  // Language switcher
  language: "Langue",
  langAr: "AR",
  langFr: "FR",
  langEn: "EN",

  // Login page
  tagline: "Votre réseau,",
  taglineHighlight: "vos règles.",
  loginSubtitle:
    "Une plateforme sociale premium fondée sur la souveraineté numérique. Pas de mots de passe à voler, pas de suivi, pas de compromis.",
  featureDigitalSovereignty: "Souveraineté numérique",
  featureDigitalSovereigntyDesc:
    "Vos données vous appartiennent. Aucun suivi ni extraction de données.",
  featureEncryptedMessages: "Messages chiffrés",
  featureEncryptedMessagesDesc:
    "Chiffrement de bout en bout pour chaque conversation.",
  featureVisibilityControl: "Contrôle de visibilité",
  featureVisibilityControlDesc:
    "Choisissez qui voit vos publications — tout le monde ou vos abonnés.",
  featureNoBiometrics: "Pas de biométrie",
  featureNoBiometricsDesc:
    "Pas de selfies, pas d'empreintes, aucune surveillance biométrique.",
  signInSecurely: "Connexion sécurisée",
  signInDesc:
    "Internet Identity utilise des clés cryptographiques stockées sur votre appareil — aucun mot de passe à dévoiler.",
  continueWithII: "Continuer avec Internet Identity",
  connecting: "Connexion…",
  loginDisclaimer:
    "En continuant, vous acceptez l'engagement de Zaren Veto envers votre vie privée. Aucune donnée biométrique n'est collectée.",
  securedBy: "Sécurisé par la cryptographie Internet Computer",

  // Registration form
  createYourProfile: "Créez votre profil",
  createProfileSubtitle:
    "Configurez votre identité sur Zaren Veto. Pas d'avatar requis.",
  username: "Nom d'utilisateur",
  usernameRequired: "Nom d'utilisateur *",
  usernamePlaceholder: "ex. utilisateur_souverain",
  bio: "Bio",
  bioOptional: "(facultatif)",
  bioPlaceholder: "Dites au monde qui vous êtes…",
  joiningLabel: "Création du profil…",
  joinButton: "Rejoindre Zaren Veto",
  registrationFailed: "Inscription échouée. Veuillez réessayer.",
  welcomeToast: "Bienvenue sur Zaren Veto !",
  usernameRequired2: "Le nom d'utilisateur est requis",

  // Feed page
  yourFeed: "Votre fil",
  posts: "publications",
  post: "publication",
  whatsOnYourMind: "À quoi pensez-vous ? Partagez avec votre réseau…",
  everyone: "Tout le monde",
  followersOnly: "Abonnés uniquement",
  publishing: "Publication…",
  publish: "Publier",
  feedIsQuiet: "Votre fil est calme",
  feedIsQuietDesc:
    "Soyez le premier à partager quelque chose. Vos publications atteignent tout le monde dans votre réseau — ou seulement vos abonnés.",
  couldNotLoadFeed: "Impossible de charger votre fil pour le moment.",
  tryAgain: "Réessayer",
  loadMorePosts: "Charger plus de publications",
  postPublished: "Publication réussie !",
  failedToPublishPost: "Échec de la publication.",
  postUpdated: "Publication mise à jour.",
  failedToUpdatePost: "Échec de la mise à jour.",
  postDeleted: "Publication supprimée.",
  failedToDeletePost: "Échec de la suppression.",
  edited: "modifié",
  followers: "Abonnés",
  editPost: "Modifier la publication",
  deletePost: "Supprimer la publication",
  cancel: "Annuler",
  saveChanges: "Enregistrer",
  saving: "Enregistrement…",
  remaining: "restants",
  deletePostTitle: "Supprimer la publication ?",
  deletePostDesc:
    "Cette action est irréversible. Votre publication sera supprimée définitivement.",
  deleting: "Suppression…",

  // Profile page
  editProfile: "Modifier le profil",
  follow: "Suivre",
  unfollow: "Ne plus suivre",
  following: "Abonnements",
  profilePosts: "Publications",
  profileFollowers: "Abonnés",
  profileFollowing: "Abonnements",
  postVisibility: "Visibilité des publications",
  saveChangesBtn: "Enregistrer",
  cancelBtn: "Annuler",
  savingBtn: "Enregistrement…",
  profileUpdated: "Profil mis à jour",
  failedToUpdateProfile: "Échec de la mise à jour du profil",
  userNotFound: "Utilisateur introuvable",
  userNotFoundDesc: "Ce profil n'existe pas ou a été supprimé.",
  backToFeed: "Retour au fil",
  noPostsYet: "Aucune publication",
  youFollowThisUser: "Vous suivez cet utilisateur",
  usernameIsRequired: "Le nom d'utilisateur est requis",

  // Messages page
  messagesTitle: "Messages",
  allEncrypted: "Toutes les conversations sont chiffrées de bout en bout",
  e2eEncrypted: "Chiffré E2E",
  searchUsersPlaceholder:
    "Rechercher des utilisateurs pour démarrer une conversation…",
  searching: "Recherche…",
  noUsersFound: 'Aucun utilisateur trouvé pour "{term}"',
  encrypted: "Chiffré",
  noConversationsYet: "Aucune conversation",
  noConversationsDesc:
    "Recherchez un utilisateur ci-dessus et démarrez votre première conversation chiffrée.",
  findSomeoneToMessage: "Trouver quelqu'un à contacter",
  noMessagesYet: "Pas encore de messages",

  // Settings page
  settingsTitle: "Paramètres",
  settingsSubtitle:
    "Gérez vos informations de compte et vos préférences de confidentialité.",
  accountSection: "Compte",
  accountSectionDesc: "Mettez à jour les informations de votre profil public.",
  privacySection: "Confidentialité",
  privacySectionDesc:
    "Contrôlez qui peut voir vos publications et votre activité.",
  aboutSection: "À propos",
  usernameLabel: "Nom d'utilisateur",
  usernameHint:
    "Affiché aux autres utilisateurs sur votre profil et vos publications.",
  bioLabel: "Bio",
  bioHint: "Parlez un peu de vous aux autres…",
  everyoneDesc:
    "Vos publications et votre profil sont visibles par tous les utilisateurs de Zaren Veto, y compris ceux qui ne vous suivent pas.",
  followersOnlyDesc:
    "Seuls les utilisateurs qui vous suivent peuvent voir vos publications et votre profil. Les nouveaux visiteurs verront un profil verrouillé.",
  visibilityHint:
    "Ce paramètre s'applique à toutes vos publications. Vous pouvez le modifier à tout moment — les changements prennent effet immédiatement.",
  aboutTitle: "Zaren Veto — Plateforme de Souveraineté Numérique",
  aboutDesc:
    "Zaren Veto est un réseau social axé sur la confidentialité où vous possédez vos données. Pas de suivi, pas de publicités, pas d'accès tiers. Vos messages sont chiffrés et votre profil vous appartient. Construit sur l'Internet Computer — une plateforme décentralisée et inviolable conçue pour une véritable souveraineté numérique.",
  aboutVersion: "Version 1.0 · Internet Computer",
  saveBtn: "Enregistrer les modifications",
  savingBtnLabel: "Enregistrement…",
  settingsSaved: "Paramètres enregistrés avec succès.",
  settingsSaveFailed:
    "Impossible d'enregistrer les paramètres. Veuillez réessayer.",
  settingsSaveError:
    "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
  usernameCannotBeEmpty: "Le nom d'utilisateur ne peut pas être vide.",

  // Reactions & Post actions
  like: "J'aime",
  liked: "Aimé",
  react: "Réagir",
  comment: "Commenter",
  share: "Partager",
  savePost: "Enregistrer la publication",
  unsavePost: "Retirer des enregistrés",
  reportPost: "Signaler la publication",
  reactionHeart: "J'adore",
  reactionHaha: "Haha",
  reactionWow: "Wow",
  reactionSad: "Triste",
  reactionAngry: "En colère",
  viewComments: "Voir les commentaires",
  addComment: "Écrire un commentaire…",
  postComment: "Publier",
  replyTo: "Répondre à",
  viewReplies: "Voir les réponses",
  hideReplies: "Masquer les réponses",
  shareToFeed: "Partager dans le fil",
  copyLink: "Copier le lien",
  linkCopied: "Lien copié !",

  // Notifications
  notificationsTitle: "Notifications",
  notificationsEmpty: "Aucune notification",
  notificationsEmptyDesc:
    "Lorsque quelqu'un aime, commente ou vous suit, cela apparaîtra ici.",
  markAllRead: "Tout marquer comme lu",
  notifLiked: "a aimé votre publication",
  notifCommented: "a commenté votre publication",
  notifFollowed: "a commencé à vous suivre",
  notifMentioned: "vous a mentionné dans une publication",
  notifShared: "a partagé votre publication",
  notifReplied: "a répondu à votre commentaire",

  // Profile media upload
  changeCoverPhoto: "Modifier la photo de couverture",
  changeProfilePhoto: "Modifier la photo de profil",
  uploadPhoto: "Télécharger une photo",
  removePhoto: "Supprimer la photo",
  photoUploaded: "Photo téléchargée avec succès.",
  photoUploadFailed: "Échec du téléchargement de la photo.",
  coverPhotoUpdated: "Photo de couverture mise à jour.",
  profilePhotoUpdated: "Photo de profil mise à jour.",

  // Report
  reportTitle: "Signaler cette publication",
  reportSpam: "Spam",
  reportHarassment: "Harcèlement ou intimidation",
  reportHateSpeech: "Discours haineux",
  reportViolence: "Violence ou contenu dangereux",
  reportMisinformation: "Fausses informations",
  reportNudity: "Nudité ou contenu sexuel",
  reportOther: "Autre chose",
  reportSubmitted: "Signalement soumis. Merci.",
  reportFailed: "Échec du signalement.",
  submitReport: "Soumettre le signalement",

  // Policies — navigation / headers
  privacyPolicy: "Politique de confidentialité",
  termsOfService: "Conditions d'utilisation",
  communityGuidelines: "Règles communautaires",
  privacyPolicyTitle: "Politique de confidentialité — Zaren Veto",
  termsTitle: "Conditions d'utilisation — Zaren Veto",
  guidelinesTitle: "Règles communautaires — Zaren Veto",
  lastUpdated: "Dernière mise à jour",
  backToHome: "Retour à l'accueil",

  // Privacy Policy sections
  ppIntro:
    "Zaren Veto est fondé sur un engagement inébranlable envers votre vie privée. Cette politique explique précisément quelles données nous collectons, comment nous les utilisons, et quels droits vous avez — en langage clair.",
  ppSection1Title: "1. Données collectées",
  ppSection1Body:
    "Nous collectons uniquement les données que vous fournissez explicitement : votre nom d'utilisateur, bio, publications et messages. Nous ne collectons pas d'identifiants d'appareils, d'adresses IP, de données de localisation, d'historique de navigation ou d'analyses comportementales. Votre Internet Identity est liée cryptographiquement à votre appareil et n'est jamais stockée sur nos serveurs.",
  ppSection2Title: "2. Chiffrement des données",
  ppSection2Body:
    "Toutes les données stockées sur Zaren Veto sont chiffrées au repos sur l'Internet Computer — un réseau décentralisé et inviolable. Les messages privés sont chiffrés en transit. Nous appliquons des principes de chiffrement prioritaire dans toute l'architecture de la plateforme.",
  ppSection3Title: "3. Politique zéro tracking",
  ppSection3Body:
    "Zaren Veto n'utilise pas de cookies de suivi, de balises web, de pixels publicitaires, de réseaux publicitaires, de profilage comportemental ni de mécanismes de suivi intersites. Nous ne suivons pas votre activité à l'intérieur ni à l'extérieur de la plateforme. Aucun SDK d'analyse tiers n'est intégré dans cette application.",
  ppSection4Title: "4. Zéro biométrie — pour toujours",
  ppSection4Body:
    "Zaren Veto ne demandera, ne collectera ni ne stockera jamais aucune donnée biométrique — y compris les scans faciaux, empreintes digitales, empreintes vocales, scans de l'iris ou de la rétine. Il s'agit d'un engagement irrévocable et permanent envers votre vie privée corporelle.",
  ppSection5Title: "5. Aucun partage avec des tiers",
  ppSection5Body:
    "Vos données ne sont jamais vendues, louées, cédées sous licence ni partagées avec un tiers — ni annonceurs, ni courtiers en données, ni gouvernements (sauf ordonnance légale valide), ni sociétés partenaires. Vos informations existent uniquement pour alimenter votre expérience sur Zaren Veto.",
  ppSection6Title: "6. Propriété et souveraineté des données",
  ppSection6Body:
    "Vous conservez la pleine propriété de tout le contenu que vous créez sur Zaren Veto. Vos publications, messages et données de profil vous appartiennent. Zaren Veto détient uniquement une licence limitée, non exclusive et sans redevance pour stocker et afficher votre contenu conformément à vos paramètres de confidentialité.",
  ppSection7Title: "7. Vos droits",
  ppSection7Body:
    "Vous avez le droit d'accéder, d'exporter et de supprimer définitivement toutes les données associées à votre compte à tout moment. La suppression de votre compte efface définitivement toutes les publications, messages et données de profil de nos systèmes. Les identifiants Internet Identity restent sous votre seul contrôle et ne peuvent pas être récupérés par nos soins.",
  ppSection8Title: "8. Modifications de cette politique",
  ppSection8Body:
    "Tout changement important apporté à cette Politique de confidentialité sera annoncé dans l'application avec un préavis d'au moins 30 jours avant son entrée en vigueur. La poursuite de l'utilisation de Zaren Veto après la date d'entrée en vigueur constitue une acceptation de la politique révisée.",
  ppContactTitle: "Contact",
  ppContactBody:
    "Pour toute question relative à la confidentialité, préoccupation ou demande de données, veuillez utiliser les outils de signalement intégrés à l'application ou contacter nos canaux d'assistance officiels. Nous nous engageons à répondre dans les 48 heures.",

  // Terms of Service sections
  tosIntro:
    "Les présentes Conditions d'utilisation régissent votre utilisation de Zaren Veto. En accédant à la plateforme ou en l'utilisant, vous acceptez d'être lié par ces conditions. Veuillez les lire attentivement.",
  tosSection1Title: "1. Acceptation des conditions",
  tosSection1Body:
    "En créant un compte ou en utilisant Zaren Veto, vous confirmez avoir lu, compris et accepté les présentes Conditions d'utilisation. Si vous n'êtes pas d'accord, vous ne devez pas utiliser la plateforme.",
  tosSection2Title: "2. Éligibilité au compte",
  tosSection2Body:
    "Vous devez avoir au moins 13 ans pour créer un compte. Les utilisateurs entre 13 et 18 ans doivent avoir le consentement de leurs parents ou tuteurs. Un compte par personne — l'exploitation de plusieurs comptes pour contourner les mesures d'application est interdite.",
  tosSection3Title: "3. Exactitude du compte",
  tosSection3Body:
    "Vous vous engagez à fournir des informations exactes et véridiques dans votre profil. L'usurpation d'identité d'une autre personne, organisation ou personnalité publique est strictement interdite et entraînera la résiliation immédiate du compte.",
  tosSection4Title: "4. Contenu et comportements interdits",
  tosSection4Body:
    "Vous ne devez pas publier, partager ou promouvoir : du spam ou du contenu commercial non sollicité ; du harcèlement, de l'intimidation ou des abus ciblés ; des discours haineux basés sur la race, l'ethnie, la religion, le genre, la sexualité ou le handicap ; des menaces de violence ou d'automutilation ; du contenu illégal ; du contenu sexuel impliquant des mineurs ; ou du contenu conçu pour manipuler les algorithmes de la plateforme.",
  tosSection5Title: "5. Propriété du contenu",
  tosSection5Body:
    "Vous conservez la pleine propriété et les droits d'auteur sur tout le contenu que vous publiez sur Zaren Veto. En publiant, vous accordez à Zaren Veto une licence limitée, non exclusive et sans redevance pour stocker, afficher et distribuer votre contenu à l'audience choisie conformément à vos paramètres de visibilité.",
  tosSection6Title: "6. Responsabilité du compte",
  tosSection6Body:
    "Votre Internet Identity est votre seule responsabilité. Vous êtes responsable de toute activité conduite via votre compte. Zaren Veto ne peut pas récupérer les identifiants Internet Identity perdus — conservez votre phrase de récupération en lieu sûr.",
  tosSection7Title: "7. Résiliation et suspension",
  tosSection7Body:
    "Nous nous réservons le droit de suspendre ou de résilier définitivement les comptes qui violent ces Conditions, avec ou sans préavis selon la gravité de la violation. Vous pouvez supprimer votre propre compte à tout moment, ce qui supprime définitivement toutes les données associées.",
  tosSection8Title: "8. Disponibilité du service",
  tosSection8Body:
    "Zaren Veto est fourni «tel quel» sans garantie de disponibilité, d'adéquation ou de qualité marchande. Nous nous réservons le droit de modifier, suspendre ou interrompre des fonctionnalités à tout moment. La maintenance planifiée sera communiquée à l'avance dans la mesure du possible.",
  tosSection9Title: "9. Droit applicable",
  tosSection9Body:
    "Les présentes Conditions sont régies par les réglementations internationales applicables au commerce numérique. Tout litige sera résolu en premier lieu par une négociation de bonne foi. À défaut de résolution, les litiges sont soumis à un arbitrage contraignant selon des règles reconnues internationalement.",

  // Community Guidelines sections
  cgIntro:
    "Zaren Veto est une communauté fondée sur la confiance, la vie privée et le respect. Ces règles définissent les normes de comportement attendues de chaque membre. Les violations sont traitées sérieusement et équitablement.",
  cgSection1Title: "Respectez les autres",
  cgSection1Body:
    "Traitez chaque personne sur cette plateforme avec dignité et respect. Le harcèlement, l'intimidation, les attaques personnelles et les abus ciblés n'ont pas leur place sur Zaren Veto. Le débat sain est le bienvenu — la cruauté ne l'est pas. Vous pouvez être en désaccord avec des idées sans attaquer les personnes qui les défendent.",
  cgSection2Title: "Pas de discours haineux",
  cgSection2Body:
    "Le contenu qui promeut la haine, la discrimination ou la violence basée sur la race, l'ethnie, l'origine nationale, la religion, le genre, l'orientation sexuelle, le handicap ou le statut migratoire est strictement interdit. Cela inclut les insultes, le langage déshumanisant et les appels à l'exclusion ou à la violence.",
  cgSection3Title: "Identité authentique",
  cgSection3Body:
    "Utilisez votre véritable identité. Ne créez pas de faux comptes ou de comptes multiples, n'usurpez pas l'identité de personnes réelles ou de personnalités publiques, et ne déformez pas votre affiliation avec des organisations. Les badges de vérification ne sont délivrés qu'aux comptes légitimes et confirmés.",
  cgSection4Title: "Protégez la vie privée des autres",
  cgSection4Body:
    "Ne partagez jamais les informations privées d'une autre personne sans son consentement explicite. Cela inclut les adresses, numéros de téléphone, informations financières, documents d'identité, messages privés ou données de localisation. Le doxing est une violation grave entraînant la résiliation immédiate du compte.",
  cgSection5Title: "Pas de spam ou de promotion non sollicitée",
  cgSection5Body:
    "La publication automatisée, les messages en masse, le contenu répétitif, les comportements inauthentiques coordonnés et la promotion commerciale non sollicitée sont interdits. N'utilisez pas Zaren Veto pour amplifier artificiellement du contenu, manipuler les tendances ou opérer des comptes de bots.",
  cgSection6Title: "Pas de contenu dangereux ou nuisible",
  cgSection6Body:
    "Ne publiez pas de contenu qui promeut la violence, l'automutilation, le terrorisme, les défis dangereux ou les activités illégales. Le contenu impliquant des mineurs dans tout contexte sexuel ou d'exploitation est strictement interdit et entraînera la résiliation immédiate du compte et le signalement aux autorités compétentes.",
  cgSection7Title: "Propriété intellectuelle",
  cgSection7Body:
    "Ne publiez que du contenu que vous avez le droit de partager. Respectez les droits d'auteur, les marques déposées et les droits de propriété intellectuelle. Si vous pensez que vos droits ont été violés, utilisez la fonction de signalement intégrée. Les contrevenants récidivistes verront leur compte résilié.",
  cgSection8Title: "Luttez contre la désinformation",
  cgSection8Body:
    "Ne partagez pas sciemment des informations fausses ou trompeuses, surtout si elles peuvent causer des préjudices réels. Identifiez clairement les opinions comme telles. Lorsque vous partagez des actualités ou des statistiques, citez des sources fiables et vérifiables.",
  cgReportTitle: "Comment signaler des violations",
  cgReportBody:
    "Utilisez le menu '…' sur n'importe quelle publication ou profil pour soumettre un signalement. Sélectionnez la raison la plus précise et ajoutez du contexte si possible. Tous les signalements sont examinés par notre équipe de modération. Vous recevrez une notification une fois votre signalement traité. Signaler de bonne foi est toujours protégé — les faux signalements destinés à harceler d'autres utilisateurs entraîneront eux-mêmes des mesures d'application.",
  cgEnforcementTitle: "Application des règles",
  cgEnforcementBody:
    "Les violations entraînent des mesures progressives : (1) Avertissement pour les violations mineures ou premières. (2) Suspension temporaire pour les violations répétées ou modérées. (3) Bannissement définitif pour les violations graves, y compris la CSAM, la promotion du terrorisme ou le harcèlement répété. Les violations graves impliquant du contenu illégal sont signalées aux autorités compétentes. Toutes les décisions d'application peuvent faire l'objet d'un appel via notre processus officiel.",

  // Verification
  verifiedAccount: "Compte vérifié",
  verifiedAccountDesc: "Ce compte a été vérifié comme authentique.",

  // Stories
  storiesCreate: "Créer une story",
  storiesAddTextOverlay: "Ajouter un texte…",
  storiesViewedBy: "Vu par",
  storiesExpiresIn: "Expire dans",
  storiesDelete: "Supprimer la story",
  storiesNoStories: "Aucune story pour l'instant",
  storiesYourStory: "Votre story",
  storiesPost: "Publier la story",
  storiesAddImage: "Ajouter une image",
  storiesViewers: "Vues",
  storiesExpired: "Expirée",
  storiesCreateStory: "Créer une nouvelle story",
  storiesLoadFailed: "Impossible de charger les stories",
  storiesDeleteConfirm: "Supprimer cette story ?",
  storiesDeleteSuccess: "Story supprimée",
  storiesCreated: "Story publiée !",

  // Navigation — new tabs
  explore: "Explorer",
  friends: "Amis",

  // Explore page
  exploreTitle: "Explorer",
  exploreSearchPlaceholder:
    "Rechercher des utilisateurs, publications ou hashtags…",
  exploreTrendingHashtags: "Hashtags tendance",
  explorePosts: "Publications",
  exploreUsers: "Personnes",
  exploreNoResults: "Aucun résultat trouvé",
  exploreSearchResults: "Résultats de recherche",
  exploreHashtagPosts: "Publications taguées",
  exploreTypeToSearch: "Tapez pour rechercher…",

  // Friend requests
  friendsSendRequest: "Ajouter en ami",
  friendsAcceptRequest: "Accepter",
  friendsDeclineRequest: "Refuser",
  friendsCancelRequest: "Annuler la demande",
  friendsBlockUser: "Bloquer",
  friendsUnblockUser: "Débloquer",
  friendsPendingRequests: "Demandes d'amis",
  friendsSentRequests: "Demandes envoyées",
  friendsNoPendingRequests: "Aucune demande d'ami",
  friendsNoSentRequests: "Aucune demande envoyée",
  friendsRequestSent: "Demande d'ami envoyée",
  friendsRequestAccepted: "Demande acceptée",
  friendsRequestDeclined: "Demande refusée",
  friendsRequestCancelled: "Demande annulée",
  friendsUserBlocked: "Utilisateur bloqué",
  friendsUserUnblocked: "Utilisateur débloqué",
  friendsRequestFailed: "Échec de l'action. Veuillez réessayer.",
  friendsTitle: "Amis",
  friendsRequestsReceived: "Reçues",
  friendsRequestsSent: "Envoyées",

  // About section (profile)
  aboutBio: "Bio",
  aboutLocation: "Lieu",
  aboutWork: "Travail",
  aboutEducation: "Formation",
  aboutWebsite: "Site web",
  aboutEditAbout: "Modifier",
  aboutSaveAbout: "Enregistrer",
  aboutSectionTitle: "À propos",
  aboutUpdated: "Section à propos mise à jour",
  aboutUpdateFailed: "Échec de la mise à jour",
  aboutLocationPlaceholder: "Où habitez-vous ?",
  aboutWorkPlaceholder: "Où travaillez-vous ?",
  aboutEducationPlaceholder: "Où avez-vous étudié ?",
  aboutWebsitePlaceholder: "https://votresite.com",

  // Admin dashboard
  adminDashboard: "Tableau de bord admin",
  adminUsers: "Utilisateurs",
  adminReports: "Signalements",
  adminStats: "Statistiques",
  adminGrantBadge: "Attribuer le badge",
  adminRevokeBadge: "Retirer le badge",
  adminSuspendUser: "Suspendre",
  adminBanUser: "Bannir",
  adminResolveReport: "Résoudre",
  adminDismissReport: "Ignorer",
  adminTotalUsers: "Total utilisateurs",
  adminTotalPosts: "Total publications",
  adminVerifiedUsers: "Utilisateurs vérifiés",
  adminPendingReports: "Signalements en attente",
  adminTotalMessages: "Total messages",
  adminTotalStories: "Total stories",
  adminSuspendDuration: "Durée de suspension",
  adminSuspendHours: "heures",
  adminUserSuspended: "Utilisateur suspendu",
  adminUserBanned: "Utilisateur banni",
  adminBadgeGranted: "Badge de vérification attribué",
  adminBadgeRevoked: "Badge de vérification retiré",
  adminReportResolved: "Signalement résolu",
  adminActionFailed: "Échec de l'action. Veuillez réessayer.",
  adminNoReports: "Aucun signalement en attente",
  adminNoUsers: "Aucun utilisateur trouvé",
  adminPage: "Page",
  adminNextPage: "Suivant",
  adminPrevPage: "Précédent",

  // Polls
  pollCreate: "Créer un sondage",
  pollAddOption: "Ajouter une option",
  pollVote: "Voter",
  pollResults: "Résultats du sondage",
  pollTotalVotes: "votes",
  pollQuestion: "Question",
  pollOption: "Option",
  pollVoted: "Vote enregistré !",
  pollVoteFailed: "Échec de l'enregistrement du vote.",
  pollRemoveOption: "Supprimer l'option",
  pollQuestionPlaceholder: "Posez une question…",
  pollOptionPlaceholder: "Option",

  // Message reactions
  msgReact: "Réagir",
  msgRemoveReaction: "Supprimer la réaction",
  msgReactions: "Réactions",
  msgReactionAdded: "Réaction ajoutée",
  msgReactionRemoved: "Réaction supprimée",

  // Read receipts
  msgRead: "Lu",
  msgDelivered: "Distribué",
  msgReadAt: "Lu à",

  // Pin post
  postPin: "Épingler la publication",
  postUnpin: "Désépingler",
  postPinned: "Publication épinglée",
  postUnpinned: "Publication désépinglée",
  postPinnedLabel: "Épinglé",

  // Convenience aliases
  actionFailed: "Échec de l'action. Veuillez réessayer.",
  verificationGranted: "Badge de vérification attribué",
  verificationRevoked: "Badge de vérification retiré",
  revoke: "Retirer",
  grant: "Attribuer",
  suspend: "Suspendre",
  ban: "Bannir",
  reportResolved: "Signalement résolu",
  reportedBy: "Signalé par",
  reportedUser: "Utilisateur signalé",
  reportedPost: "Publication signalée",
  deleteContent: "Supprimer le contenu",
  dismiss: "Ignorer",
  accessDenied: "Accès refusé",
  accessDeniedDesc:
    "Vous avez besoin de privilèges administrateur pour accéder à cette page.",
  totalUsers: "Total utilisateurs",
  totalPosts: "Total publications",
  totalStories: "Total stories",
  totalMessages: "Total messages",
  verifiedUsers: "Utilisateurs vérifiés",
  pendingReports: "Signalements en attente",
  adminDashboardDesc:
    "Gérez les utilisateurs, les signalements et les badges de vérification.",
  usersTab: "Utilisateurs",
  reportsTab: "Signalements",
  noUsersYet: "Aucun utilisateur trouvé",
  noReportsYet: "Aucun signalement en attente",

  // Profile About aliases
  aboutMe: "À propos",
  editAbout: "Modifier",
  location: "Lieu",
  work: "Travail",
  education: "Formation",
  website: "Site web",
  noAboutYet: "Aucune info à propos",
  pinnedPost: "Publication épinglée",
  unpinPost: "Désépingler",
  pinPost: "Épingler",
  friendRequestSent: "Demande d'ami envoyée",
  pendingRequest: "En attente",
  blocked: "Bloqué",
  addFriend: "Ajouter en ami",

  // Stories feed label
  storiesFeed: "Stories",
  addPollOption: "Ajouter une option",
  addPoll: "Sondage",
  userSuspended: "Utilisateur suspendu",
  userBanned: "Utilisateur banni",

  // Password registration
  passwordLabel: "Mot de passe",
  passwordPlaceholder: "Créez un mot de passe sécurisé",
  confirmPasswordLabel: "Confirmer le mot de passe",
  confirmPasswordPlaceholder: "Ressaisissez votre mot de passe",
  passwordRuleMinLength: "Au moins 8 caractères",
  passwordRuleUppercase: "Au moins 1 lettre majuscule",
  passwordRuleLowercase: "Au moins 1 lettre minuscule",
  passwordRuleDigit: "Au moins 1 chiffre",
  passwordMismatch: "Les mots de passe ne correspondent pas",
  passwordTooWeak: "Le mot de passe ne répond pas aux exigences",
  passwordSectionTitle: "Sécurisez votre compte",
  passwordSectionSubtitle:
    "Créez un mot de passe pour protéger votre compte Zaren Veto.",
  emailLabel: "Email (facultatif)",
  securityProtectionMsg:
    "Votre compte est protégé par un mot de passe sécurisé. Seul vous pouvez y accéder.",
  usernameReservedError:
    "Ce nom d'utilisateur est réservé et ne peut pas être utilisé.",
};

const ar: Translations = {
  // App / Header
  appName: "زارن فيتو",
  viewProfile: "عرض الملف الشخصي",
  signOut: "تسجيل الخروج",
  userMenuAriaLabel: "قائمة المستخدم",

  // Navigation
  feed: "المنشورات",
  messages: "الرسائل",
  settings: "الإعدادات",
  profile: "الملف الشخصي",

  // Language switcher
  language: "اللغة",
  langAr: "AR",
  langFr: "FR",
  langEn: "EN",

  // Login page
  tagline: "شبكتك،",
  taglineHighlight: "قواعدك.",
  loginSubtitle:
    "منصة اجتماعية متميزة مبنية على السيادة الرقمية. لا كلمات مرور تُسرق، لا تتبع، لا تنازلات.",
  featureDigitalSovereignty: "السيادة الرقمية",
  featureDigitalSovereigntyDesc: "بياناتك ملكك. لا تتبع ولا استخراج بيانات.",
  featureEncryptedMessages: "الرسائل المشفرة",
  featureEncryptedMessagesDesc: "تشفير من طرف إلى طرف في كل محادثة.",
  featureVisibilityControl: "التحكم في الرؤية",
  featureVisibilityControlDesc:
    "اختر من يرى منشوراتك — الجميع أو المتابعون فقط.",
  featureNoBiometrics: "بدون بيانات بيومترية",
  featureNoBiometricsDesc: "لا سيلفي، لا بصمات، لا مراقبة بيومترية أبدًا.",
  signInSecurely: "تسجيل دخول آمن",
  signInDesc:
    "تستخدم هوية الإنترنت مفاتيح تشفيرية مخزنة على جهازك — لا كلمات مرور لتسريبها أو تخمينها.",
  continueWithII: "المتابعة بهوية الإنترنت",
  connecting: "جارٍ الاتصال…",
  loginDisclaimer:
    "بالمتابعة، أنت توافق على التزام زارن فيتو بخصوصيتك. لا يتم جمع أي بيانات بيومترية.",
  securedBy: "مؤمَّن بتشفير Internet Computer",

  // Registration form
  createYourProfile: "أنشئ ملفك الشخصي",
  createProfileSubtitle: "أعدّ هويتك على زارن فيتو. لا صورة رمزية مطلوبة.",
  username: "اسم المستخدم",
  usernameRequired: "اسم المستخدم *",
  usernamePlaceholder: "مثال: مستخدم_سيادي",
  bio: "السيرة الذاتية",
  bioOptional: "(اختياري)",
  bioPlaceholder: "أخبر العالم من أنت…",
  joiningLabel: "جارٍ إنشاء الملف الشخصي…",
  joinButton: "الانضمام إلى زارن فيتو",
  registrationFailed: "فشل التسجيل. يرجى المحاولة مجددًا.",
  welcomeToast: "مرحبًا بك في زارن فيتو!",
  usernameRequired2: "اسم المستخدم مطلوب",

  // Feed page
  yourFeed: "خلاصتك",
  posts: "منشورات",
  post: "منشور",
  whatsOnYourMind: "ما الذي يدور في ذهنك؟ شارك مع شبكتك…",
  everyone: "الجميع",
  followersOnly: "المتابعون فقط",
  publishing: "جارٍ النشر…",
  publish: "نشر",
  feedIsQuiet: "خلاصتك هادئة",
  feedIsQuietDesc:
    "كن أول من يشارك شيئًا. منشوراتك تصل إلى الجميع في شبكتك — أو متابعيك فحسب.",
  couldNotLoadFeed: "تعذّر تحميل خلاصتك الآن.",
  tryAgain: "حاول مجددًا",
  loadMorePosts: "تحميل المزيد من المنشورات",
  postPublished: "تم نشر المنشور!",
  failedToPublishPost: "فشل نشر المنشور.",
  postUpdated: "تم تحديث المنشور.",
  failedToUpdatePost: "فشل تحديث المنشور.",
  postDeleted: "تم حذف المنشور.",
  failedToDeletePost: "فشل حذف المنشور.",
  edited: "معدَّل",
  followers: "المتابعون",
  editPost: "تعديل المنشور",
  deletePost: "حذف المنشور",
  cancel: "إلغاء",
  saveChanges: "حفظ التغييرات",
  saving: "جارٍ الحفظ…",
  remaining: "متبقية",
  deletePostTitle: "حذف المنشور؟",
  deletePostDesc: "لا يمكن التراجع عن هذا الإجراء. سيُحذف منشورك نهائيًا.",
  deleting: "جارٍ الحذف…",

  // Profile page
  editProfile: "تعديل الملف الشخصي",
  follow: "متابعة",
  unfollow: "إلغاء المتابعة",
  following: "المتابَعون",
  profilePosts: "المنشورات",
  profileFollowers: "المتابعون",
  profileFollowing: "المتابَعون",
  postVisibility: "رؤية المنشورات",
  saveChangesBtn: "حفظ التغييرات",
  cancelBtn: "إلغاء",
  savingBtn: "جارٍ الحفظ…",
  profileUpdated: "تم تحديث الملف الشخصي",
  failedToUpdateProfile: "فشل تحديث الملف الشخصي",
  userNotFound: "المستخدم غير موجود",
  userNotFoundDesc: "هذا الملف الشخصي غير موجود أو ربما تم حذفه.",
  backToFeed: "العودة إلى الخلاصة",
  noPostsYet: "لا توجد منشورات بعد",
  youFollowThisUser: "أنت تتابع هذا المستخدم",
  usernameIsRequired: "اسم المستخدم مطلوب",

  // Messages page
  messagesTitle: "الرسائل",
  allEncrypted: "جميع المحادثات مشفرة من طرف إلى طرف",
  e2eEncrypted: "مشفر E2E",
  searchUsersPlaceholder: "ابحث عن مستخدمين لبدء محادثة جديدة…",
  searching: "جارٍ البحث…",
  noUsersFound: 'لا يوجد مستخدمون لـ "{term}"',
  encrypted: "مشفر",
  noConversationsYet: "لا توجد محادثات بعد",
  noConversationsDesc: "ابحث عن مستخدم أعلاه وابدأ محادثتك المشفرة الأولى.",
  findSomeoneToMessage: "ابحث عن شخص للمراسلة",
  noMessagesYet: "لا توجد رسائل بعد",

  // Settings page
  settingsTitle: "الإعدادات",
  settingsSubtitle: "أدر معلومات حسابك وتفضيلات الخصوصية.",
  accountSection: "الحساب",
  accountSectionDesc: "تحديث معلومات ملفك الشخصي العام.",
  privacySection: "الخصوصية",
  privacySectionDesc: "تحكم في من يمكنه رؤية منشوراتك ونشاط ملفك الشخصي.",
  aboutSection: "حول التطبيق",
  usernameLabel: "اسم المستخدم",
  usernameHint: "يُعرض للمستخدمين الآخرين على ملفك الشخصي ومنشوراتك.",
  bioLabel: "السيرة الذاتية",
  bioHint: "أخبر الآخرين قليلًا عن نفسك…",
  everyoneDesc:
    "منشوراتك وملفك الشخصي مرئيان لجميع مستخدمي زارن فيتو، بمن فيهم من لا يتابعونك.",
  followersOnlyDesc:
    "فقط المستخدمون الذين يتابعونك يمكنهم رؤية منشوراتك وملفك الشخصي. سيرى الزوار الجدد ملفًا شخصيًا مقفلًا.",
  visibilityHint:
    "يسري هذا الإعداد على جميع منشوراتك. يمكنك تغييره في أي وقت — تسري التغييرات فورًا.",
  aboutTitle: "زارن فيتو — منصة السيادة الرقمية",
  aboutDesc:
    "زارن فيتو شبكة اجتماعية تُولي الخصوصية الأولوية حيث تمتلك بياناتك. لا تتبع، لا إعلانات، لا وصول لأطراف ثالثة. رسائلك مشفرة وملفك الشخصي لك وحدك. مبنية على Internet Computer — منصة لامركزية غير قابلة للتلاعب مصممة للسيادة الرقمية الحقيقية.",
  aboutVersion: "الإصدار 1.0 · Internet Computer",
  saveBtn: "حفظ التغييرات",
  savingBtnLabel: "جارٍ الحفظ…",
  settingsSaved: "تم حفظ الإعدادات بنجاح.",
  settingsSaveFailed: "تعذّر حفظ الإعدادات. يرجى المحاولة مجددًا.",
  settingsSaveError: "حدث خطأ أثناء الحفظ. يرجى المحاولة مجددًا.",
  usernameCannotBeEmpty: "لا يمكن أن يكون اسم المستخدم فارغًا.",

  // Reactions & Post actions
  like: "إعجاب",
  liked: "أعجبني",
  react: "تفاعل",
  comment: "تعليق",
  share: "مشاركة",
  savePost: "حفظ المنشور",
  unsavePost: "إلغاء الحفظ",
  reportPost: "الإبلاغ عن المنشور",
  reactionHeart: "أحبه",
  reactionHaha: "هاها",
  reactionWow: "واو",
  reactionSad: "حزين",
  reactionAngry: "غاضب",
  viewComments: "عرض التعليقات",
  addComment: "اكتب تعليقًا…",
  postComment: "نشر",
  replyTo: "الرد على",
  viewReplies: "عرض الردود",
  hideReplies: "إخفاء الردود",
  shareToFeed: "مشاركة في الخلاصة",
  copyLink: "نسخ الرابط",
  linkCopied: "تم نسخ الرابط!",

  // Notifications
  notificationsTitle: "الإشعارات",
  notificationsEmpty: "لا توجد إشعارات بعد",
  notificationsEmptyDesc:
    "عندما يعجب شخص ما بمنشورك أو يعلق عليه أو يتابعك، سيظهر هنا.",
  markAllRead: "تحديد الكل كمقروء",
  notifLiked: "أعجبه منشورك",
  notifCommented: "علّق على منشورك",
  notifFollowed: "بدأ بمتابعتك",
  notifMentioned: "ذكرك في منشور",
  notifShared: "شارك منشورك",
  notifReplied: "ردّ على تعليقك",

  // Profile media upload
  changeCoverPhoto: "تغيير صورة الغلاف",
  changeProfilePhoto: "تغيير صورة الملف الشخصي",
  uploadPhoto: "رفع صورة",
  removePhoto: "حذف الصورة",
  photoUploaded: "تم رفع الصورة بنجاح.",
  photoUploadFailed: "فشل رفع الصورة.",
  coverPhotoUpdated: "تم تحديث صورة الغلاف.",
  profilePhotoUpdated: "تم تحديث صورة الملف الشخصي.",

  // Report
  reportTitle: "الإبلاغ عن هذا المنشور",
  reportSpam: "بريد مزعج",
  reportHarassment: "تحرش أو تنمر",
  reportHateSpeech: "خطاب كراهية",
  reportViolence: "عنف أو محتوى خطير",
  reportMisinformation: "معلومات كاذبة",
  reportNudity: "عري أو محتوى جنسي",
  reportOther: "شيء آخر",
  reportSubmitted: "تم إرسال البلاغ. شكرًا.",
  reportFailed: "فشل إرسال البلاغ.",
  submitReport: "إرسال البلاغ",

  // Policies — navigation / headers
  privacyPolicy: "سياسة الخصوصية",
  termsOfService: "شروط الخدمة",
  communityGuidelines: "إرشادات المجتمع",
  privacyPolicyTitle: "سياسة الخصوصية — زارن فيتو",
  termsTitle: "شروط الخدمة — زارن فيتو",
  guidelinesTitle: "إرشادات المجتمع — زارن فيتو",
  lastUpdated: "آخر تحديث",
  backToHome: "العودة إلى الرئيسية",

  // Privacy Policy sections
  ppIntro:
    "زارن فيتو مبني على التزام راسخ بخصوصيتك. توضح هذه السياسة بدقة البيانات التي نجمعها، وكيفية استخدامها، والحقوق المكفولة لك — بلغة واضحة وبسيطة.",
  ppSection1Title: "١. البيانات التي نجمعها",
  ppSection1Body:
    "نجمع فقط البيانات التي تقدمها صراحةً: اسم المستخدم، السيرة الذاتية، المنشورات، والرسائل. لا نجمع معرّفات الأجهزة، وعناوين IP، وبيانات الموقع، وسجل التصفح، أو أي تحليلات سلوكية. هويتك على الإنترنت مرتبطة تشفيريًا بجهازك ولا تُخزَّن أبدًا على خوادمنا.",
  ppSection2Title: "٢. تشفير البيانات",
  ppSection2Body:
    "جميع البيانات المخزنة على زارن فيتو مشفرة في حالة السكون على شبكة Internet Computer — وهي شبكة لامركزية ومقاومة للتلاعب. الرسائل الخاصة مشفرة أثناء الإرسال. نطبق مبادئ التشفير أولًا في جميع أرجاء بنية المنصة.",
  ppSection3Title: "٣. سياسة عدم التتبع",
  ppSection3Body:
    "لا يستخدم زارن فيتو ملفات تعريف الارتباط للتتبع، أو منارات الويب، أو بكسلات الإعلانات، أو شبكات الإعلانات، أو التنميط السلوكي، أو أي آليات تتبع عبر المواقع. لا نتتبع نشاطك داخل المنصة أو خارجها. لا يوجد أي حزمة تحليلات تابعة لطرف ثالث مدمجة في هذا التطبيق.",
  ppSection4Title: "٤. لا بيانات بيومترية — أبدًا",
  ppSection4Body:
    "لن يطلب زارن فيتو أبدًا أي بيانات بيومترية من أي نوع، ولن يجمعها أو يخزنها — بما في ذلك مسح الوجه، والبصمات، وبصمات الصوت، ومسح القزحية أو الشبكية. وهذا التزام دائم وغير قابل للإلغاء بخصوصية جسدك.",
  ppSection5Title: "٥. لا مشاركة مع أطراف ثالثة",
  ppSection5Body:
    "لا تُباع بياناتك أبدًا، ولا تُؤجَّر، ولا تُرخَّص، ولا تُشارَك مع أي طرف ثالث — سواء أكانوا معلنين أم سماسرة بيانات أم حكومات (إلا بموجب أمر قانوني صالح) أم شركات شريكة. معلوماتك موجودة فقط لتشغيل تجربتك على زارن فيتو.",
  ppSection6Title: "٦. ملكية البيانات وسيادتها",
  ppSection6Body:
    "تحتفظ بالملكية الكاملة لجميع المحتوى الذي تنشئه على زارن فيتو. منشوراتك ورسائلك وبيانات ملفك الشخصي تعود لك. يمتلك زارن فيتو فقط ترخيصًا محدودًا وغير حصري لتخزين محتواك وعرضه وفقًا لإعدادات الخصوصية التي تختارها.",
  ppSection7Title: "٧. حقوقك",
  ppSection7Body:
    "يحق لك في أي وقت الوصول إلى جميع البيانات المرتبطة بحسابك وتصديرها وحذفها نهائيًا. يؤدي حذف حسابك إلى إزالة جميع المنشورات والرسائل وبيانات الملف الشخصي من أنظمتنا بشكل دائم. تبقى بيانات اعتماد هوية الإنترنت تحت سيطرتك الحصرية ولا يمكننا استرجاعها.",
  ppSection8Title: "٨. التغييرات على هذه السياسة",
  ppSection8Body:
    "سيتم الإعلان عن أي تغييرات جوهرية في سياسة الخصوصية هذه داخل التطبيق قبل 30 يومًا على الأقل من دخولها حيز التنفيذ. يُعتبر الاستمرار في استخدام زارن فيتو بعد تاريخ السريان قبولًا بالسياسة المعدَّلة.",
  ppContactTitle: "التواصل",
  ppContactBody:
    "لأي أسئلة تتعلق بالخصوصية، أو مخاوف، أو طلبات بيانات، يرجى استخدام أدوات الإبلاغ المدمجة في التطبيق أو التواصل عبر قنوات الدعم الرسمية. نلتزم بالرد خلال 48 ساعة.",

  // Terms of Service sections
  tosIntro:
    "تحكم شروط الخدمة هذه استخدامك لزارن فيتو. بالوصول إلى المنصة أو استخدامها، فأنت توافق على الالتزام بهذه الشروط. يرجى قراءتها بعناية.",
  tosSection1Title: "١. قبول الشروط",
  tosSection1Body:
    "بإنشاء حساب أو استخدام زارن فيتو، تؤكد أنك قرأت شروط الخدمة هذه وفهمتها وقبلتها. إذا كنت لا توافق، يجب ألا تستخدم المنصة.",
  tosSection2Title: "٢. أهلية الحساب",
  tosSection2Body:
    "يجب أن يكون عمرك 13 سنة على الأقل لإنشاء حساب. يجب أن يحصل المستخدمون بين 13 و18 سنة على موافقة أولياء أمورهم أو أوصيائهم. حساب واحد لكل شخص — يُحظر تشغيل حسابات متعددة للتحايل على إجراءات التطبيق.",
  tosSection3Title: "٣. دقة معلومات الحساب",
  tosSection3Body:
    "تتعهد بتقديم معلومات دقيقة وصادقة في ملفك الشخصي. يُحظر تمامًا انتحال هوية شخص آخر أو منظمة أو شخصية عامة، وسيؤدي ذلك إلى إنهاء الحساب فورًا.",
  tosSection4Title: "٤. المحتوى والسلوكيات المحظورة",
  tosSection4Body:
    "يُحظر عليك نشر أو مشاركة أو الترويج لما يلي: الرسائل المزعجة أو المحتوى التجاري غير المرغوب فيه؛ المضايقة أو التنمر أو الإيذاء المستهدف؛ خطاب الكراهية القائم على العرق أو الدين أو الجنس أو التوجه الجنسي أو الإعاقة؛ التهديد بالعنف أو إيذاء النفس؛ المحتوى غير القانوني؛ المحتوى الجنسي الذي يشمل قاصرين؛ أو المحتوى المصمم للتلاعب بخوارزميات المنصة.",
  tosSection5Title: "٥. ملكية المحتوى",
  tosSection5Body:
    "تحتفظ بحقوق الملكية الفكرية الكاملة لجميع المحتوى الذي تنشره على زارن فيتو. بالنشر، تمنح زارن فيتو ترخيصًا محدودًا وغير حصري وبدون رسوم لتخزين محتواك وعرضه وتوزيعه على الجمهور الذي تختاره وفق إعدادات الرؤية لديك.",
  tosSection6Title: "٦. مسؤولية الحساب",
  tosSection6Body:
    "هوية الإنترنت الخاصة بك تقع على عاتقك وحدك. أنت مسؤول عن جميع الأنشطة التي تُجرى عبر حسابك. لا يمكن لزارن فيتو استرجاع بيانات اعتماد هوية الإنترنت المفقودة — احفظ عبارة الاسترداد الخاصة بك في مكان آمن.",
  tosSection7Title: "٧. الإنهاء والتعليق",
  tosSection7Body:
    "نحتفظ بالحق في تعليق الحسابات التي تنتهك هذه الشروط أو إنهائها نهائيًا، مع إشعار مسبق أو بدونه بحسب درجة خطورة الانتهاك. يمكنك حذف حسابك في أي وقت، مما يؤدي إلى إزالة جميع البيانات المرتبطة به بشكل دائم.",
  tosSection8Title: "٨. توفر الخدمة",
  tosSection8Body:
    "يُقدَّم زارن فيتو 'كما هو' دون ضمانات من أي نوع تتعلق بالتوافر أو الملاءمة أو قابلية التسويق. نحتفظ بالحق في تعديل الميزات أو تعليقها أو إيقافها في أي وقت. سيتم الإعلان عن أعمال الصيانة المجدولة مسبقًا كلما أمكن ذلك.",
  tosSection9Title: "٩. القانون الحاكم",
  tosSection9Body:
    "تخضع هذه الشروط للوائح التجارة الرقمية الدولية المعمول بها. تُحل أي نزاعات أولًا من خلال التفاوض بحسن نية. في حالة عدم الحل، تخضع النزاعات للتحكيم الملزم وفق قواعد معترف بها دوليًا.",

  // Community Guidelines sections
  cgIntro:
    "زارن فيتو مجتمع مبني على الثقة والخصوصية والاحترام. تحدد هذه الإرشادات معايير السلوك المتوقعة من كل عضو. تُعالَج الانتهاكات بجدية وعدالة.",
  cgSection1Title: "احترم الآخرين",
  cgSection1Body:
    "تعامل مع كل شخص على هذه المنصة بكرامة واحترام. لا مكان للمضايقة والتنمر والهجمات الشخصية والإيذاء المستهدف على زارن فيتو. النقاش الصحي مرحب به — القسوة ليست كذلك. يمكنك الاختلاف مع الأفكار دون مهاجمة أصحابها.",
  cgSection2Title: "لا لخطاب الكراهية",
  cgSection2Body:
    "يُحظر تمامًا المحتوى الذي يروج للكراهية أو التمييز أو العنف على أساس العرق أو الإثنية أو الأصل القومي أو الدين أو الجنس أو التوجه الجنسي أو الإعاقة أو وضع الهجرة. يشمل ذلك الإهانات واللغة المهينة ودعوات الإقصاء أو الإيذاء.",
  cgSection3Title: "الهوية الحقيقية",
  cgSection3Body:
    "استخدم هويتك الحقيقية. لا تنشئ حسابات مزيفة أو مكررة، ولا تنتحل هوية أشخاص حقيقيين أو شخصيات عامة، ولا تُزوّر انتماءك للمنظمات. لا تُمنح شارات التوثيق إلا للحسابات الشرعية والمؤكدة.",
  cgSection4Title: "احمِ خصوصية الآخرين",
  cgSection4Body:
    "لا تشارك أبدًا المعلومات الخاصة لشخص آخر دون موافقته الصريحة. يشمل ذلك العناوين وأرقام الهواتف والتفاصيل المالية والوثائق التعريفية والرسائل الخاصة وبيانات الموقع. الكشف عن بيانات الأشخاص (Doxxing) انتهاك خطير يؤدي إلى إنهاء الحساب فورًا.",
  cgSection5Title: "لا للرسائل المزعجة أو الترويج غير المرغوب فيه",
  cgSection5Body:
    "يُحظر النشر الآلي والرسائل الجماعية والمحتوى المتكرر والسلوك غير الأصيل المنسق والترويج التجاري غير المرغوب فيه. لا تستخدم زارن فيتو لتضخيم المحتوى بشكل مصطنع أو التلاعب بالاتجاهات أو تشغيل حسابات الروبوتات.",
  cgSection6Title: "لا لمحتوى الضرر أو الخطر",
  cgSection6Body:
    "لا تنشر محتوى يروج للعنف أو إيذاء النفس أو الإرهاب أو التحديات الخطرة أو الأنشطة غير القانونية. المحتوى الذي يتضمن قاصرين في أي سياق جنسي أو استغلالي محظور تمامًا وسيؤدي إلى إنهاء الحساب فورًا والإبلاغ عنه للسلطات المختصة.",
  cgSection7Title: "الملكية الفكرية",
  cgSection7Body:
    "انشر فقط المحتوى الذي يحق لك مشاركته. احترم حقوق النشر والعلامات التجارية وحقوق الملكية الفكرية. إذا اعتقدت أن حقوقك قد انتُهكت، استخدم وظيفة الإبلاغ المدمجة في التطبيق. سيتم إنهاء حسابات المنتهكين المتكررين.",
  cgSection8Title: "محاربة المعلومات المضللة",
  cgSection8Body:
    "لا تشارك عن سابق علم معلومات كاذبة أو مضللة، ولا سيما المحتوى الذي قد يسبب ضررًا فعليًا. ضع علامة واضحة على الآراء باعتبارها آراء. عند مشاركة الأخبار أو الإحصاءات، استشهد بمصادر موثوقة وقابلة للتحقق.",
  cgReportTitle: "كيفية الإبلاغ عن الانتهاكات",
  cgReportBody:
    "استخدم قائمة '…' على أي منشور أو ملف شخصي لتقديم بلاغ. حدد السبب الأكثر دقة وأضف سياقًا إذا أمكن. تراجع فريق الإشراف جميع البلاغات. ستتلقى إشعارًا بمجرد معالجة بلاغك. الإبلاغ بحسن نية محمي دائمًا — أما البلاغات الكاذبة المقدمة بهدف مضايقة الآخرين فستؤدي بدورها إلى اتخاذ إجراءات تطبيقية.",
  cgEnforcementTitle: "تطبيق القواعد",
  cgEnforcementBody:
    "تؤدي الانتهاكات إلى تطبيق تدريجي: (١) تحذير للانتهاكات البسيطة أو الأولى. (٢) تعليق مؤقت للانتهاكات المتكررة أو المتوسطة. (٣) حظر دائم للانتهاكات الخطيرة، بما في ذلك المحتوى الجنسي الذي يشمل الأطفال وتمجيد الإرهاب أو التحرش المتكرر. تُبلَّغ السلطات المختصة عن الانتهاكات الخطيرة التي تنطوي على محتوى غير قانوني. يمكن الطعن في جميع قرارات التطبيق من خلال عملية الاستئناف الرسمية.",

  // Verification
  verifiedAccount: "حساب موثّق",
  verifiedAccountDesc: "تم التحقق من صحة هذا الحساب.",

  // Stories
  storiesCreate: "إنشاء قصة",
  storiesAddTextOverlay: "أضف نصًا على الصورة…",
  storiesViewedBy: "شاهده",
  storiesExpiresIn: "تنتهي خلال",
  storiesDelete: "حذف القصة",
  storiesNoStories: "لا توجد قصص بعد",
  storiesYourStory: "قصتك",
  storiesPost: "نشر القصة",
  storiesAddImage: "إضافة صورة",
  storiesViewers: "المشاهدون",
  storiesExpired: "منتهية",
  storiesCreateStory: "إنشاء قصة جديدة",
  storiesLoadFailed: "تعذّر تحميل القصص",
  storiesDeleteConfirm: "هل تريد حذف هذه القصة؟",
  storiesDeleteSuccess: "تم حذف القصة",
  storiesCreated: "تم نشر القصة!",

  // Navigation — new tabs
  explore: "استكشاف",
  friends: "الأصدقاء",

  // Explore page
  exploreTitle: "استكشاف",
  exploreSearchPlaceholder: "ابحث عن مستخدمين أو منشورات أو وسوم…",
  exploreTrendingHashtags: "الوسوم الرائجة",
  explorePosts: "المنشورات",
  exploreUsers: "الأشخاص",
  exploreNoResults: "لا توجد نتائج",
  exploreSearchResults: "نتائج البحث",
  exploreHashtagPosts: "منشورات الوسم",
  exploreTypeToSearch: "اكتب للبحث…",

  // Friend requests
  friendsSendRequest: "إضافة صديق",
  friendsAcceptRequest: "قبول",
  friendsDeclineRequest: "رفض",
  friendsCancelRequest: "إلغاء الطلب",
  friendsBlockUser: "حظر",
  friendsUnblockUser: "إلغاء الحظر",
  friendsPendingRequests: "طلبات الصداقة",
  friendsSentRequests: "الطلبات المرسلة",
  friendsNoPendingRequests: "لا توجد طلبات صداقة",
  friendsNoSentRequests: "لا توجد طلبات مرسلة",
  friendsRequestSent: "تم إرسال طلب الصداقة",
  friendsRequestAccepted: "تم قبول الطلب",
  friendsRequestDeclined: "تم رفض الطلب",
  friendsRequestCancelled: "تم إلغاء الطلب",
  friendsUserBlocked: "تم حظر المستخدم",
  friendsUserUnblocked: "تم إلغاء حظر المستخدم",
  friendsRequestFailed: "فشل الإجراء. يرجى المحاولة مجددًا.",
  friendsTitle: "الأصدقاء",
  friendsRequestsReceived: "المستلمة",
  friendsRequestsSent: "المرسلة",

  // About section (profile)
  aboutBio: "السيرة الذاتية",
  aboutLocation: "الموقع",
  aboutWork: "العمل",
  aboutEducation: "التعليم",
  aboutWebsite: "الموقع الإلكتروني",
  aboutEditAbout: "تعديل",
  aboutSaveAbout: "حفظ",
  aboutSectionTitle: "حول",
  aboutUpdated: "تم تحديث قسم حول",
  aboutUpdateFailed: "فشل تحديث قسم حول",
  aboutLocationPlaceholder: "أين تسكن؟",
  aboutWorkPlaceholder: "أين تعمل؟",
  aboutEducationPlaceholder: "أين درست؟",
  aboutWebsitePlaceholder: "https://موقعك.com",

  // Admin dashboard
  adminDashboard: "لوحة التحكم",
  adminUsers: "المستخدمون",
  adminReports: "البلاغات",
  adminStats: "الإحصائيات",
  adminGrantBadge: "منح الشارة",
  adminRevokeBadge: "سحب الشارة",
  adminSuspendUser: "تعليق",
  adminBanUser: "حظر",
  adminResolveReport: "حل البلاغ",
  adminDismissReport: "رفض البلاغ",
  adminTotalUsers: "إجمالي المستخدمين",
  adminTotalPosts: "إجمالي المنشورات",
  adminVerifiedUsers: "المستخدمون الموثقون",
  adminPendingReports: "البلاغات المعلقة",
  adminTotalMessages: "إجمالي الرسائل",
  adminTotalStories: "إجمالي القصص",
  adminSuspendDuration: "مدة التعليق",
  adminSuspendHours: "ساعة",
  adminUserSuspended: "تم تعليق المستخدم",
  adminUserBanned: "تم حظر المستخدم",
  adminBadgeGranted: "تم منح شارة التوثيق",
  adminBadgeRevoked: "تم سحب شارة التوثيق",
  adminReportResolved: "تم حل البلاغ",
  adminActionFailed: "فشل الإجراء. يرجى المحاولة مجددًا.",
  adminNoReports: "لا توجد بلاغات معلقة",
  adminNoUsers: "لا يوجد مستخدمون",
  adminPage: "صفحة",
  adminNextPage: "التالي",
  adminPrevPage: "السابق",

  // Polls
  pollCreate: "إنشاء استطلاع",
  pollAddOption: "إضافة خيار",
  pollVote: "تصويت",
  pollResults: "نتائج الاستطلاع",
  pollTotalVotes: "أصوات",
  pollQuestion: "السؤال",
  pollOption: "خيار",
  pollVoted: "تم تسجيل صوتك!",
  pollVoteFailed: "فشل تسجيل الصوت.",
  pollRemoveOption: "حذف الخيار",
  pollQuestionPlaceholder: "اطرح سؤالًا…",
  pollOptionPlaceholder: "خيار",

  // Message reactions
  msgReact: "تفاعل",
  msgRemoveReaction: "إزالة التفاعل",
  msgReactions: "التفاعلات",
  msgReactionAdded: "تم إضافة التفاعل",
  msgReactionRemoved: "تم إزالة التفاعل",

  // Read receipts
  msgRead: "مقروء",
  msgDelivered: "تم التسليم",
  msgReadAt: "قرئ في",

  // Pin post
  postPin: "تثبيت المنشور",
  postUnpin: "إلغاء التثبيت",
  postPinned: "تم تثبيت المنشور",
  postUnpinned: "تم إلغاء تثبيت المنشور",
  postPinnedLabel: "مثبّت",

  // Convenience aliases
  actionFailed: "فشل الإجراء. يرجى المحاولة مجددًا.",
  verificationGranted: "تم منح شارة التوثيق",
  verificationRevoked: "تم سحب شارة التوثيق",
  revoke: "سحب",
  grant: "منح",
  suspend: "تعليق",
  ban: "حظر",
  reportResolved: "تم حل البلاغ",
  reportedBy: "بُلِّغ بواسطة",
  reportedUser: "المستخدم المُبلَّغ عنه",
  reportedPost: "المنشور المُبلَّغ عنه",
  deleteContent: "حذف المحتوى",
  dismiss: "رفض",
  accessDenied: "وصول مرفوض",
  accessDeniedDesc: "تحتاج إلى صلاحيات المشرف للوصول إلى هذه الصفحة.",
  totalUsers: "إجمالي المستخدمين",
  totalPosts: "إجمالي المنشورات",
  totalStories: "إجمالي القصص",
  totalMessages: "إجمالي الرسائل",
  verifiedUsers: "المستخدمون الموثقون",
  pendingReports: "البلاغات المعلقة",
  adminDashboardDesc: "أدر المستخدمين والبلاغات وشارات التوثيق.",
  usersTab: "المستخدمون",
  reportsTab: "البلاغات",
  noUsersYet: "لا يوجد مستخدمون",
  noReportsYet: "لا توجد بلاغات معلقة",

  // Profile About aliases
  aboutMe: "حول",
  editAbout: "تعديل",
  location: "الموقع",
  work: "العمل",
  education: "التعليم",
  website: "الموقع الإلكتروني",
  noAboutYet: "لا توجد معلومات حول بعد",
  pinnedPost: "منشور مثبّت",
  unpinPost: "إلغاء التثبيت",
  pinPost: "تثبيت المنشور",
  friendRequestSent: "تم إرسال طلب الصداقة",
  pendingRequest: "معلّق",
  blocked: "محظور",
  addFriend: "إضافة صديق",

  // Stories feed label
  storiesFeed: "القصص",
  addPollOption: "إضافة خيار",
  addPoll: "استطلاع",
  userSuspended: "تم تعليق المستخدم",
  userBanned: "تم حظر المستخدم",

  // Password registration
  passwordLabel: "كلمة المرور",
  passwordPlaceholder: "أنشئ كلمة مرور آمنة",
  confirmPasswordLabel: "تأكيد كلمة المرور",
  confirmPasswordPlaceholder: "أعد إدخال كلمة المرور",
  passwordRuleMinLength: "8 أحرف على الأقل",
  passwordRuleUppercase: "حرف كبير واحد على الأقل",
  passwordRuleLowercase: "حرف صغير واحد على الأقل",
  passwordRuleDigit: "رقم واحد على الأقل",
  passwordMismatch: "كلمتا المرور غير متطابقتين",
  passwordTooWeak: "كلمة المرور لا تستوفي المتطلبات",
  passwordSectionTitle: "أمّن حسابك",
  passwordSectionSubtitle: "أنشئ كلمة مرور لحماية حسابك على زارن فيتو.",
  emailLabel: "البريد الإلكتروني (اختياري)",
  securityProtectionMsg:
    "حسابك محمي بكلمة مرور آمنة. أنت وحدك يمكنك الوصول إليه.",
  usernameReservedError: "اسم المستخدم هذا محجوز ولا يمكن استخدامه.",
};

export const translations: Record<Language, Translations> = { en, fr, ar };
