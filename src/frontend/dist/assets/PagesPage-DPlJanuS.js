const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-jDDIPp20.js","assets/index-CvIOltKC.js","assets/index-B1oBwxt7.css"])))=>i.map(i=>d[i]);
import { b as createLucideIcon, u as useNavigate, a as useLanguage, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, S as Skeleton, A as AnimatePresence, m as motion, _ as __vitePreload, e as ue, X } from "./index-CvIOltKC.js";
import { L as Layout, S as Search, B as BookOpen, i as isVerifiedUser, V as VerificationBadge, U as Users } from "./Layout-B9hj0KjP.js";
import { B as Button } from "./button-D8P5m97v.js";
import { I as Input } from "./input-B8YyjbrV.js";
import { L as Label } from "./label-DklZRZjq.js";
import { T as Textarea } from "./textarea-CtAPxEeQ.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, b as useQuery } from "./index-jDDIPp20.js";
import { P as Plus } from "./plus-P6EcCLjp.js";
import { C as CircleAlert } from "./circle-alert-BFMo9b6G.js";
import { C as Check } from "./check-ISwKLAqX.js";
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
  { value: "brand", label: "Marque" },
  { value: "public_figure", label: "Personnalité publique" },
  { value: "other", label: "Autre" }
];
function PageCard({
  page,
  index,
  onFollow,
  following
}) {
  const navigate = useNavigate();
  const isVerified = isVerifiedUser(page.username, page.isVerified);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.06 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-smooth cursor-pointer",
      "data-ocid": `pages.item.${index + 1}`,
      onClick: () => void navigate({ to: `/pages/${page.id.toText()}` }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-20 w-full relative overflow-hidden",
            style: {
              background: page.coverPhotoUrl ? void 0 : "linear-gradient(135deg,#0f1c5e 0%,#4169E1 60%,#5c7df5 100%)"
            },
            children: page.coverPhotoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: page.coverPhotoUrl,
                alt: page.username,
                className: "w-full h-full object-cover"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative px-4", style: { marginTop: -28 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full border-3 border-card bg-secondary overflow-hidden flex items-center justify-center shadow", children: page.profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: page.profilePhotoUrl,
            alt: page.username,
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-6 h-6 text-muted-foreground" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-1 pb-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h3",
              {
                className: "font-semibold text-foreground text-sm leading-tight truncate inline-flex items-center gap-1",
                "data-ocid": `pages.name.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: page.username }),
                  isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(VerificationBadge, { size: 13 })
                ]
              }
            ),
            page.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: page.bio })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                Number(page.followerCount).toLocaleString(),
                " ",
                Number(page.followerCount) === 1 ? "abonné" : "abonnés"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: following ? "outline" : "default",
                className: "h-7 text-xs px-3",
                "data-ocid": `pages.follow_button.${index + 1}`,
                onClick: (e) => {
                  e.stopPropagation();
                  onFollow(page.id.toText(), following);
                },
                children: following ? "Suivi(e)" : "Suivre"
              }
            )
          ] })
        ] })
      ]
    }
  );
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
      const backendActor = actor;
      if (typeof backendActor.createPage === "function") {
        const result = await backendActor.createPage(
          name.trim(),
          description.trim(),
          category
        );
        if (result && typeof result === "object" && "__kind__" in result && result.__kind__ === "err") {
          throw new Error(result.err);
        }
      } else {
        throw new Error(
          "La fonctionnalité de création de pages sera disponible prochainement."
        );
      }
      ue.success(`Page "${name.trim()}" créée avec succès !`);
      onCreated();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création";
      if (msg.includes("IC0508") || msg.includes("canister")) {
        setError("Service temporairement indisponible. Réessayez.");
      } else {
        setError(msg);
      }
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
                  className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
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
                        maxLength: 200,
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
function PagesPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t: _t } = useLanguage();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [followingIds, setFollowingIds] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const loadPages = reactExports.useCallback(async () => {
    if (!actor || isFetching) return [];
    try {
      if (searchTerm.trim()) {
        const results = await actor.searchUsers(searchTerm.trim());
        return (results ?? []).filter((u) => u.isOfficialPage);
      }
      const backendActor = actor;
      if (typeof backendActor.searchPages === "function") {
        return await backendActor.searchPages("") ?? [];
      }
      return [];
    } catch {
      return [];
    }
  }, [actor, isFetching, searchTerm]);
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["pages", searchTerm],
    queryFn: loadPages,
    enabled: !!actor && !isFetching,
    retry: false
  });
  const handleFollow = async (pageId, isCurrentlyFollowing) => {
    if (!actor) return;
    try {
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-jDDIPp20.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      if (isCurrentlyFollowing) {
        await actor.unfollowUser(Principal.fromText(pageId));
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(pageId);
          return next;
        });
      } else {
        await actor.followUser(Principal.fromText(pageId));
        setFollowingIds((prev) => new Set(prev).add(pageId));
      }
      void queryClient.invalidateQueries({ queryKey: ["pages"] });
    } catch {
      ue.error("Action échouée. Réessayez.");
    }
  };
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto py-6 space-y-4", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }, k)) }) });
  }
  if (status === "unauthenticated") return null;
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
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: ["l1", "l2", "l3", "l4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }, k)) }) : pages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl",
              "data-ocid": "pages.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: searchTerm ? /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground" }) }),
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
                  following: followingIds.has(page.id.toText())
                },
                page.id.toText()
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
        onCreated: () => {
          void queryClient.invalidateQueries({ queryKey: ["pages"] });
        }
      }
    ) })
  ] });
}
export {
  PagesPage as default
};
