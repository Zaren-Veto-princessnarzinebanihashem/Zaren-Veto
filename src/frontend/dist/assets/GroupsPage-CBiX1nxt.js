import { u as useNavigate, a as useLanguage, r as reactExports, j as jsxRuntimeExports, S as Skeleton, A as AnimatePresence, m as motion, e as ue, X } from "./index-CinqF2FC.js";
import { L as Layout, U as Users, G as Globe } from "./Layout-B_cAPpUr.js";
import { B as Button } from "./button-CFWNxzA7.js";
import { I as Input } from "./input-Bc61c2Ky.js";
import { L as Label } from "./label-B7_gM1lJ.js";
import { T as Textarea } from "./textarea-CPs-WpsV.js";
import { u as useCurrentUser } from "./index-DXe1TNIQ.js";
import { P as Plus } from "./plus-eU10gAZb.js";
import { L as Lock } from "./lock-CzUPLmOL.js";
import { C as Check } from "./check-DftDiFuj.js";
const COVER_COLORS = [
  "from-violet-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600"
];
const INITIAL_GROUPS = [
  {
    id: "g1",
    name: "Zaren Veto Community",
    description: "La communauté officielle de Zaren Veto — discussions, annonces et partages.",
    isPrivate: false,
    memberCount: 19,
    createdAt: Date.now() - 864e5 * 7,
    coverColor: COVER_COLORS[0]
  },
  {
    id: "g2",
    name: "Privacy & Digital Rights",
    description: "Partagez des ressources sur la souveraineté numérique et la protection de la vie privée.",
    isPrivate: false,
    memberCount: 8,
    createdAt: Date.now() - 864e5 * 3,
    coverColor: COVER_COLORS[4]
  }
];
function GroupCard({
  group,
  index
}) {
  const date = new Date(group.createdAt).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-smooth",
      "data-ocid": `groups.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-20 bg-gradient-to-r ${group.coverColor} relative`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 text-white" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-base leading-tight", children: group.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${group.isPrivate ? "border-amber-500/40 bg-amber-500/10 text-amber-400" : "border-primary/30 bg-primary/10 text-primary"}`,
                children: [
                  group.isPrivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-2.5 h-2.5" }),
                  group.isPrivate ? "Privé" : "Public"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2", children: group.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              group.memberCount,
              " membre",
              group.memberCount !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "w-full mt-1 border-primary/30 text-primary hover:bg-primary/10",
              "data-ocid": `groups.join_button.${index + 1}`,
              onClick: () => ue.success(`Vous avez rejoint "${group.name}" !`),
              children: "Rejoindre le groupe"
            }
          )
        ] })
      ]
    }
  );
}
function CreateGroupModal({
  onClose,
  onCreate
}) {
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [isPrivate, setIsPrivate] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      ue.error("Le nom du groupe est requis.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    onCreate({ name: name.trim(), description: description.trim(), isPrivate });
    setDone(true);
    setSubmitting(false);
    setTimeout(onClose, 900);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      onClick: (e) => e.target === e.currentTarget && onClose(),
      "data-ocid": "groups.create_dialog",
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: (e) => void handleSubmit(e),
                className: "p-5 space-y-4",
                "data-ocid": "groups.create_form",
                children: [
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
                        maxLength: 200,
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
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function GroupsPage() {
  const { status } = useCurrentUser();
  const navigate = useNavigate();
  const { t: _t } = useLanguage();
  const [groups, setGroups] = reactExports.useState(INITIAL_GROUPS);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  const handleCreate = (g) => {
    const newGroup = {
      ...g,
      id: `g${Date.now()}`,
      memberCount: 1,
      createdAt: Date.now(),
      coverColor: COVER_COLORS[groups.length % COVER_COLORS.length]
    };
    setGroups((prev) => [newGroup, ...prev]);
    ue.success(`Groupe "${g.name}" créé avec succès !`);
  };
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto py-6 space-y-4", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }, k)) }) });
  }
  if (status === "unauthenticated") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-2xl mx-auto py-4 sm:py-6 space-y-5",
        "data-ocid": "groups.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-semibold text-foreground", children: "Groupes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Rejoignez des communautés ou créez la vôtre." })
            ] }),
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
          ] }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: ["l1", "l2", "l3", "l4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-56 w-full rounded-xl" }, k)) }) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
              className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
              "data-ocid": "groups.list",
              children: groups.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(GroupCard, { group: g, index: i }, g.id))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center px-4", children: "Les groupes sont en version bêta. La persistance complète sur le backend est en cours de développement." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateGroupModal,
      {
        onClose: () => setShowCreate(false),
        onCreate: handleCreate
      }
    ) })
  ] });
}
export {
  GroupsPage as default
};
