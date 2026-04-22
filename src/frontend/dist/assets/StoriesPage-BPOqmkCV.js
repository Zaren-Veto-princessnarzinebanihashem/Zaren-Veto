import { b as createLucideIcon, u as useNavigate, a as useLanguage, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, S as Skeleton, e as ue, m as motion, A as AnimatePresence, X } from "./index-Dk-qQMaL.js";
import { L as Layout, i as isVerifiedUser, V as VerificationBadge } from "./Layout-BVCNofFM.js";
import { S as StoriesCarousel, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bbj0gMpM.js";
import { B as Button } from "./button-Cry3JQpz.js";
import { I as Input } from "./input-DdnjB3WP.js";
import { L as Label } from "./label-CO0lAd9q.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery, c as useMutation } from "./index-BLH4z4M5.js";
import { C as Camera, u as useImageUpload } from "./useImageUpload-DoFdda7w.js";
import { P as Plus } from "./plus-9x160E-3.js";
import { C as Clock } from "./clock-BS8R_rD1.js";
import { E as Eye } from "./eye-BCB2Dfvk.js";
import { T as Trash2 } from "./trash-2-DYa842kh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17", key: "q6ojf0" }],
  [
    "path",
    {
      d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
      key: "k3hazp"
    }
  ],
  ["circle", { cx: "10", cy: "8", r: "2", key: "2qkj4p" }]
];
const BookImage = createLucideIcon("book-image", __iconNode);
function formatExpiry(story) {
  const nowMs = Date.now();
  const expiresMs = Number(story.expiresAt) / 1e6;
  const diffMs = expiresMs - nowMs;
  if (diffMs <= 0) return "Expired";
  const diffMin = Math.floor(diffMs / 6e4);
  const diffHr = Math.floor(diffMin / 60);
  return diffHr >= 1 ? `${diffHr}h` : `${diffMin}m`;
}
function CreateStoryModal({
  open,
  onClose
}) {
  const { t } = useLanguage();
  const { actor } = useAuthenticatedBackend();
  const { uploadImage, uploading } = useImageUpload();
  const qc = useQueryClient();
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [textOverlay, setTextOverlay] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const createStory = useMutation({
    mutationFn: async ({
      imageUrl,
      text
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStory(imageUrl, text);
    },
    onSuccess: () => {
      ue.success(t.storiesCreated);
      void qc.invalidateQueries({ queryKey: ["storiesFeed"] });
      void qc.invalidateQueries({ queryKey: ["myStories"] });
      handleClose();
    },
    onError: () => ue.error(t.storiesLoadFailed)
  });
  const handleClose = () => {
    setImagePreview(null);
    setTextOverlay("");
    onClose();
  };
  const handleFileSelect = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const dataUrl = await uploadImage(file).catch(() => null);
    if (dataUrl) setImagePreview(dataUrl);
    e.target.value = "";
  };
  const handleSubmit = async () => {
    if (!imagePreview) return;
    await createStory.mutateAsync({
      imageUrl: imagePreview,
      text: textOverlay.trim() || null
    });
  };
  const isPending = uploading || createStory.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "create-story-dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookImage, { className: "w-4 h-4 text-primary" }),
          t.storiesCreate
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          imagePreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden bg-secondary aspect-[9/16] max-h-64", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: imagePreview,
                alt: "Story preview",
                className: "w-full h-full object-cover"
              }
            ),
            textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-0 right-0 flex justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bg-black/60 text-white text-sm font-semibold px-3 py-1.5 rounded-lg text-center backdrop-blur-sm max-w-full break-words", children: textOverlay }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setImagePreview(null),
                className: "absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-smooth",
                "aria-label": "Remove image",
                "data-ocid": "create-story.remove-image",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                className: "absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-smooth",
                "aria-label": "Change image",
                "data-ocid": "create-story.change-image",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4" })
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              disabled: isPending,
              className: "w-full aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-smooth",
              "data-ocid": "create-story.upload_button",
              children: [
                uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-8 h-8 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: t.storiesAddImage })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "image/*",
              className: "sr-only",
              onChange: (e) => void handleFileSelect(e),
              "data-ocid": "create-story.file-input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: t.storiesAddTextOverlay }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: textOverlay,
                onChange: (e) => setTextOverlay(e.target.value),
                placeholder: t.storiesAddTextOverlay,
                maxLength: 120,
                className: "bg-secondary border-input text-sm",
                "data-ocid": "create-story.text-overlay-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground text-right", children: [
              textOverlay.length,
              "/120"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: handleClose,
              disabled: isPending,
              "data-ocid": "create-story.cancel_button",
              children: t.cancel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => void handleSubmit(),
              disabled: !imagePreview || isPending,
              "data-ocid": "create-story.submit_button",
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                t.publishing
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                t.storiesPost
              ] })
            }
          )
        ] })
      ]
    }
  ) });
}
function MyStoryCard({
  story,
  index,
  onDelete
}) {
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const expiry = formatExpiry(story);
  const isExpired = expiry === "Expired";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: index * 0.06 },
        className: "relative bg-card border border-border rounded-xl overflow-hidden group",
        "data-ocid": `my-story.item.${index + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[9/16] max-h-52 overflow-hidden bg-secondary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: story.imageUrl,
                alt: "Story",
                className: "w-full h-full object-cover group-hover:scale-105 transition-smooth"
              }
            ),
            story.textOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-10 left-0 right-0 flex justify-center px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-lg text-center backdrop-blur-sm max-w-full truncate", children: story.textOverlay }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-xs font-medium ${isExpired ? "text-destructive" : "text-muted-foreground"}`,
                  children: [
                    t.storiesExpiresIn,
                    " ",
                    expiry
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                story.viewCount.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowConfirm(true),
                  className: "w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
                  "aria-label": "Delete story",
                  "data-ocid": `my-story.delete_button.${index + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showConfirm, onOpenChange: setShowConfirm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-xs",
        "data-ocid": "delete-story-dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base", children: t.storiesDeleteConfirm }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setShowConfirm(false),
                "data-ocid": "delete-story.cancel_button",
                children: t.cancel
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "destructive",
                onClick: () => {
                  onDelete(story.id);
                  setShowConfirm(false);
                },
                "data-ocid": "delete-story.confirm_button",
                children: t.storiesDelete
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function StoriesPage() {
  const { status, profile } = useCurrentUser();
  const { actor, isFetching } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const { t, isRTL: isRtl } = useLanguage();
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/login" });
    }
  }, [status, navigate]);
  const { data: myStories = [], isLoading } = useQuery({
    queryKey: ["myStories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyStories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e4
  });
  const deleteStory = useMutation({
    mutationFn: async (storyId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteStory(storyId);
    },
    onSuccess: () => {
      ue.success(t.storiesDeleteSuccess);
      void qc.invalidateQueries({ queryKey: ["myStories"] });
      void qc.invalidateQueries({ queryKey: ["storiesFeed"] });
    },
    onError: () => ue.error("Failed to delete")
  });
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" })
    ] }) });
  }
  if (status === "unauthenticated") return null;
  const currentUserId = profile == null ? void 0 : profile.id.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto space-y-6",
        dir: isRtl ? "rtl" : "ltr",
        "data-ocid": "stories-page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: t.storiesCreate }),
              profile && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.username }),
                isVerifiedUser(profile.username, profile.isVerified) && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 14 })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setCreateOpen(true),
                className: "gap-2",
                "data-ocid": "stories-create_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  t.storiesCreate
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StoriesCarousel,
            {
              currentUserId,
              onCreateStory: () => setCreateOpen(true)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground mb-4", children: t.storiesYourStory }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: ["sk1", "sk2", "sk3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Skeleton,
              {
                className: "aspect-[9/16] max-h-52 rounded-xl"
              },
              k
            )) }) : myStories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                className: "flex flex-col items-center justify-center py-16 text-center",
                "data-ocid": "stories.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookImage, { className: "w-7 h-7 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-semibold text-foreground mb-2", children: t.storiesNoStories }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 max-w-xs", children: t.storiesCreateStory }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      onClick: () => setCreateOpen(true),
                      className: "gap-2",
                      "data-ocid": "stories.create-first_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4" }),
                        t.storiesCreate
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", "data-ocid": "my-stories-list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: myStories.map((story, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              MyStoryCard,
              {
                story,
                index: i,
                onDelete: (id) => deleteStory.mutate(id)
              },
              story.id.toString()
            )) }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateStoryModal,
      {
        open: createOpen,
        onClose: () => setCreateOpen(false)
      }
    )
  ] });
}
export {
  StoriesPage as default
};
