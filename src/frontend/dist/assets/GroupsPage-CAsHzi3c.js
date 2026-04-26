import { u as useNavigate, a as useLanguage, r as reactExports, j as jsxRuntimeExports, S as Skeleton, A as AnimatePresence, m as motion, e as ue, X } from "./index-CRJrpZcN.js";
import { L as Layout, U as Users, G as Globe } from "./Layout-1CdJlI07.js";
import { B as Button } from "./button-CbhMEDZc.js";
import { I as Input } from "./input-B9zHAdGN.js";
import { L as Label } from "./label-DFGhcx1o.js";
import { T as Textarea } from "./textarea-BZuuetXX.js";
import { u as useCurrentUser, a as useAuthenticatedBackend } from "./index-DSDpu3c4.js";
import { R as RefreshCw } from "./refresh-cw-DpJrYbhy.js";
import { P as Plus } from "./plus-DoMiqqyF.js";
import { C as CircleAlert } from "./circle-alert-Dsezs321.js";
import { L as Lock } from "./lock-CCCZokAW.js";
import { C as Check } from "./check-DYAHlScY.js";
const COVER_COLORS = [
  "from-violet-600 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600"
];
function getCoverColor(id) {
  const n = Number(typeof id === "bigint" ? id % 5n : id);
  return COVER_COLORS[Math.abs(n) % COVER_COLORS.length];
}
function GroupCard({
  group,
  index,
  onJoin,
  joining
}) {
  const date = new Date(Number(group.createdAt) / 1e6).toLocaleDateString(
    void 0,
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
  const memberCount = Number(group.memberCount);
  const coverColor = getCoverColor(group.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      className: "bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-smooth",
      "data-ocid": `groups.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-20 bg-gradient-to-r ${coverColor} relative`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 text-white" }) }) }),
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
          group.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed line-clamp-2", children: group.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
              memberCount,
              " membre",
              memberCount !== 1 ? "s" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: group.isMember ? "outline" : "default",
              className: "w-full mt-1",
              "data-ocid": `groups.join_button.${index + 1}`,
              disabled: joining || group.isMember,
              onClick: () => !group.isMember && onJoin(group.id),
              children: group.isMember ? "Membre" : "Rejoindre le groupe"
            }
          )
        ] })
      ]
    }
  );
}
function CreateGroupModal({
  onClose,
  onCreated
}) {
  const { actor } = useAuthenticatedBackend();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [isPrivate, setIsPrivate] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
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
      const backendActor = actor;
      if (typeof backendActor.createGroup !== "function") {
        throw new Error(
          "La fonctionnalité groupes n'est pas encore disponible sur ce serveur."
        );
      }
      const result = await backendActor.createGroup(
        name.trim(),
        description.trim(),
        isPrivate,
        null
      );
      if (result && typeof result === "object" && "__kind__" in result && result.__kind__ === "err") {
        throw new Error(result.err);
      }
      setDone(true);
      ue.success(`Groupe "${name.trim()}" créé avec succès !`);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création";
      setError(msg);
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
  const { actor, isFetching } = useAuthenticatedBackend();
  const { t: _t } = useLanguage();
  const [groups, setGroups] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [loadError, setLoadError] = reactExports.useState("");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [joiningId, setJoiningId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") void navigate({ to: "/login" });
  }, [status, navigate]);
  const loadGroups = reactExports.useCallback(async () => {
    if (!actor || isFetching) return;
    setLoading(true);
    setLoadError("");
    try {
      const backendActor = actor;
      if (typeof backendActor.getGroups !== "function") {
        setGroups([]);
        setLoading(false);
        return;
      }
      const result = await backendActor.getGroups();
      setGroups(result ?? []);
    } catch {
      setLoadError("Impossible de charger les groupes.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [actor, isFetching]);
  reactExports.useEffect(() => {
    if (actor && !isFetching) {
      void loadGroups();
    }
  }, [actor, isFetching, loadGroups]);
  const handleJoin = async (groupId) => {
    if (!actor) return;
    setJoiningId(groupId);
    try {
      const backendActor = actor;
      if (typeof backendActor.joinGroup === "function") {
        await backendActor.joinGroup(groupId);
      }
      await loadGroups();
      ue.success("Vous avez rejoint le groupe !");
    } catch {
      ue.error("Impossible de rejoindre le groupe.");
    } finally {
      setJoiningId(null);
    }
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
              children: groups.map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                GroupCard,
                {
                  group: g,
                  index: i,
                  onJoin: (id) => void handleJoin(id),
                  joining: joiningId === g.id
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
        onCreated: () => void loadGroups()
      }
    ) })
  ] });
}
export {
  GroupsPage as default
};
