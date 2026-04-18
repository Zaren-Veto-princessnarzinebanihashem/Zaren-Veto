const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-_6LAhcZ1.js","assets/index-DAQ2-jUM.js","assets/index-Dy6Q_df_.css"])))=>i.map(i=>d[i]);
import { b as createLucideIcon, u as useNavigate, a as useLanguage, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, S as Skeleton, e as ue, _ as __vitePreload, m as motion } from "./index-DAQ2-jUM.js";
import { L as Layout, i as isVerifiedUser, U as Users, V as VerificationBadge, G as Globe } from "./Layout-BNg2Wjue.js";
import { B as Button } from "./button-DLIi7HGy.js";
import { T as Textarea } from "./textarea-CETY_tK5.js";
import { a as useAuthenticatedBackend, u as useCurrentUser, c as useMutation, b as useQuery } from "./useCurrentUser-CLqn61Zi.js";
import { u as useImageUpload, C as Camera } from "./useImageUpload-CnsLy7nX.js";
import { S as ShieldCheck } from "./shield-check-Drxens40.js";
import { C as Check } from "./check-C5KUfJjC.js";
import { H as Heart } from "./heart-Cdq31-KN.js";
import { M as MessageSquare } from "./message-square-CSluUqWF.js";
import { S as Share2 } from "./index-_6LAhcZ1.js";
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
function OfficialPostCard({ post, index }) {
  const [liked, setLiked] = reactExports.useState(false);
  const [likeCount, setLikeCount] = reactExports.useState(0);
  const { t } = useLanguage();
  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => liked ? c - 1 : c + 1);
  };
  const handleShare = () => {
    void navigator.clipboard.writeText(
      `${window.location.origin}/post/${post.id.toString()}`
    );
    ue.success(t.linkCopied);
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "inline-flex items-center text-sm font-semibold text-foreground",
                  style: { gap: "3px" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Zaren Veto" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 16 })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formattedDate })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: post.content })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t border-border/60 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleLike,
              className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth hover:bg-secondary ${liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"}`,
              "data-ocid": `official-page.like.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${liked ? "fill-red-500" : ""}` }),
                likeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: likeCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
              "data-ocid": `official-page.comment.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleShare,
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth ms-auto",
              "data-ocid": `official-page.share.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" })
            }
          )
        ] })
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
  const [following, setFollowing] = reactExports.useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = reactExports.useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = reactExports.useState(null);
  const [uploadingCover, setUploadingCover] = reactExports.useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = reactExports.useState(false);
  const [newPostContent, setNewPostContent] = reactExports.useState("");
  const [publishing, setPublishing] = reactExports.useState(false);
  const [pageLinkCopied, setPageLinkCopied] = reactExports.useState(false);
  const handleCopyPageLink = () => {
    var _a2;
    const url = `${window.location.origin}/official-page`;
    const doFallback = () => {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setPageLinkCopied(true);
        ue.success(t.linkCopied);
        setTimeout(() => setPageLinkCopied(false), 3e3);
      } catch {
        ue.error(t.actionFailed ?? "Copy failed");
      }
    };
    if ((_a2 = navigator.clipboard) == null ? void 0 : _a2.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setPageLinkCopied(true);
        ue.success(t.linkCopied);
        setTimeout(() => setPageLinkCopied(false), 3e3);
      }).catch(doFallback);
    } else {
      doFallback();
    }
  };
  const { data: officialPage, isLoading: pageLoading } = useOfficialPage();
  const officialId = ((_a = officialPage == null ? void 0 : officialPage.id) == null ? void 0 : _a.toString()) ?? null;
  const { data: posts, isLoading: postsLoading } = useOfficialPosts();
  reactExports.useEffect(() => {
    if (officialPage == null ? void 0 : officialPage.coverPhotoUrl)
      setCoverPhotoUrl(officialPage.coverPhotoUrl);
    if (officialPage == null ? void 0 : officialPage.profilePhotoUrl)
      setProfilePhotoUrl(officialPage.profilePhotoUrl);
  }, [officialPage == null ? void 0 : officialPage.coverPhotoUrl, officialPage == null ? void 0 : officialPage.profilePhotoUrl]);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const isOwner = status === "authenticated" && myProfile !== null && isVerifiedUser(myProfile.username, myProfile.isVerified);
  const handleCoverFile = async (file) => {
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setCoverPhotoUrl(url);
      if (actor && isOwner) await actor.updateCoverPhoto(url);
      queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      ue.success(t.coverPhotoUpdated);
    } catch {
      ue.error(t.photoUploadFailed);
    } finally {
      setUploadingCover(false);
    }
  };
  const handleProfileFile = async (file) => {
    setUploadingProfilePhoto(true);
    try {
      const url = await uploadImage(file);
      setProfilePhotoUrl(url);
      if (actor && isOwner) await actor.updateProfilePhoto(url);
      queryClient.invalidateQueries({ queryKey: ["officialPage"] });
      ue.success(t.profilePhotoUpdated);
    } catch {
      ue.error(t.photoUploadFailed);
    } finally {
      setUploadingProfilePhoto(false);
    }
  };
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !officialId) throw new Error();
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-_6LAhcZ1.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      if (following) {
        return actor.unfollowUser(Principal.fromText(officialId));
      }
      return actor.followUser(Principal.fromText(officialId));
    },
    onSuccess: () => {
      setFollowing((v) => !v);
      queryClient.invalidateQueries({ queryKey: ["officialPage"] });
    },
    onError: () => ue.error(t.actionFailed)
  });
  const handlePublish = async () => {
    const content = newPostContent.trim();
    if (!content) return;
    setPublishing(true);
    try {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.createOfficialPost(content, null);
      if (result.__kind__ === "err") throw new Error(result.err);
      queryClient.invalidateQueries({ queryKey: ["officialPosts"] });
      setNewPostContent("");
      ue.success(t.postPublished);
    } catch {
      ue.error(t.failedToPublishPost);
    } finally {
      setPublishing(false);
    }
  };
  if (status === "initializing" || pageLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "max-w-2xl mx-auto space-y-4",
        "data-ocid": "official-page.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-52" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-72" })
          ] })
        ] })
      }
    ) });
  }
  const postCount = (posts == null ? void 0 : posts.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto space-y-6",
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
            style: { overflow: "visible" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative w-full rounded-t-2xl",
                  style: { height: 210, overflow: "visible" },
                  children: [
                    coverPhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: coverPhotoUrl,
                        alt: "Cover",
                        className: "w-full h-full object-cover rounded-t-2xl",
                        style: { height: 210 }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "w-full h-full rounded-t-2xl",
                        style: {
                          background: "linear-gradient(135deg, #1a237e 0%, #4169E1 40%, #5c85f5 70%, #2a3a8f 100%)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 200 }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-6 opacity-15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 56 }) })
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
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-5 z-10", style: { bottom: -56 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-28 h-28 rounded-full border-4 border-card overflow-hidden shadow-lg flex items-center justify-center",
                          style: { backgroundColor: "#0d1230" },
                          "data-ocid": "official-page.avatar",
                          children: profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: profilePhotoUrl,
                              alt: "Zaren Veto",
                              className: "w-full h-full object-cover"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 72 })
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
                    ] }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-6", style: { paddingTop: 68 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end mb-4", children: !isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: following ? "outline" : "default",
                    size: "sm",
                    onClick: () => void followMutation.mutateAsync(),
                    disabled: followMutation.isPending,
                    className: "gap-2 transition-smooth",
                    "data-ocid": "official-page.follow_button",
                    children: [
                      followMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                      following ? t.following : t.follow
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "inline-flex items-center",
                      style: { gap: "4px" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Zaren Veto" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 24 })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Page officielle · Application" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-lg", children: "The official page of Zaren Veto — Your private social network. Digital sovereignty, end-to-end encryption, and zero tracking." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap mt-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3.5 h-3.5 text-primary" }),
                      "zarenveto.com"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-primary" }),
                      "Privacy-first social network"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-8 mt-5 pt-4 border-t border-border/60 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold text-foreground", children: "19k" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: t.profileFollowers })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold text-foreground", children: postCount }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: t.profilePosts })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-auto inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 border border-primary/30 px-2.5 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 12 }),
                    "Page Officielle"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleCopyPageLink,
                    className: `mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-smooth shadow-sm active:scale-[0.98] ${pageLinkCopied ? "bg-green-600 text-white border border-green-500/60" : "bg-[#4169E1] hover:bg-[#3457c8] text-white border border-[#4169E1]/80"}`,
                    "data-ocid": "official-page.copy_link_button",
                    children: [
                      pageLinkCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                      pageLinkCopied ? t.linkCopied : t.copyLink
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => void navigate({ to: "/" }),
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth",
              "data-ocid": "official-page.back_button",
              children: [
                "← ",
                t.backToFeed
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Zaren Veto · Page officielle" })
        ] }),
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 22 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: t.whatsOnYourMind })
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  newPostContent.length,
                  "/500"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    disabled: !newPostContent.trim() || publishing,
                    onClick: () => void handlePublish(),
                    className: "gap-2",
                    "data-ocid": "official-page.publish_button",
                    children: [
                      publishing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }) : null,
                      t.publish
                    ]
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
              className: "flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl",
              "data-ocid": "official-page.posts_list.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldLogo, { size: 40 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-4", children: t.noPostsYet })
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
