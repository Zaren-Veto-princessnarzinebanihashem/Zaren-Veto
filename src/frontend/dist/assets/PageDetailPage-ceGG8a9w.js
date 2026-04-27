const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-jDDIPp20.js","assets/index-CvIOltKC.js","assets/index-B1oBwxt7.css"])))=>i.map(i=>d[i]);
import { u as useNavigate, a as useLanguage, d as useQueryClient, f as useParams, r as reactExports, j as jsxRuntimeExports, S as Skeleton, m as motion, _ as __vitePreload, e as ue } from "./index-CvIOltKC.js";
import { i as isVerifiedUser, L as Layout, U as Users, V as VerificationBadge } from "./Layout-B9hj0KjP.js";
import { B as Button } from "./button-D8P5m97v.js";
import { T as Textarea } from "./textarea-CtAPxEeQ.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery, V as Visibility } from "./index-jDDIPp20.js";
import { A as ArrowLeft } from "./arrow-left-z1ZYzBE8.js";
import { L as Link2 } from "./link-2-DUuL6bjl.js";
import { F as FileText } from "./file-text-BmS__72b.js";
import { H as Heart } from "./heart-D7vg38oc.js";
import { M as MessageSquare } from "./message-square-I_6x42ok.js";
import { S as Share2 } from "./share-2-BRGqxP2j.js";
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
function PagePostCard({ post, index }) {
  const { actor } = useAuthenticatedBackend();
  const [liked, setLiked] = reactExports.useState(false);
  const [likeCount, setLikeCount] = reactExports.useState(0);
  const [showComment, setShowComment] = reactExports.useState(false);
  const [commentText, setCommentText] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const qc = useQueryClient();
  const { t } = useLanguage();
  const formattedDate = new Date(
    Number(post.createdAt) / 1e6
  ).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const handleLike = () => {
    if (!actor) return;
    const wasLiked = liked;
    setLiked((v) => !v);
    setLikeCount((c) => wasLiked ? Math.max(0, c - 1) : c + 1);
    const call = wasLiked ? actor.unlikePost(post.id) : actor.likePost(post.id);
    call.catch(() => {
      setLiked(wasLiked);
      setLikeCount((c) => wasLiked ? c + 1 : Math.max(0, c - 1));
    });
  };
  const handleComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || !actor || submitting) return;
    setSubmitting(true);
    try {
      await actor.addComment(post.id, text);
      void qc.invalidateQueries({
        queryKey: ["pageComments", post.id.toString()]
      });
      setCommentText("");
      ue.success(t.postComment);
    } catch {
      ue.error(t.actionFailed);
    } finally {
      setSubmitting(false);
    }
  };
  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id.toString()}`;
    if (navigator.share) {
      void navigator.share({ title: "Zaren Veto", url }).catch(() => {
      });
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      "_blank",
      "noopener"
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.article,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-smooth",
      "data-ocid": `page-detail.post.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-5 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: renderPostContent(post.content) }),
          post.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-lg overflow-hidden border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: post.imageUrl,
              alt: "Post",
              className: "w-full object-cover max-h-80"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: formattedDate })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-t border-border/60 flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleLike,
              className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${liked ? "text-[#E0245E]" : "text-muted-foreground hover:text-foreground"}`,
              "data-ocid": `page-detail.like_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${liked ? "fill-[#E0245E]" : ""}` }),
                likeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: likeCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setShowComment((v) => !v),
              className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
              "data-ocid": `page-detail.comment_button.${index + 1}`,
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
              "data-ocid": `page-detail.share_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.share })
              ]
            }
          )
        ] }),
        showComment && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3 border-t border-border/40 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => void handleComment(e),
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
                  disabled: submitting,
                  maxLength: 500,
                  "data-ocid": `page-detail.comment_input.${index + 1}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  disabled: !commentText.trim() || submitting,
                  className: "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 transition-smooth hover:bg-primary/90",
                  "aria-label": t.postComment,
                  children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin block" }) : "→"
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
function PageDetailPage() {
  const { status, profile: myProfile } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const params = useParams({ strict: false });
  const pageId = params.pageId ?? "";
  const [following, setFollowing] = reactExports.useState(false);
  const [newPostContent, setNewPostContent] = reactExports.useState("");
  const [publishing, setPublishing] = reactExports.useState(false);
  const [linkCopied, setLinkCopied] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ["pageDetail", pageId],
    queryFn: async () => {
      if (!actor || !pageId) return null;
      try {
        const { Principal } = await __vitePreload(async () => {
          const { Principal: Principal2 } = await import("./index-jDDIPp20.js").then((n) => n.i);
          return { Principal: Principal2 };
        }, true ? __vite__mapDeps([0,1,2]) : void 0);
        return await actor.getUserProfile(Principal.fromText(pageId)) ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!pageId,
    retry: false
  });
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["pageDetailPosts", pageId],
    queryFn: async () => {
      if (!actor || !pageId) return [];
      try {
        const { Principal } = await __vitePreload(async () => {
          const { Principal: Principal2 } = await import("./index-jDDIPp20.js").then((n) => n.i);
          return { Principal: Principal2 };
        }, true ? __vite__mapDeps([0,1,2]) : void 0);
        return await actor.getUserPosts(Principal.fromText(pageId)) ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!pageId,
    retry: false
  });
  const isVerified = isVerifiedUser((page == null ? void 0 : page.username) ?? "", page == null ? void 0 : page.isVerified);
  const isOwner = status === "authenticated" && myProfile !== null && myProfile.id.toText() === pageId;
  const handleFollow = async () => {
    if (!actor) return;
    try {
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-jDDIPp20.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      if (following) {
        await actor.unfollowUser(Principal.fromText(pageId));
        setFollowing(false);
      } else {
        await actor.followUser(Principal.fromText(pageId));
        setFollowing(true);
      }
      void qc.invalidateQueries({ queryKey: ["pageDetail", pageId] });
    } catch {
      ue.error(t.actionFailed);
    }
  };
  const handlePublish = async () => {
    const content = newPostContent.trim();
    if (!content || publishing || !actor) return;
    setPublishing(true);
    try {
      const result = await actor.createPost(
        content,
        Visibility.everyone,
        [],
        null
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      void qc.invalidateQueries({ queryKey: ["pageDetailPosts", pageId] });
      setNewPostContent("");
      ue.success(t.postPublished);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.failedToPublishPost;
      ue.error(msg);
    } finally {
      setPublishing(false);
    }
  };
  const handleCopyLink = () => {
    var _a;
    const url = `${window.location.origin}/pages/${pageId}`;
    const doCopy = () => {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setLinkCopied(true);
      ue.success(t.linkCopied);
      setTimeout(() => setLinkCopied(false), 3e3);
    };
    if ((_a = navigator.clipboard) == null ? void 0 : _a.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setLinkCopied(true);
        ue.success(t.linkCopied);
        setTimeout(() => setLinkCopied(false), 3e3);
      }).catch(doCopy);
    } else {
      doCopy();
    }
  };
  if (status === "initializing" || pageLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-56 w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] }) });
  }
  if (!page) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto py-16 text-center",
        "data-ocid": "page-detail.not_found",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Page introuvable" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => void navigate({ to: "/pages" }),
              children: "Retour aux pages"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto space-y-5 pb-8",
      "data-ocid": "page-detail.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => void navigate({ to: "/pages" }),
            className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth px-1",
            "data-ocid": "page-detail.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Toutes les pages"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "bg-card border border-border rounded-2xl overflow-hidden shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-48 relative overflow-hidden",
                  style: {
                    background: page.coverPhotoUrl ? void 0 : "linear-gradient(135deg,#0f1c5e 0%,#4169E1 60%,#5c7df5 100%)"
                  },
                  children: page.coverPhotoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: page.coverPhotoUrl,
                      alt: "Cover",
                      className: "w-full h-full object-cover"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 pt-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-end justify-between gap-3",
                    style: { marginTop: -40 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full border-4 border-card bg-secondary overflow-hidden flex items-center justify-center shadow-md", children: page.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: page.profilePhotoUrl,
                          alt: page.username,
                          className: "w-full h-full object-cover"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-primary", children: page.username.slice(0, 1).toUpperCase() }) }),
                      !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: following ? "outline" : "default",
                          size: "sm",
                          onClick: () => void handleFollow(),
                          className: "gap-2 mb-1",
                          "data-ocid": "page-detail.follow_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                            following ? t.unfollow : t.follow
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-semibold text-foreground inline-flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: page.username }),
                    isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 20 })
                  ] }),
                  page.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: page.bio })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 mt-4 pt-4 border-t border-border/60", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-foreground", children: Number(page.followerCount).toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t.profileFollowers })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-foreground", children: posts.length }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t.profilePosts })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleCopyLink,
                    className: `mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-smooth border ${linkCopied ? "bg-green-600 text-white border-green-500/50" : "bg-[#4169E1] hover:bg-[#3457c8] text-white border-[#4169E1]/70"}`,
                    "data-ocid": "page-detail.copy_link_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4" }),
                      linkCopied ? t.linkCopied : t.copyLink
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-4 space-y-3",
            "data-ocid": "page-detail.create_post_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: newPostContent,
                  onChange: (e) => setNewPostContent(e.target.value),
                  placeholder: t.whatsOnYourMind,
                  rows: 3,
                  className: "bg-secondary border-input resize-none text-sm",
                  "data-ocid": "page-detail.post_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  disabled: !newPostContent.trim() || publishing,
                  onClick: () => void handlePublish(),
                  className: "gap-2",
                  "data-ocid": "page-detail.publish_button",
                  children: [
                    publishing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }) : null,
                    t.publish
                  ]
                }
              ) })
            ]
          }
        ),
        postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "space-y-4",
            "data-ocid": "page-detail.posts.loading_state",
            children: ["a", "b"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-xl p-5 space-y-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
                ]
              },
              k
            ))
          }
        ) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl",
            "data-ocid": "page-detail.posts.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-muted-foreground mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.noPostsYet })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "page-detail.posts_list", children: posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PagePostCard, { post, index: i }, post.id.toString())) })
      ]
    }
  ) });
}
export {
  PageDetailPage as default
};
