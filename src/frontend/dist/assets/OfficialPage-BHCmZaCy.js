const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-jDDIPp20.js","assets/index-CvIOltKC.js","assets/index-B1oBwxt7.css"])))=>i.map(i=>d[i]);
import { b as createLucideIcon, u as useNavigate, a as useLanguage, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, S as Skeleton, e as ue, _ as __vitePreload, m as motion, X } from "./index-CvIOltKC.js";
import { L as Layout, i as isVerifiedUser, U as Users, V as VerificationBadge } from "./Layout-B9hj0KjP.js";
import { B as Button } from "./button-D8P5m97v.js";
import { T as Textarea } from "./textarea-CtAPxEeQ.js";
import { a as useAuthenticatedBackend, u as useCurrentUser, c as useMutation, b as useQuery } from "./index-jDDIPp20.js";
import { u as useImageUpload, C as Camera } from "./useImageUpload-CfDjqD8b.js";
import { C as Check } from "./check-ISwKLAqX.js";
import { A as ArrowLeft } from "./arrow-left-z1ZYzBE8.js";
import { I as ImagePlus } from "./image-plus-CJGwlLhu.js";
import { H as Heart } from "./heart-D7vg38oc.js";
import { M as MessageSquare } from "./message-square-I_6x42ok.js";
import { S as Share2 } from "./share-2-BRGqxP2j.js";
import { S as Send } from "./send-DOlGNUpF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode);
const AVATAR_SIZE = 112;
function renderPostContent(content) {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const matches = Array.from(
    content.matchAll(new RegExp(urlRegex.source, "g"))
  );
  if (matches.length === 0) return content;
  const segments = [];
  let lastIndex = 0;
  for (const match of matches) {
    const url = match[0];
    const start = match.index ?? 0;
    const before = content.slice(lastIndex, start);
    if (before) segments.push(before);
    segments.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-[#1877F2] underline hover:text-blue-400 break-all",
          onClick: (e) => e.stopPropagation(),
          children: url
        },
        start
      )
    );
    lastIndex = start + url.length;
  }
  const tail = content.slice(lastIndex);
  if (tail) segments.push(tail);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: segments });
}
function ShieldLogo({ size = 80 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 200 200",
      fill: "none",
      width: size,
      height: size,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M38 42 L100 18 L162 42 L162 100 C162 144 134 172 100 185 C66 172 38 144 38 100 Z",
            fill: "#4169E1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M67 72 L133 72 L133 86 L91 122 L133 122 L133 136 L67 136 L67 122 L109 86 L67 86 Z",
            fill: "#ffffff"
          }
        )
      ]
    }
  );
}
function CameraUploadButton({
  onFile,
  ocid,
  className,
  title,
  uploading
}) {
  const ref = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref,
        type: "file",
        accept: "image/*",
        className: "sr-only",
        disabled: uploading,
        onChange: (e) => {
          var _a;
          const file = (_a = e.target.files) == null ? void 0 : _a[0];
          if (file) onFile(file);
          if (ref.current) ref.current.value = "";
        },
        "aria-label": title
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        title,
        "aria-label": title,
        "data-ocid": ocid,
        disabled: uploading,
        onClick: () => {
          var _a;
          return (_a = ref.current) == null ? void 0 : _a.click();
        },
        className: `transition-smooth ${className ?? ""}`,
        children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin block" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4" })
      }
    )
  ] });
}
const REACTIONS = [
  { emoji: "👍", label: "J'aime" },
  { emoji: "❤️", label: "J'adore" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Triste" },
  { emoji: "😡", label: "Grrr" }
];
function OfficialPostCard({ post, index }) {
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const [liked, setLiked] = reactExports.useState(false);
  const [likeCount, setLikeCount] = reactExports.useState(0);
  const [showReactions, setShowReactions] = reactExports.useState(false);
  const [activeReaction, setActiveReaction] = reactExports.useState(null);
  const [commentText, setCommentText] = reactExports.useState("");
  const [showCommentBox, setShowCommentBox] = reactExports.useState(false);
  const [submittingComment, setSubmittingComment] = reactExports.useState(false);
  const { t } = useLanguage();
  const handleLike = () => {
    if (activeReaction) {
      const prevReaction = activeReaction;
      const prevLiked = liked;
      const prevCount = likeCount;
      setActiveReaction(null);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      if (actor) {
        actor.unlikePost(post.id).catch(() => {
          setActiveReaction(prevReaction);
          setLiked(prevLiked);
          setLikeCount(prevCount);
        });
      }
    } else {
      const wasLiked = liked;
      const prevCount = likeCount;
      setLiked((v) => !v);
      setLikeCount((c) => wasLiked ? Math.max(0, c - 1) : c + 1);
      if (actor) {
        const call = wasLiked ? actor.unlikePost(post.id) : actor.likePost(post.id);
        call.catch(() => {
          setLiked(wasLiked);
          setLikeCount(prevCount);
        });
      }
    }
    setShowReactions(false);
  };
  const handleReaction = (emoji, label) => {
    const prevReaction = activeReaction;
    const prevLiked = liked;
    const prevCount = likeCount;
    if (activeReaction === emoji) {
      setActiveReaction(null);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      if (actor) {
        actor.removeReaction(post.id).catch(() => {
          setActiveReaction(prevReaction);
          setLiked(prevLiked);
          setLikeCount(prevCount);
        });
      }
    } else {
      if (!activeReaction) setLikeCount((c) => c + 1);
      setActiveReaction(emoji);
      setLiked(true);
      ue.success(label);
      if (actor) {
        actor.likePost(post.id).catch(() => {
          setActiveReaction(prevReaction);
          setLiked(prevLiked);
          setLikeCount(prevCount);
        });
      }
    }
    setShowReactions(false);
  };
  const handleShare = () => {
    const url = `${window.location.origin}/official-page`;
    const encodedUrl = encodeURIComponent(url);
    const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
    if (hasNativeShare) {
      void navigator.share({ title: "Zaren Veto — Page officielle", url }).catch(() => {
      });
      return;
    }
    window.open(
      `https://wa.me/?text=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || submittingComment || !actor) return;
    setSubmittingComment(true);
    try {
      await actor.addComment(post.id, text);
      await queryClient.invalidateQueries({
        queryKey: ["officialPostComments", post.id.toString()]
      });
      setCommentText("");
      ue.success(t.postComment);
    } catch {
      ue.error(t.actionFailed);
    } finally {
      setSubmittingComment(false);
    }
  };
  const formattedDate = new Date(
    Number(post.createdAt) / 1e6
  ).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.08 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth",
      "data-ocid": `official-page.post.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-5 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-10 h-10 rounded-full border border-border/60 flex items-center justify-center shrink-0 overflow-hidden",
                style: { background: "#0d1230" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 24 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "inline-flex items-center text-sm font-semibold text-foreground gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Zaren Veto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 15 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formattedDate })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: renderPostContent(post.content) }),
          post.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-lg overflow-hidden border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: post.imageUrl,
              alt: "Contenu de la publication",
              className: "w-full object-cover max-h-80"
            }
          ) }),
          (likeCount > 0 || activeReaction) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs text-muted-foreground", children: [
            activeReaction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: activeReaction }),
            !activeReaction && liked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "👍" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: likeCount })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-t border-border/60 flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            showReactions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reaction-picker absolute bottom-full mb-1 left-0 z-30", children: REACTIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                title: r.label,
                "aria-label": r.label,
                onClick: () => handleReaction(r.emoji, r.label),
                className: "text-2xl p-1 rounded-full transition-transform hover:scale-125 hover:-translate-y-1 border-none bg-transparent cursor-pointer",
                children: r.emoji
              },
              r.emoji
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleLike,
                onMouseEnter: () => setShowReactions(true),
                onMouseLeave: () => setTimeout(() => setShowReactions(false), 400),
                className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${liked ? "text-[#E0245E] font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": `official-page.like_button.${index + 1}`,
                children: [
                  activeReaction ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: activeReaction }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Heart,
                    {
                      className: `w-4 h-4 ${liked ? "fill-[#E0245E] text-[#E0245E]" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: liked ? activeReaction ? activeReaction === "❤️" ? "J'adore" : "Réaction" : "J'aime" : t.like })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowCommentBox((v) => !v),
              className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
              "data-ocid": `official-page.comment_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.comment })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleShare,
              className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth ms-auto",
              "data-ocid": `official-page.share_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.share })
              ]
            }
          )
        ] }),
        showCommentBox && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3 border-t border-border/40 pt-3 space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => void handleSubmitComment(e),
            className: "flex gap-2 items-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: commentText,
                  onChange: (e) => setCommentText(e.target.value),
                  placeholder: t.addComment,
                  className: "flex-1 text-sm bg-secondary rounded-full px-4 py-2 border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring",
                  disabled: submittingComment,
                  maxLength: 500,
                  "data-ocid": `official-page.comment_input.${index + 1}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: !commentText.trim() || submittingComment,
                  className: "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 transition-smooth hover:bg-primary/90",
                  "aria-label": t.postComment,
                  "data-ocid": `official-page.post_comment_button.${index + 1}`,
                  children: submittingComment ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin block" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" })
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
function useOfficialPage() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["officialPage"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOfficialPage();
    },
    enabled: !!actor && !isFetching,
    retry: false
  });
}
function useOfficialPosts() {
  const { actor, isFetching } = useAuthenticatedBackend();
  return useQuery({
    queryKey: ["officialPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOfficialPagePosts(BigInt(0), BigInt(50));
    },
    enabled: !!actor && !isFetching,
    retry: false
  });
}
function OfficialPage() {
  var _a;
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const { actor } = useAuthenticatedBackend();
  const queryClient = useQueryClient();
  const { status, profile: myProfile } = useCurrentUser();
  const { uploadImage } = useImageUpload();
  const postImageRef = reactExports.useRef(null);
  const [following, setFollowing] = reactExports.useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = reactExports.useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = reactExports.useState(null);
  const [uploadingCover, setUploadingCover] = reactExports.useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = reactExports.useState(false);
  const [newPostContent, setNewPostContent] = reactExports.useState("");
  const [newPostImage, setNewPostImage] = reactExports.useState(null);
  const [publishing, setPublishing] = reactExports.useState(false);
  const [pageLinkCopied, setPageLinkCopied] = reactExports.useState(false);
  const handleCopyPageLink = () => {
    var _a2;
    const url = `${window.location.origin}/official-page`;
    const onSuccess = () => {
      setPageLinkCopied(true);
      ue.success(t.linkCopied);
      setTimeout(() => setPageLinkCopied(false), 3e3);
    };
    const fallback = () => {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        onSuccess();
      } catch {
        ue.error(t.actionFailed ?? "Impossible de copier");
      }
    };
    if ((_a2 = navigator.clipboard) == null ? void 0 : _a2.writeText) {
      navigator.clipboard.writeText(url).then(onSuccess).catch(fallback);
    } else {
      fallback();
    }
  };
  const { data: officialPage, isLoading: pageLoading } = useOfficialPage();
  const officialId = ((_a = officialPage == null ? void 0 : officialPage.id) == null ? void 0 : _a.toString()) ?? null;
  const { data: posts, isLoading: postsLoading } = useOfficialPosts();
  reactExports.useEffect(() => {
    const savedCover = localStorage.getItem("officialPage_cover");
    const savedAvatar = localStorage.getItem("officialPage_avatar");
    if (savedCover) setCoverPhotoUrl(savedCover);
    else if (officialPage == null ? void 0 : officialPage.coverPhotoUrl)
      setCoverPhotoUrl(officialPage.coverPhotoUrl);
    if (savedAvatar) setProfilePhotoUrl(savedAvatar);
    else if (officialPage == null ? void 0 : officialPage.profilePhotoUrl)
      setProfilePhotoUrl(officialPage.profilePhotoUrl);
  }, [officialPage == null ? void 0 : officialPage.coverPhotoUrl, officialPage == null ? void 0 : officialPage.profilePhotoUrl]);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const isOwner = status === "authenticated" && myProfile !== null && isVerifiedUser(myProfile.username, myProfile.isVerified);
  const handleCoverFile = async (file) => {
    if (uploadingCover) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload returned empty URL");
      setCoverPhotoUrl(url);
      localStorage.setItem("officialPage_cover", url);
      void queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      ue.success(t.coverPhotoUpdated ?? "Photo de couverture mise à jour ✓");
    } catch (err) {
      console.error("Cover upload error:", err);
      ue.error(t.photoUploadFailed ?? "Échec du téléchargement — réessayez");
    } finally {
      setUploadingCover(false);
    }
  };
  const handleProfileFile = async (file) => {
    if (uploadingProfilePhoto) return;
    setUploadingProfilePhoto(true);
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload returned empty URL");
      setProfilePhotoUrl(url);
      localStorage.setItem("officialPage_avatar", url);
      void queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      ue.success(t.profilePhotoUpdated ?? "Photo de profil mise à jour ✓");
    } catch (err) {
      console.error("Profile upload error:", err);
      ue.error(t.photoUploadFailed ?? "Échec du téléchargement — réessayez");
    } finally {
      setUploadingProfilePhoto(false);
    }
  };
  const handlePostImageSelect = async (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setNewPostImage(url);
    } catch {
      ue.error(t.photoUploadFailed);
    } finally {
      if (postImageRef.current) postImageRef.current.value = "";
    }
  };
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !officialId) throw new Error("Not available");
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-jDDIPp20.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      if (following) {
        return actor.unfollowUser(Principal.fromText(officialId));
      }
      return actor.followUser(Principal.fromText(officialId));
    },
    onSuccess: () => {
      setFollowing((v) => !v);
      void queryClient.invalidateQueries({ queryKey: ["officialPage"] });
    },
    onError: () => ue.error(t.actionFailed)
  });
  const handlePublish = async () => {
    const content = newPostContent.trim();
    if (!content || publishing) return;
    if (!actor) {
      ue.error("Non authentifié — veuillez vous reconnecter");
      return;
    }
    if (!isOwner) {
      ue.error("Seul(e) la fondatrice peut publier sur cette page");
      return;
    }
    setPublishing(true);
    try {
      const result = await actor.createOfficialPost(
        content,
        newPostImage ?? null
      );
      if ("__kind__" in result && result.__kind__ === "err") {
        throw new Error(result.err);
      }
      void queryClient.invalidateQueries({ queryKey: ["officialPosts"] });
      setNewPostContent("");
      setNewPostImage(null);
      ue.success(t.postPublished ?? "Publié avec succès ✓");
    } catch (err) {
      console.error("Publish error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      ue.error(
        msg.length < 100 ? msg : t.failedToPublishPost ?? "Échec de la publication"
      );
    } finally {
      setPublishing(false);
    }
  };
  if (status === "initializing" || pageLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "max-w-2xl mx-auto space-y-4 px-3",
        "data-ocid": "official-page.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-52" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-60" })
          ] })
        ] })
      }
    ) });
  }
  const postCount = (posts == null ? void 0 : posts.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto space-y-5 pb-8",
      "data-ocid": "official-page.page",
      dir: isRTL ? "rtl" : "ltr",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "bg-card border border-border rounded-2xl shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative w-full rounded-t-2xl",
                  style: {
                    height: 200,
                    overflow: "hidden"
                  },
                  children: [
                    coverPhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: coverPhotoUrl,
                        alt: "Couverture de la page",
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "w-full h-full",
                        style: {
                          background: "linear-gradient(135deg, #0f1c5e 0%, #2a3fa8 40%, #4169E1 65%, #5c7df5 85%, #2845b8 100%)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 180 }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-6 opacity-[0.12] pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 52 }) })
                        ]
                      }
                    ),
                    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-3 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CameraUploadButton,
                      {
                        onFile: (f) => void handleCoverFile(f),
                        uploading: uploadingCover,
                        ocid: "official-page.cover_photo_upload_button",
                        title: t.changeCoverPhoto,
                        className: "flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black/85 backdrop-blur-sm"
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative px-5", style: { marginTop: -56 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-full border-4 border-card shadow-lg overflow-hidden flex items-center justify-center",
                    style: {
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      backgroundColor: "#0d1230",
                      zIndex: 10,
                      position: "relative"
                    },
                    "data-ocid": "official-page.avatar",
                    children: profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: profilePhotoUrl,
                        alt: "Zaren Veto",
                        className: "w-full h-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 68 })
                  }
                ),
                isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1 right-1 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CameraUploadButton,
                  {
                    onFile: (f) => void handleProfileFile(f),
                    uploading: uploadingProfilePhoto,
                    ocid: "official-page.profile_photo_upload_button",
                    title: t.changeProfilePhoto,
                    className: "w-8 h-8 rounded-full flex items-center justify-center bg-black/75 hover:bg-black/90 border-2 border-card text-white shadow-md"
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 pt-2", children: [
                !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: following ? "outline" : "default",
                    size: "sm",
                    onClick: () => void followMutation.mutateAsync(),
                    disabled: followMutation.isPending,
                    className: "gap-2",
                    "data-ocid": "official-page.follow_button",
                    children: [
                      followMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                      following ? t.unfollow : t.follow
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground inline-flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Zaren Veto" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 22 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: { color: "#4169E1" }, children: "Page officielle" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mt-4 pt-4 border-t border-border/60 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-foreground", children: "19k" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tracking-wide", children: t.profileFollowers })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-foreground", children: postCount }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tracking-wide", children: t.profilePosts })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "ms-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                      style: {
                        color: "#4169E1",
                        borderColor: "#4169E133",
                        background: "#4169E10f"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 12 }),
                        "Page Officielle"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleCopyPageLink,
                    className: `mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-smooth shadow-sm active:scale-[0.98] border ${pageLinkCopied ? "bg-green-600 text-white border-green-500/50" : "text-white border-[#4169E1]/70 hover:brightness-110"}`,
                    style: pageLinkCopied ? {} : { background: "#4169E1" },
                    "data-ocid": "official-page.copy_link_button",
                    children: [
                      pageLinkCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                      pageLinkCopied ? t.linkCopied ?? "Lien copié !" : t.copyLink ?? "Copier le lien de la page"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => void navigate({ to: "/" }),
            className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth px-1",
            "data-ocid": "official-page.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              t.backToFeed
            ]
          }
        ),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3, delay: 0.1 },
            className: "bg-card border border-border rounded-xl p-4 space-y-3",
            "data-ocid": "official-page.create_post_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-full border border-border/60 flex items-center justify-center shrink-0 overflow-hidden",
                    style: { background: "#0d1230" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 22 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Publier sur la page Zaren Veto" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: newPostContent,
                  onChange: (e) => setNewPostContent(e.target.value),
                  placeholder: t.whatsOnYourMind,
                  rows: 3,
                  maxLength: 500,
                  className: "bg-secondary border-input resize-none text-sm",
                  "data-ocid": "official-page.post_input"
                }
              ),
              newPostImage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block rounded-lg overflow-hidden border border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: newPostImage,
                    alt: "Aperçu de la publication",
                    className: "max-h-40 object-cover rounded-lg"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setNewPostImage(null),
                    className: "absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-smooth",
                    "aria-label": "Supprimer la photo",
                    "data-ocid": "official-page.remove_post_image_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    newPostContent.length,
                    "/500"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: postImageRef,
                        type: "file",
                        accept: "image/*,video/*",
                        className: "sr-only",
                        onChange: (e) => void handlePostImageSelect(e),
                        "aria-label": "Ajouter une photo ou vidéo"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var _a2;
                          return (_a2 = postImageRef.current) == null ? void 0 : _a2.click();
                        },
                        className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary transition-smooth",
                        title: "Ajouter une photo ou vidéo",
                        "data-ocid": "official-page.post_image_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-3.5 h-3.5" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    disabled: !newPostContent.trim() || publishing,
                    onClick: () => void handlePublish(),
                    className: "gap-2 min-w-[90px]",
                    "data-ocid": "official-page.publish_button",
                    children: publishing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                      "Publication…"
                    ] }) : t.publish
                  }
                )
              ] })
            ]
          }
        ),
        postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "space-y-4",
            "data-ocid": "official-page.posts_list.loading_state",
            children: ["a", "b"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-xl p-5 space-y-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
                ]
              },
              k
            ))
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "official-page.posts_list", children: [
          (!posts || posts.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl gap-3",
              "data-ocid": "official-page.posts_list.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 40 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "Aucune publication pour l'instant" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: isOwner ? "Publiez le premier message sur la page officielle Zaren Veto." : "Revenez bientôt pour découvrir les actualités de Zaren Veto." })
              ]
            }
          ),
          posts && posts.length > 0 && posts.map((post, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            OfficialPostCard,
            {
              post,
              index
            },
            post.id.toString()
          ))
        ] })
      ]
    }
  ) });
}
export {
  OfficialPage as default
};
