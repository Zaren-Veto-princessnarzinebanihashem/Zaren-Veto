import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, A as AnimatePresence, e as ue, m as motion, X } from "./index-H5OvckqJ.js";
import { L as Layout, U as Users, G as Globe } from "./Layout-D4hE7sL3.js";
import { B as Button } from "./button-CdAyH_7d.js";
import { I as Input } from "./input-DfpmumWF.js";
import { L as Label } from "./label-DWnz6PLc.js";
import { T as Textarea } from "./textarea-DMZrvs6M.js";
import { u as useCurrentUser, a as useAuthenticatedBackend } from "./index-Cuwa6be1.js";
import { u as useImageUpload } from "./useImageUpload-BLrGpHLC.js";
import { R as RefreshCw, E as Ellipsis } from "./refresh-cw-BimFDeXj.js";
import { P as Plus } from "./plus-Dl9Oe3yc.js";
import { C as CircleAlert } from "./circle-alert-DLDyRvu3.js";
import { A as ArrowLeft } from "./arrow-left-dyXBiFXT.js";
import { C as Camera } from "./camera-B5bh8qpd.js";
import { L as Lock } from "./lock-DmN943MC.js";
import { C as Check } from "./check-DQFUbMJr.js";
import { S as Send } from "./send-zicZ5MWP.js";
import { I as Image } from "./image-BTH49QK4.js";
import { P as Pencil } from "./pencil-Ye4W9NFR.js";
import { T as Trash2 } from "./trash-2-B-lHL67w.js";
import { H as Heart } from "./heart-BfbprXeC.js";
const COVER_COLORS = [
  "from-violet-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600"
];
function getCoverColor(id) {
  return COVER_COLORS[Number(id % 5n) % COVER_COLORS.length];
}
function formatCount(n) {
  const num = Number(n);
  if (num >= 1e3) return `${(num / 1e3).toFixed(1).replace(".0", "")}k`;
  return String(num);
}
function timeAgo(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days} j`;
  return new Date(ms).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short"
  });
}
function coverSrc(group) {
  if (group.coverImageUrl) return group.coverImageUrl;
  if (group.coverImageData) return group.coverImageData;
  return null;
}
function CreateGroupModal({
  onClose,
  onCreated
}) {
  const { actor } = useAuthenticatedBackend();
  const { uploadImage, uploading: imgUploading } = useImageUpload();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [isPrivate, setIsPrivate] = reactExports.useState(false);
  const [coverPreview, setCoverPreview] = reactExports.useState(null);
  const [coverData, setCoverData] = reactExports.useState(null);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const fileRef = reactExports.useRef(null);
  const handleCoverPick = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const dataUrl = await uploadImage(file);
      setCoverData(dataUrl);
      setCoverPreview(dataUrl);
    } catch {
      ue.error("Impossible de charger l'image.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      ue.error("Le nom du groupe est requis.");
      return;
    }
    if (!actor) {
      ue.error("Non connecté");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await actor.createGroup(
        name.trim(),
        description.trim(),
        isPrivate,
        coverData
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      setDone(true);
      ue.success(`Groupe "${name.trim()}" créé !`);
      onCreated(result.ok);
      setTimeout(onClose, 600);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la création"
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
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",
      onClick: (e) => e.target === e.currentTarget && onClose(),
      "data-ocid": "groups.create_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.93, y: 16 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.93, y: 16 },
          transition: { duration: 0.25 },
          className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `h-28 w-full bg-gradient-to-r ${getCoverColor(0n)} relative overflow-hidden`,
                  style: coverPreview ? {
                    backgroundImage: `url(${coverPreview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  } : {},
                  children: [
                    !coverPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 text-white" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var _a;
                          return (_a = fileRef.current) == null ? void 0 : _a.click();
                        },
                        className: "absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors",
                        disabled: imgUploading,
                        title: "Changer la photo de couverture",
                        children: imgUploading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" })
                      }
                    )
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
                  onChange: (e) => void handleCoverPick(e)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Créer un groupe" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
                  "aria-label": "Fermer",
                  "data-ocid": "groups.create_dialog.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => void handleSubmit(e), className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "grp-name",
                    className: "text-xs uppercase tracking-wide text-muted-foreground font-medium",
                    children: [
                      "Nom du groupe ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "grp-name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: "Ex : Amateurs de photographie",
                    maxLength: 60,
                    className: "bg-secondary border-input",
                    "data-ocid": "groups.create_name_input",
                    disabled: submitting || done
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "grp-desc",
                    className: "text-xs uppercase tracking-wide text-muted-foreground font-medium",
                    children: "Description"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "grp-desc",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    placeholder: "À quoi sert ce groupe ?",
                    rows: 3,
                    className: "bg-secondary border-input resize-none text-sm",
                    "data-ocid": "groups.create_description_input",
                    disabled: submitting || done
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsPrivate((v) => !v),
                  className: `w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth ${isPrivate ? "border-amber-500/40 bg-amber-500/10" : "border-primary/30 bg-primary/10"}`,
                  "data-ocid": "groups.create_privacy_toggle",
                  disabled: submitting || done,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-8 h-8 rounded-lg flex items-center justify-center ${isPrivate ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary"}`,
                        children: isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: isPrivate ? "Groupe privé" : "Groupe public" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isPrivate ? "Seuls les membres invités peuvent voir le contenu." : "Tout le monde peut trouver et rejoindre ce groupe." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-5 h-5 rounded-full border-2 flex items-center justify-center transition-smooth ${isPrivate ? "border-amber-500 bg-amber-500" : "border-border bg-transparent"}`,
                        children: isPrivate && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-white" })
                      }
                    )
                  ]
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: !name.trim() || submitting || done,
                    className: "flex-1 gap-2",
                    "data-ocid": "groups.create_submit_button",
                    children: done ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
                      "Créé !"
                    ] }) : submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                      "Création…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                      "Créer le groupe"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    onClick: onClose,
                    disabled: submitting || done,
                    "data-ocid": "groups.create_cancel_button",
                    children: "Annuler"
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
function GroupPostCard({
  post,
  currentUsername,
  isGroupOwner,
  onDelete,
  onEdit,
  onLikeToggle,
  likedByMe
}) {
  const isAuthor = post.authorName === currentUsername;
  const canDelete = isAuthor || isGroupOwner;
  const [editing, setEditing] = reactExports.useState(false);
  const [editContent, setEditContent] = reactExports.useState(post.content);
  const [showMenu, setShowMenu] = reactExports.useState(false);
  const menuRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);
  const submitEdit = () => {
    if (editContent.trim() && editContent.trim() !== post.content) {
      onEdit(post.id, editContent.trim());
    }
    setEditing(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl overflow-hidden",
      "data-ocid": `group.post.${post.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 pt-4 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center shrink-0 overflow-hidden", children: post.authorProfilePhoto ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: post.authorProfilePhoto,
              alt: post.authorName,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary", children: post.authorName.charAt(0).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: post.authorName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeAgo(post.createdAt) })
          ] }),
          (isAuthor || canDelete) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: menuRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowMenu((v) => !v),
                className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors",
                "aria-label": "Options",
                "data-ocid": `group.post.options_button.${post.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9, y: -4 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.9, y: -4 },
                transition: { duration: 0.15 },
                className: "absolute right-0 top-9 z-30 w-40 bg-card border border-border rounded-xl shadow-xl overflow-hidden",
                children: [
                  isAuthor && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors",
                      onClick: () => {
                        setEditing(true);
                        setEditContent(post.content);
                        setShowMenu(false);
                      },
                      "data-ocid": `group.post.edit_button.${post.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }),
                        "Modifier"
                      ]
                    }
                  ),
                  canDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors",
                      onClick: () => {
                        onDelete(post.id);
                        setShowMenu(false);
                      },
                      "data-ocid": `group.post.delete_button.${post.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                        "Supprimer"
                      ]
                    }
                  )
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: editContent,
              onChange: (e) => setEditContent(e.target.value),
              className: "bg-secondary border-input resize-none text-sm min-h-[80px]",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: submitEdit,
                className: "gap-1",
                "data-ocid": `group.post.save_edit.${post.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                  "Enregistrer"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => setEditing(false),
                "data-ocid": `group.post.cancel_edit.${post.id}`,
                children: "Annuler"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: post.content }) }),
        post.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.imageUrl,
            alt: "",
            className: "w-full rounded-lg object-cover max-h-80"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-4 py-2 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onLikeToggle(post.id, likedByMe),
              className: `flex items-center gap-1.5 text-sm transition-colors ${likedByMe ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`,
              "data-ocid": `group.post.like_button.${post.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `w-4 h-4 ${likedByMe ? "fill-red-500" : ""}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCount(post.likesCount) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "svg",
              {
                role: "img",
                "aria-label": "Commentaires",
                className: "w-4 h-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Commentaires" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatCount(post.commentsCount) })
          ] })
        ] })
      ]
    }
  );
}
function GroupDetailView({
  groupId,
  onBack
}) {
  const { actor } = useAuthenticatedBackend();
  const { profile } = useCurrentUser();
  const { uploadImage, uploading: imgUploading } = useImageUpload();
  const coverFileRef = reactExports.useRef(null);
  const postImgRef = reactExports.useRef(null);
  const [group, setGroup] = reactExports.useState(null);
  const [posts, setPosts] = reactExports.useState([]);
  const [loadingGroup, setLoadingGroup] = reactExports.useState(true);
  const [loadingPosts, setLoadingPosts] = reactExports.useState(true);
  const [postContent, setPostContent] = reactExports.useState("");
  const [postImagePreview, setPostImagePreview] = reactExports.useState(null);
  const [postImageData, setPostImageData] = reactExports.useState(null);
  const [publishing, setPublishing] = reactExports.useState(false);
  const [joiningLeaving, setJoiningLeaving] = reactExports.useState(false);
  const [likedPosts, setLikedPosts] = reactExports.useState(/* @__PURE__ */ new Set());
  const [updatingCover, setUpdatingCover] = reactExports.useState(false);
  const [inviteUsername, setInviteUsername] = reactExports.useState("");
  const [inviting, setInviting] = reactExports.useState(false);
  const [showInvite, setShowInvite] = reactExports.useState(false);
  const isOwner = group && profile && group.ownerId.toText() === profile.id.toText();
  const loadGroup = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoadingGroup(true);
    try {
      const g = await actor.getGroup(groupId);
      setGroup(g ?? null);
    } catch {
      ue.error("Impossible de charger le groupe.");
    } finally {
      setLoadingGroup(false);
    }
  }, [actor, groupId]);
  const loadPosts = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoadingPosts(true);
    try {
      const result = await actor.getGroupPosts(groupId);
      setPosts([...result].reverse());
    } catch {
    } finally {
      setLoadingPosts(false);
    }
  }, [actor, groupId]);
  reactExports.useEffect(() => {
    if (actor) {
      void loadGroup();
      void loadPosts();
    }
  }, [actor, loadGroup, loadPosts]);
  const handleJoin = async () => {
    if (!actor || !group) return;
    setJoiningLeaving(true);
    try {
      const result = await actor.joinGroup(groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      setGroup(
        (prev) => prev ? { ...prev, isMember: true, memberCount: prev.memberCount + 1n } : prev
      );
      ue.success("Vous avez rejoint le groupe !");
    } catch {
      ue.error("Impossible de rejoindre le groupe.");
    } finally {
      setJoiningLeaving(false);
    }
  };
  const handleLeave = async () => {
    if (!actor || !group) return;
    setJoiningLeaving(true);
    try {
      const result = await actor.leaveGroup(groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      setGroup(
        (prev) => prev ? {
          ...prev,
          isMember: false,
          memberCount: prev.memberCount > 0n ? prev.memberCount - 1n : 0n
        } : prev
      );
      ue.success("Vous avez quitté le groupe.");
    } catch {
      ue.error("Impossible de quitter le groupe.");
    } finally {
      setJoiningLeaving(false);
    }
  };
  const handlePostImagePick = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const dataUrl = await uploadImage(file);
      setPostImageData(dataUrl);
      setPostImagePreview(dataUrl);
    } catch {
      ue.error("Impossible de charger l'image.");
    }
  };
  const handlePublish = async () => {
    if (!actor || !postContent.trim()) return;
    setPublishing(true);
    try {
      const result = await actor.createGroupPost(
        groupId,
        postContent.trim(),
        postImageData
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      const newPostId = result.ok;
      const optimisticPost = {
        id: newPostId,
        groupId,
        content: postContent.trim(),
        authorId: profile.id,
        authorName: profile.username,
        authorProfilePhoto: profile == null ? void 0 : profile.profilePhotoUrl,
        authorVerified: (profile == null ? void 0 : profile.isVerified) ?? false,
        createdAt: BigInt(Date.now()) * 1000000n,
        updatedAt: BigInt(Date.now()) * 1000000n,
        imageUrl: postImageData ?? void 0,
        likesCount: 0n,
        commentsCount: 0n
      };
      setPosts((prev) => [optimisticPost, ...prev]);
      setPostContent("");
      setPostImageData(null);
      setPostImagePreview(null);
      ue.success("Publication réussie !");
    } catch {
      ue.error("Impossible de publier.");
    } finally {
      setPublishing(false);
    }
  };
  const handleDeletePost = async (postId) => {
    if (!actor) return;
    try {
      const result = await actor.deleteGroupPost(groupId, postId);
      if (result.__kind__ === "err") throw new Error(result.err);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      ue.success("Publication supprimée.");
    } catch {
      ue.error("Impossible de supprimer la publication.");
    }
  };
  const handleEditPost = async (postId, newContent) => {
    if (!actor) return;
    try {
      const result = await actor.editGroupPost(groupId, postId, newContent);
      if (result.__kind__ === "err") throw new Error(result.err);
      setPosts(
        (prev) => prev.map((p) => p.id === postId ? { ...p, content: newContent } : p)
      );
      ue.success("Publication modifiée.");
    } catch {
      ue.error("Impossible de modifier la publication.");
    }
  };
  const handleLikeToggle = async (postId, liked) => {
    if (!actor) return;
    const key = postId.toString();
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (liked) next.delete(key);
      else next.add(key);
      return next;
    });
    setPosts(
      (prev) => prev.map(
        (p) => p.id === postId ? {
          ...p,
          likesCount: liked ? p.likesCount > 0n ? p.likesCount - 1n : 0n : p.likesCount + 1n
        } : p
      )
    );
    try {
      if (liked) {
        await actor.unlikeGroupPost(groupId, postId);
      } else {
        await actor.likeGroupPost(groupId, postId);
      }
    } catch {
      setLikedPosts((prev) => {
        const next = new Set(prev);
        if (liked) next.add(key);
        else next.delete(key);
        return next;
      });
      setPosts(
        (prev) => prev.map(
          (p) => p.id === postId ? {
            ...p,
            likesCount: liked ? p.likesCount + 1n : p.likesCount > 0n ? p.likesCount - 1n : 0n
          } : p
        )
      );
    }
  };
  const handleCoverChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !actor) return;
    setUpdatingCover(true);
    try {
      const dataUrl = await uploadImage(file);
      const result = await actor.updateGroupCoverImage(groupId, dataUrl);
      if (result.__kind__ === "err") throw new Error(result.err);
      setGroup((prev) => prev ? { ...prev, coverImageUrl: dataUrl } : prev);
      ue.success("Photo de couverture mise à jour !");
    } catch {
      ue.error("Impossible de mettre à jour la couverture.");
    } finally {
      setUpdatingCover(false);
    }
  };
  const handleInvite = async () => {
    if (!actor || !inviteUsername.trim()) return;
    setInviting(true);
    try {
      const result = await actor.inviteMember(groupId, inviteUsername.trim());
      if (result.__kind__ === "err") throw new Error(result.err);
      ue.success(`Invitation envoyée à ${inviteUsername.trim()} !`);
      setInviteUsername("");
      setShowInvite(false);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Impossible d'inviter ce membre."
      );
    } finally {
      setInviting(false);
    }
  };
  if (loadingGroup) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          className: "gap-2 text-muted-foreground",
          "data-ocid": "group.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Retour aux groupes"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] });
  }
  if (!group) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "group.not_found", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Groupe introuvable." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: onBack, className: "mt-4 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        "Retour"
      ] })
    ] });
  }
  const src = coverSrc(group);
  const memberCount = Number(group.memberCount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "group.detail", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onBack,
        className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
        "data-ocid": "group.back_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Retour aux groupes"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `h-52 w-full bg-gradient-to-r ${getCoverColor(group.id)} relative`,
        style: src ? {
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        } : {},
        children: [
          !src && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-20 h-20 text-white" }) }),
          isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = coverFileRef.current) == null ? void 0 : _a.click();
                },
                disabled: updatingCover || imgUploading,
                className: "absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium hover:bg-black/80 transition-colors",
                "data-ocid": "group.change_cover_button",
                children: [
                  updatingCover ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                  "Modifier la couverture"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: coverFileRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: (e) => void handleCoverChange(e)
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground leading-tight", children: group.name }),
          group.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 leading-relaxed", children: group.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              memberCount,
              " membre",
              memberCount !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${group.isPrivate ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-primary/30 bg-primary/10 text-primary"}`,
                children: [
                  group.isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
                  group.isPrivate ? "Groupe privé" : "Groupe public"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowInvite((v) => !v),
              className: "gap-2",
              "data-ocid": "group.invite_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Inviter"
              ]
            }
          ),
          !isOwner && (group.isMember ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => void handleLeave(),
              disabled: joiningLeaving,
              className: "gap-2",
              "data-ocid": "group.leave_button",
              children: [
                joiningLeaving ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                "Membre"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => void handleJoin(),
              disabled: joiningLeaving,
              className: "gap-2",
              "data-ocid": "group.join_button",
              children: [
                joiningLeaving ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
                "Rejoindre le groupe"
              ]
            }
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showInvite && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: "auto" },
          exit: { opacity: 0, height: 0 },
          className: "overflow-hidden",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-border flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: inviteUsername,
                onChange: (e) => setInviteUsername(e.target.value),
                placeholder: "Nom d'utilisateur à inviter",
                className: "bg-secondary border-input text-sm",
                onKeyDown: (e) => e.key === "Enter" && void handleInvite(),
                "data-ocid": "group.invite_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                disabled: !inviteUsername.trim() || inviting,
                onClick: () => void handleInvite(),
                className: "shrink-0 gap-2",
                "data-ocid": "group.invite_submit_button",
                children: [
                  inviting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  "Inviter"
                ]
              }
            )
          ] })
        }
      ) })
    ] }),
    (group.isMember || isOwner) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-3",
        "data-ocid": "group.post_composer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center shrink-0 overflow-hidden", children: (profile == null ? void 0 : profile.profilePhotoUrl) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: profile.profilePhotoUrl,
                alt: profile.username,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary", children: ((profile == null ? void 0 : profile.username) ?? "?").charAt(0).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: postContent,
                onChange: (e) => setPostContent(e.target.value),
                placeholder: "Écrire dans ce groupe…",
                rows: 2,
                className: "bg-secondary border-input resize-none text-sm flex-1",
                "data-ocid": "group.post_input"
              }
            )
          ] }),
          postImagePreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: postImagePreview,
                alt: "",
                className: "h-24 rounded-lg object-cover"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setPostImagePreview(null);
                  setPostImageData(null);
                },
                className: "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-white",
                "aria-label": "Supprimer l'image",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = postImgRef.current) == null ? void 0 : _a.click();
                },
                disabled: imgUploading,
                className: "flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary",
                "data-ocid": "group.post_image_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4" }),
                  imgUploading ? "Chargement…" : "Photo"
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                disabled: !postContent.trim() || publishing,
                onClick: () => void handlePublish(),
                className: "gap-2",
                "data-ocid": "group.post_submit_button",
                children: [
                  publishing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  "Publier"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "group.posts_list", children: loadingPosts ? ["p1", "p2"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }, k)) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 bg-card border border-border rounded-xl",
        "data-ocid": "group.posts_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: group.isMember || isOwner ? "Soyez le premier à publier dans ce groupe !" : "Rejoignez le groupe pour voir et publier du contenu." })
        ]
      }
    ) : posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupPostCard,
      {
        post,
        groupId,
        currentUsername: (profile == null ? void 0 : profile.username) ?? "",
        isGroupOwner: !!isOwner,
        onDelete: (id) => void handleDeletePost(id),
        onEdit: (id, content) => void handleEditPost(id, content),
        onLikeToggle: (id, liked) => void handleLikeToggle(id, liked),
        likedByMe: likedPosts.has(post.id.toString()),
        "data-ocid": `group.post.${i + 1}`
      },
      post.id.toString()
    )) })
  ] });
}
function GroupCard({
  group,
  index,
  onJoin,
  onLeave,
  joining,
  onClick
}) {
  const src = coverSrc(group);
  const memberCount = Number(group.memberCount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-smooth cursor-pointer",
      onClick,
      "data-ocid": `groups.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `h-28 bg-gradient-to-r ${getCoverColor(group.id)} relative`,
            style: src ? {
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            } : {},
            children: [
              !src && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `absolute top-2 right-2 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border backdrop-blur-sm ${group.isPrivate ? "border-amber-500/40 bg-amber-900/70 text-amber-300" : "border-primary/30 bg-primary/20 text-primary-foreground"}`,
                  children: [
                    group.isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
                    group.isPrivate ? "Privé" : "Public"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm leading-tight line-clamp-2", children: group.name }),
          group.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2", children: group.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
            memberCount,
            " membre",
            memberCount !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: group.isMember ? "outline" : "default",
              className: "w-full mt-1",
              "data-ocid": `groups.join_button.${index + 1}`,
              disabled: joining,
              onClick: (e) => {
                e.stopPropagation();
                if (group.isMember) {
                  onLeave(group.id);
                } else {
                  onJoin(group.id);
                }
              },
              children: joining ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" }) : group.isMember ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 mr-1" }),
                "Membre"
              ] }) : "Rejoindre le groupe"
            }
          )
        ] })
      ]
    }
  );
}
function GroupsPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const [groups, setGroups] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [loadError, setLoadError] = reactExports.useState("");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [joiningId, setJoiningId] = reactExports.useState(null);
  const [selectedGroupId, setSelectedGroupId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const loadGroups = reactExports.useCallback(async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    setLoadError("");
    try {
      const result = await actor.getGroups();
      setGroups(result ?? []);
    } catch {
      setLoadError("Impossible de charger les groupes.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching]);
  reactExports.useEffect(() => {
    if (actor && !isFetching) void loadGroups();
  }, [actor, isFetching, loadGroups]);
  const handleJoin = async (groupId) => {
    if (!actor) return;
    setJoiningId(groupId);
    try {
      const result = await actor.joinGroup(groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      setGroups(
        (prev) => prev.map(
          (g) => g.id === groupId ? { ...g, isMember: true, memberCount: g.memberCount + 1n } : g
        )
      );
      ue.success("Vous avez rejoint le groupe !");
    } catch {
      ue.error("Impossible de rejoindre le groupe.");
    } finally {
      setJoiningId(null);
    }
  };
  const handleLeave = async (groupId) => {
    if (!actor) return;
    setJoiningId(groupId);
    try {
      const result = await actor.leaveGroup(groupId);
      if (result.__kind__ === "err") throw new Error(result.err);
      setGroups(
        (prev) => prev.map(
          (g) => g.id === groupId ? {
            ...g,
            isMember: false,
            memberCount: g.memberCount > 0n ? g.memberCount - 1n : 0n
          } : g
        )
      );
      ue.success("Vous avez quitté le groupe.");
    } catch {
      ue.error("Impossible de quitter le groupe.");
    } finally {
      setJoiningId(null);
    }
  };
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto py-6 space-y-4", children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }, k)) }) });
  }
  if (status === "unauthenticated") return null;
  if (selectedGroupId !== null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto py-4 sm:py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupDetailView,
      {
        groupId: selectedGroupId,
        onBack: () => {
          setSelectedGroupId(null);
          setTimeout(() => void loadGroups(), 300);
        }
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto py-4 sm:py-6 space-y-5",
        "data-ocid": "groups.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-semibold text-foreground", children: "Groupes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Rejoignez des communautés ou créez la vôtre." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => void loadGroups(),
                  disabled: loading,
                  className: "gap-2 text-muted-foreground hover:text-foreground",
                  "aria-label": "Actualiser",
                  "data-ocid": "groups.refresh_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `w-4 h-4 ${loading ? "animate-spin" : ""}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => setShowCreate(true),
                  className: "gap-2 shrink-0",
                  "data-ocid": "groups.create_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Créer un groupe" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Créer" })
                  ]
                }
              )
            ] })
          ] }),
          loadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive",
              "data-ocid": "groups.error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
                loadError
              ]
            }
          ),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["l1", "l2", "l3", "l4", "l5", "l6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-56 w-full rounded-xl" }, k)) }) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl",
              "data-ocid": "groups.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Aucun groupe pour l'instant" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-xs", children: "Créez votre premier groupe et invitez vos amis à rejoindre la communauté." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => setShowCreate(true),
                    className: "gap-2",
                    "data-ocid": "groups.empty_create_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                      "Créer un groupe"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
              "data-ocid": "groups.list",
              children: groups.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                GroupCard,
                {
                  group: g,
                  index: i,
                  onJoin: (id) => void handleJoin(id),
                  onLeave: (id) => void handleLeave(id),
                  joining: joiningId === g.id,
                  onClick: () => setSelectedGroupId(g.id)
                },
                g.id.toString()
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateGroupModal,
      {
        onClose: () => setShowCreate(false),
        onCreated: (newGroup) => {
          setGroups((prev) => [newGroup, ...prev]);
          setShowCreate(false);
        }
      }
    ) })
  ] });
}
export {
  GroupsPage as default
};
