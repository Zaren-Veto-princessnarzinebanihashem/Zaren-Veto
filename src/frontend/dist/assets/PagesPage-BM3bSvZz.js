import { b as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, A as AnimatePresence, X, m as motion, e as ue } from "./index-H5OvckqJ.js";
import { L as Layout, S as Search, U as Users, M as MessageCircle } from "./Layout-D4hE7sL3.js";
import { B as Button } from "./button-CdAyH_7d.js";
import { I as Input } from "./input-DfpmumWF.js";
import { L as Label } from "./label-DWnz6PLc.js";
import { T as Textarea } from "./textarea-DMZrvs6M.js";
import { u as useCurrentUser, a as useAuthenticatedBackend } from "./index-Cuwa6be1.js";
import { u as useImageUpload } from "./useImageUpload-BLrGpHLC.js";
import { A as ArrowLeft } from "./arrow-left-dyXBiFXT.js";
import { P as Plus } from "./plus-Dl9Oe3yc.js";
import { C as Camera } from "./camera-B5bh8qpd.js";
import { C as Check } from "./check-DQFUbMJr.js";
import { I as Image } from "./image-BTH49QK4.js";
import { P as Pencil } from "./pencil-Ye4W9NFR.js";
import { T as Trash2 } from "./trash-2-B-lHL67w.js";
import { H as Heart } from "./heart-BfbprXeC.js";
import { S as Share2 } from "./share-2--5RVtO_9.js";
import { C as CircleAlert } from "./circle-alert-DLDyRvu3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode);
const PAGE_CATEGORIES = [
  { value: "business", label: "Entreprise" },
  { value: "artist", label: "Artiste" },
  { value: "community", label: "Communauté" },
  { value: "entertainment", label: "Divertissement" },
  { value: "organization", label: "Organisation" },
  { value: "other", label: "Autre" }
];
const COVER_GRADIENTS = [
  "linear-gradient(135deg,#0f1c5e 0%,#4169E1 60%,#5c7df5 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  "linear-gradient(135deg,#2d1b69 0%,#4169E1 100%)",
  "linear-gradient(135deg,#0d1b2a 0%,#1b4332 50%,#40916c 100%)",
  "linear-gradient(135deg,#1c0533 0%,#7b2d8b 60%,#e040fb 100%)"
];
function getCoverGradient(id) {
  const idx = Number(id % BigInt(COVER_GRADIENTS.length));
  return COVER_GRADIENTS[Math.abs(idx)];
}
function formatCount(n) {
  const num = Number(n);
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
  return String(num);
}
function timeAgo(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1e3);
  if (secs < 60) return "à l'instant";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs} h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `il y a ${days} j`;
  return new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short"
  });
}
function CreatePageModal({
  onClose,
  onCreated
}) {
  const { actor } = useAuthenticatedBackend();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("other");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      ue.error("Le nom de la page est requis.");
      return;
    }
    if (!actor) {
      ue.error("Non connecté");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await actor.createPage(
        name.trim(),
        description.trim(),
        category
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      ue.success(`Page "${name.trim()}" créée avec succès !`);
      onCreated(result.ok);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création";
      setError(
        msg.includes("IC0508") ? "Service temporairement indisponible. Réessayez." : msg
      );
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      onClick: (e) => e.target === e.currentTarget && onClose(),
      "data-ocid": "pages.create_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.93, y: 16 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.93, y: 16 },
          transition: { duration: 0.25 },
          className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Créer une page" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                  "aria-label": "Fermer",
                  "data-ocid": "pages.create_dialog.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: (e) => void handleSubmit(e),
                className: "p-5 space-y-4",
                "data-ocid": "pages.create_form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "page-name",
                        className: "text-xs uppercase tracking-wide text-muted-foreground font-medium",
                        children: [
                          "Nom de la page ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "page-name",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: "Ex : Ma boutique",
                        maxLength: 60,
                        className: "bg-secondary border-input",
                        "data-ocid": "pages.create_name_input",
                        disabled: submitting
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "page-desc",
                        className: "text-xs uppercase tracking-wide text-muted-foreground font-medium",
                        children: "Description"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "page-desc",
                        value: description,
                        onChange: (e) => setDescription(e.target.value),
                        placeholder: "De quoi parle votre page ?",
                        rows: 3,
                        maxLength: 300,
                        className: "bg-secondary border-input resize-none text-sm",
                        "data-ocid": "pages.create_description_input",
                        disabled: submitting
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "page-category",
                        className: "text-xs uppercase tracking-wide text-muted-foreground font-medium",
                        children: "Catégorie"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        id: "page-category",
                        value: category,
                        onChange: (e) => setCategory(e.target.value),
                        disabled: submitting,
                        "data-ocid": "pages.create_category_select",
                        className: "w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                        children: PAGE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.value, children: c.label }, c.value))
                      }
                    )
                  ] }),
                  error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        disabled: !name.trim() || submitting,
                        className: "flex-1 gap-2",
                        "data-ocid": "pages.create_submit_button",
                        children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                          "Création…"
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
                          "Créer la page"
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        onClick: onClose,
                        disabled: submitting,
                        "data-ocid": "pages.create_cancel_button",
                        children: "Annuler"
                      }
                    )
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function EditPostModal({
  post,
  onClose,
  onSaved
}) {
  const { actor } = useAuthenticatedBackend();
  const { uploadImage, uploading: imgUploading } = useImageUpload();
  const [content, setContent] = reactExports.useState(post.content);
  const [imageUrl, setImageUrl] = reactExports.useState(post.imageUrl);
  const [saving, setSaving] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const handleImagePick = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch {
      ue.error("Échec du chargement de l'image");
    }
  };
  const handleSave = async () => {
    if (!actor || !content.trim()) return;
    setSaving(true);
    try {
      await actor.editPostWithImage(post.id, content.trim(), imageUrl ?? null);
      onSaved(post.id, content.trim(), imageUrl);
      onClose();
    } catch {
      ue.error("Impossible de modifier le post");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      onClick: (e) => e.target === e.currentTarget && onClose(),
      "data-ocid": "pages.edit_post_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.93, y: 16 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.93, y: 16 },
          transition: { duration: 0.2 },
          className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Modifier le post" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                  "aria-label": "Fermer",
                  "data-ocid": "pages.edit_post_dialog.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: content,
                  onChange: (e) => setContent(e.target.value),
                  rows: 4,
                  className: "bg-secondary border-input resize-none text-sm",
                  placeholder: "Contenu du post…",
                  "data-ocid": "pages.edit_post_textarea"
                }
              ),
              imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: "",
                    className: "rounded-lg w-full max-h-40 object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setImageUrl(void 0),
                    className: "absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors",
                    "aria-label": "Supprimer l'image",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a;
                      return (_a = fileRef.current) == null ? void 0 : _a.click();
                    },
                    disabled: imgUploading,
                    className: "flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors",
                    "data-ocid": "pages.edit_post_image_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4" }),
                      imgUploading ? "Chargement…" : "Image"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: (e) => void handleImagePick(e)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: onClose,
                    disabled: saving,
                    "data-ocid": "pages.edit_post_cancel_button",
                    children: "Annuler"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: () => void handleSave(),
                    disabled: !content.trim() || saving || imgUploading,
                    "data-ocid": "pages.edit_post_save_button",
                    children: saving ? "Sauvegarde…" : "Sauvegarder"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function PageDetailView({
  page: initialPage,
  currentUserId,
  onBack: _onBack
}) {
  var _a;
  const { actor } = useAuthenticatedBackend();
  const { uploadImage, uploading: coverUploading } = useImageUpload();
  const { uploadImage: uploadPostImg, uploading: postImgUploading } = useImageUpload();
  const coverInputRef = reactExports.useRef(null);
  const postImgRef = reactExports.useRef(null);
  const [page, setPage] = reactExports.useState(initialPage);
  const [posts, setPosts] = reactExports.useState([]);
  const [postsLoading, setPostsLoading] = reactExports.useState(true);
  const [postContent, setPostContent] = reactExports.useState("");
  const [postImageUrl, setPostImageUrl] = reactExports.useState();
  const [publishing, setPublishing] = reactExports.useState(false);
  const [likedIds, setLikedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [likeCounts, setLikeCounts] = reactExports.useState(/* @__PURE__ */ new Map());
  const [editingPost, setEditingPost] = reactExports.useState(null);
  const [openCommentIds, setOpenCommentIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [commentTexts, setCommentTexts] = reactExports.useState(
    /* @__PURE__ */ new Map()
  );
  const [submittingCommentIds, setSubmittingCommentIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [postComments, setPostComments] = reactExports.useState(/* @__PURE__ */ new Map());
  const isCreator = currentUserId != null && page.ownerId.toText() === currentUserId;
  reactExports.useEffect(() => {
    if (!actor) return;
    void (async () => {
      setPostsLoading(true);
      try {
        const result = await actor.getPagePosts(page.id);
        const sorted = [...result].sort(
          (a, b) => Number(b.createdAt - a.createdAt)
        );
        setPosts(sorted);
        const counts = /* @__PURE__ */ new Map();
        for (const p of sorted) counts.set(p.id, 0);
        setLikeCounts(counts);
      } catch {
      } finally {
        setPostsLoading(false);
      }
    })();
  }, [actor, page.id]);
  const handleCoverUpload = async (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file || !actor) return;
    try {
      const url = await uploadImage(file);
      const result = await actor.updatePageCoverPhoto(page.id, url);
      if (result.__kind__ === "err") throw new Error(result.err);
      setPage((prev) => ({ ...prev, coverPhotoUrl: url }));
      ue.success("Photo de couverture mise à jour !");
    } catch {
      ue.error("Impossible de mettre à jour la photo de couverture");
    }
    if (coverInputRef.current) coverInputRef.current.value = "";
  };
  const handlePostImagePick = async (e) => {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (!file) return;
    try {
      const url = await uploadPostImg(file);
      setPostImageUrl(url);
    } catch {
      ue.error("Échec du chargement de l'image");
    }
    if (postImgRef.current) postImgRef.current.value = "";
  };
  const handleFollow = async () => {
    if (!actor) return;
    try {
      if (page.isFollowing) {
        const r = await actor.unfollowPage(page.id);
        if (r.__kind__ === "err") throw new Error(r.err);
        setPage((prev) => ({
          ...prev,
          isFollowing: false,
          followerCount: prev.followerCount - 1n
        }));
      } else {
        const r = await actor.followPage(page.id);
        if (r.__kind__ === "err") throw new Error(r.err);
        setPage((prev) => ({
          ...prev,
          isFollowing: true,
          followerCount: prev.followerCount + 1n
        }));
      }
    } catch {
      ue.error("Action échouée. Réessayez.");
    }
  };
  const handlePublish = async () => {
    if (!actor || !postContent.trim()) return;
    setPublishing(true);
    try {
      const result = await actor.createPagePost(page.id, postContent.trim());
      if (result.__kind__ === "err") throw new Error(result.err);
      const newPost = {
        id: result.ok.id,
        content: postContent.trim(),
        authorId: page.ownerId,
        authorName: page.name,
        authorVerified: page.isVerified,
        createdAt: BigInt(Date.now()) * 1000000n,
        updatedAt: BigInt(Date.now()) * 1000000n,
        imageUrl: postImageUrl,
        isRepost: false,
        isPinned: false,
        visibility: result.ok.visibility
      };
      setPosts((prev) => [newPost, ...prev]);
      setLikeCounts((prev) => new Map(prev).set(newPost.id, 0));
      setPostContent("");
      setPostImageUrl(void 0);
      ue.success("Post publié !");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur";
      ue.error(
        msg.includes("IC0508") ? "Service temporairement indisponible" : `Erreur : ${msg}`
      );
    } finally {
      setPublishing(false);
    }
  };
  const handleLike = async (postId) => {
    if (!actor) return;
    const wasLiked = likedIds.has(postId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setLikeCounts((prev) => {
      const next = new Map(prev);
      next.set(postId, (next.get(postId) ?? 0) + (wasLiked ? -1 : 1));
      return next;
    });
    try {
      if (wasLiked) await actor.unlikePost(postId);
      else await actor.likePost(postId);
    } catch {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.add(postId);
        else next.delete(postId);
        return next;
      });
      setLikeCounts((prev) => {
        const next = new Map(prev);
        next.set(postId, (next.get(postId) ?? 0) + (wasLiked ? 1 : -1));
        return next;
      });
    }
  };
  const handleDelete = async (postId) => {
    if (!actor) return;
    const confirmed = window.confirm("Supprimer ce post ?");
    if (!confirmed) return;
    try {
      await actor.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      ue.success("Post supprimé.");
    } catch {
      ue.error("Impossible de supprimer le post");
    }
  };
  const handleEditSaved = (postId, content, imageUrl) => {
    setPosts(
      (prev) => prev.map((p) => p.id === postId ? { ...p, content, imageUrl } : p)
    );
  };
  const toggleComments = async (postId) => {
    const isOpen = openCommentIds.has(postId);
    setOpenCommentIds((prev) => {
      const next = new Set(prev);
      if (isOpen) next.delete(postId);
      else next.add(postId);
      return next;
    });
    if (!isOpen && actor && !postComments.has(postId)) {
      try {
        const comments = await actor.getComments(postId);
        setPostComments(
          (prev) => new Map(prev).set(
            postId,
            comments.map((c) => ({
              id: c.id,
              authorName: c.authorName,
              content: c.content
            }))
          )
        );
      } catch {
      }
    }
  };
  const handleCommentSubmit = async (postId) => {
    const text = (commentTexts.get(postId) ?? "").trim();
    if (!text || !actor || submittingCommentIds.has(postId)) return;
    setSubmittingCommentIds((prev) => new Set(prev).add(postId));
    try {
      await actor.addComment(postId, text);
      const comments = await actor.getComments(postId);
      setPostComments(
        (prev) => new Map(prev).set(
          postId,
          comments.map((c) => ({
            id: c.id,
            authorName: c.authorName,
            content: c.content
          }))
        )
      );
      setCommentTexts((prev) => {
        const next = new Map(prev);
        next.delete(postId);
        return next;
      });
      ue.success("Commentaire ajouté !");
    } catch {
      ue.error("Impossible d'ajouter le commentaire");
    } finally {
      setSubmittingCommentIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };
  const catLabel = ((_a = PAGE_CATEGORIES.find((c) => c.value === page.category)) == null ? void 0 : _a.label) ?? page.category;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "pages.detail_view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative h-48 sm:h-56 w-full overflow-hidden rounded-xl mb-0",
        style: !page.coverPhotoUrl ? { background: getCoverGradient(page.id) } : {},
        children: [
          page.coverPhotoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: page.coverPhotoUrl,
              alt: "",
              className: "w-full h-full object-cover"
            }
          ),
          isCreator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a2;
                return (_a2 = coverInputRef.current) == null ? void 0 : _a2.click();
              },
              disabled: coverUploading,
              className: "absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full transition-colors",
              "data-ocid": "pages.detail.cover_upload_button",
              "aria-label": "Modifier la photo de couverture",
              children: [
                coverUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: coverUploading ? "Chargement…" : "Modifier" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: coverInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (e) => void handleCoverUpload(e)
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-4 mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground leading-tight", children: page.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20", children: catLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 mt-1.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            formatCount(page.followerCount),
            " abonné",
            Number(page.followerCount) !== 1 ? "s" : ""
          ] })
        ] }),
        page.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/80 leading-relaxed", children: page.description })
      ] }),
      !isCreator && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: page.isFollowing ? "outline" : "default",
          onClick: () => void handleFollow(),
          className: "shrink-0",
          "data-ocid": "pages.detail.follow_button",
          children: page.isFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 mr-1" }),
            "Abonné"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
            "Suivre"
          ] })
        }
      )
    ] }) }),
    isCreator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mt-3 space-y-3",
        "data-ocid": "pages.detail.post_create_box",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: postContent,
              onChange: (e) => setPostContent(e.target.value),
              placeholder: `Écrire quelque chose sur ${page.name}…`,
              rows: 3,
              className: "bg-secondary border-input resize-none text-sm",
              "data-ocid": "pages.detail.post_textarea"
            }
          ),
          postImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: postImageUrl,
                alt: "",
                className: "rounded-lg max-h-40 object-cover"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setPostImageUrl(void 0),
                className: "absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors",
                "aria-label": "Supprimer l'image",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a2;
                  return (_a2 = postImgRef.current) == null ? void 0 : _a2.click();
                },
                disabled: postImgUploading,
                className: "flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors",
                "data-ocid": "pages.detail.post_image_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: postImgUploading ? "Chargement…" : "Photo" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: postImgRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: (e) => void handlePostImagePick(e)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                disabled: !postContent.trim() || publishing || postImgUploading,
                onClick: () => void handlePublish(),
                className: "gap-2",
                "data-ocid": "pages.detail.post_publish_button",
                children: publishing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                  "Publication…"
                ] }) : "Publier"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-3", "data-ocid": "pages.detail.posts_list", children: postsLoading ? [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" }, k)) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 text-center bg-card border border-border rounded-xl",
        "data-ocid": "pages.detail.posts_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-10 h-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isCreator ? "Publiez votre premier post !" : "Aucun post pour l'instant." })
        ]
      }
    ) : posts.map((post, i) => {
      var _a2;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25, delay: i * 0.04 },
          className: "bg-card border border-border rounded-xl overflow-hidden",
          "data-ocid": `pages.detail.post.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-4 pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0", children: (_a2 = page.name[0]) == null ? void 0 : _a2.toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: page.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeAgo(post.createdAt) })
                ] })
              ] }),
              isCreator && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setEditingPost(post),
                    className: "w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                    "aria-label": "Modifier",
                    "data-ocid": `pages.detail.post_edit_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => void handleDelete(post.id),
                    className: "w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                    "aria-label": "Supprimer",
                    "data-ocid": `pages.detail.post_delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: post.content }) }),
            post.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: post.imageUrl,
                alt: "",
                className: "w-full max-h-80 object-cover"
              }
            ),
            openCommentIds.has(post.id) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 py-3 border-t border-border/60 space-y-3",
                "data-ocid": `pages.detail.comment_section.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "form",
                    {
                      onSubmit: (e) => {
                        e.preventDefault();
                        void handleCommentSubmit(post.id);
                      },
                      className: "flex gap-2 items-center",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            value: commentTexts.get(post.id) ?? "",
                            onChange: (e) => setCommentTexts(
                              (prev) => new Map(prev).set(post.id, e.target.value)
                            ),
                            placeholder: "Écrire un commentaire…",
                            className: "flex-1 text-sm bg-secondary rounded-full px-4 py-2 border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring",
                            disabled: submittingCommentIds.has(post.id),
                            maxLength: 500,
                            "data-ocid": `pages.detail.comment_input.${i + 1}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "submit",
                            disabled: !(commentTexts.get(post.id) ?? "").trim() || submittingCommentIds.has(post.id),
                            className: "w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-40 transition-smooth hover:bg-primary/90",
                            "aria-label": "Envoyer",
                            "data-ocid": `pages.detail.comment_submit.${i + 1}`,
                            children: submittingCommentIds.has(post.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin block" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5" })
                          }
                        )
                      ]
                    }
                  ),
                  (postComments.get(post.id) ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: (postComments.get(post.id) ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex gap-2 items-start",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: c.authorName.slice(0, 1).toUpperCase() }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 bg-secondary rounded-xl px-3 py-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground mr-1.5", children: c.authorName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80 break-words", children: c.content })
                        ] })
                      ]
                    },
                    c.id.toString()
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-2 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => void handleLike(post.id),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${likedIds.has(post.id) ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"}`,
                  "data-ocid": `pages.detail.post_like_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        className: `w-4 h-4 ${likedIds.has(post.id) ? "fill-red-500" : ""}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: likeCounts.get(post.id) ?? 0 })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => void toggleComments(post.id),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${openCommentIds.has(post.id) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`,
                  "data-ocid": `pages.detail.post_comment_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Commenter" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    const url = window.location.href;
                    if (navigator.share) {
                      void navigator.share({
                        title: page.name,
                        text: post.content,
                        url
                      });
                    } else {
                      void navigator.clipboard.writeText(url).then(() => ue.success("Lien copié !"));
                    }
                  },
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                  "data-ocid": `pages.detail.post_share_button.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Partager" })
                  ]
                }
              )
            ] })
          ]
        },
        post.id.toString()
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: editingPost && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditPostModal,
      {
        post: editingPost,
        onClose: () => setEditingPost(null),
        onSaved: handleEditSaved
      }
    ) })
  ] });
}
function PageCard({
  page,
  index,
  onFollow,
  onOpen
}) {
  var _a, _b;
  const catLabel = ((_a = PAGE_CATEGORIES.find((c) => c.value === page.category)) == null ? void 0 : _a.label) ?? page.category;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.06 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors cursor-pointer",
      "data-ocid": `pages.item.${index + 1}`,
      onClick: () => onOpen(page),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-24 w-full relative overflow-hidden",
            style: !page.coverPhotoUrl ? { background: getCoverGradient(page.id) } : {},
            children: page.coverPhotoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: page.coverPhotoUrl,
                alt: page.name,
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative px-4", style: { marginTop: -24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl border-2 border-card bg-secondary overflow-hidden flex items-center justify-center shadow-md", children: page.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: page.profilePhotoUrl,
            alt: page.name,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-base", children: (_b = page.name[0]) == null ? void 0 : _b.toUpperCase() }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-1 pb-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "font-semibold text-foreground text-sm leading-tight truncate",
                "data-ocid": `pages.name.${index + 1}`,
                children: page.name
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-0.5 text-xs text-primary/80", children: catLabel })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              formatCount(page.followerCount),
              " abonné",
              Number(page.followerCount) !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: page.isFollowing ? "outline" : "default",
                className: "h-7 text-xs px-3",
                "data-ocid": `pages.follow_button.${index + 1}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onFollow(page.id, page.isFollowing);
                },
                children: page.isFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 mr-1" }),
                  "Abonné"
                ] }) : "Suivre"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function PagesPage() {
  var _a;
  const { status, profile } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [pages, setPages] = reactExports.useState([]);
  const [pagesLoading, setPagesLoading] = reactExports.useState(true);
  const [selectedPage, setSelectedPage] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const loadPages = reactExports.useCallback(async () => {
    if (!actor || isFetching) return;
    setPagesLoading(true);
    try {
      const query = searchTerm.trim();
      const result = await actor.searchPages(query);
      setPages(result ?? []);
    } catch {
    } finally {
      setPagesLoading(false);
    }
  }, [actor, isFetching, searchTerm]);
  reactExports.useEffect(() => {
    void loadPages();
  }, [loadPages]);
  const handleFollow = async (pageId, isCurrentlyFollowing) => {
    if (!actor) return;
    try {
      if (isCurrentlyFollowing) {
        const r = await actor.unfollowPage(pageId);
        if (r.__kind__ === "err") throw new Error(r.err);
      } else {
        const r = await actor.followPage(pageId);
        if (r.__kind__ === "err") throw new Error(r.err);
      }
      setPages(
        (prev) => prev.map(
          (p) => p.id === pageId ? {
            ...p,
            isFollowing: !isCurrentlyFollowing,
            followerCount: isCurrentlyFollowing ? p.followerCount - 1n : p.followerCount + 1n
          } : p
        )
      );
    } catch {
      ue.error("Action échouée. Réessayez.");
    }
  };
  const handlePageCreated = (newPage) => {
    setPages((prev) => [newPage, ...prev]);
  };
  const currentUserId = ((_a = profile == null ? void 0 : profile.id) == null ? void 0 : _a.toText()) ?? null;
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto py-6 space-y-4", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }, k)) }) });
  }
  if (status === "unauthenticated") return null;
  if (selectedPage) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto py-4 sm:py-6",
        "data-ocid": "pages.detail_page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSelectedPage(null),
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors",
              "data-ocid": "pages.detail.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                "Retour aux pages"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PageDetailView,
            {
              page: selectedPage,
              currentUserId,
              onBack: () => setSelectedPage(null)
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto py-4 sm:py-6 space-y-5",
        "data-ocid": "pages.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-semibold text-foreground", children: "Pages" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Découvrez et suivez des pages." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setShowCreate(true),
                className: "gap-2 shrink-0",
                "data-ocid": "pages.create_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Créer une page" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Créer" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Rechercher une page…",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "pl-9 bg-secondary border-input",
                "data-ocid": "pages.search_input"
              }
            )
          ] }),
          pagesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: ["l1", "l2", "l3", "l4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }, k)) }) : pages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl",
              "data-ocid": "pages.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: searchTerm ? /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-8 h-8 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: searchTerm ? "Aucune page trouvée" : "Aucune page pour l'instant" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-xs", children: searchTerm ? `Aucune page ne correspond à "${searchTerm}".` : "Soyez le premier à créer une page sur Zaren Veto." }),
                !searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => setShowCreate(true),
                    className: "gap-2",
                    "data-ocid": "pages.empty_create_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                      "Créer une page"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
              "data-ocid": "pages.list",
              children: pages.map((page, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                PageCard,
                {
                  page,
                  index: i,
                  onFollow: (id, isFollowing) => void handleFollow(id, isFollowing),
                  onOpen: (p) => setSelectedPage(p)
                },
                page.id.toString()
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreatePageModal,
      {
        onClose: () => setShowCreate(false),
        onCreated: handlePageCreated
      }
    ) })
  ] });
}
export {
  PagesPage as default
};
