import { b as createLucideIcon, u as useNavigate, d as useQueryClient, a as useLanguage, r as reactExports, j as jsxRuntimeExports, S as Skeleton, m as motion, e as ue } from "./index-DAQ2-jUM.js";
import { A as ADMIN_USERNAME, i as isVerifiedUser, L as Layout, G as Globe } from "./Layout-BNg2Wjue.js";
import { B as Button } from "./button-DLIi7HGy.js";
import { I as Input } from "./input-B0SAuJxC.js";
import { L as Label } from "./label-Bqya93fo.js";
import { T as Textarea } from "./textarea-CETY_tK5.js";
import { u as useCurrentUser, a as useAuthenticatedBackend, V as Visibility } from "./useCurrentUser-CLqn61Zi.js";
import { L as Lock } from "./lock-ILXbHwM4.js";
import { S as ShieldCheck } from "./shield-check-Drxens40.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function Section({
  title,
  description,
  children,
  delay = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] },
      className: "rounded-xl border border-border bg-card p-6 space-y-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground tracking-tight", children: title }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
        children
      ]
    }
  );
}
function VisibilityOption({
  value,
  current,
  onChange,
  icon: Icon,
  label,
  description
}) {
  const active = current === value;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onChange(value),
      "data-ocid": `visibility-option-${value}`,
      className: [
        "w-full flex items-start gap-4 rounded-lg border p-4 text-left transition-smooth cursor-pointer",
        active ? "metallic-border-active bg-primary/5" : "border-border bg-secondary/30 hover:bg-secondary/60"
      ].join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: [
              "mt-0.5 rounded-md p-2",
              active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            ].join(" "),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: [
                "text-sm font-semibold",
                active ? "text-foreground" : "text-muted-foreground"
              ].join(" "),
              children: label
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: [
              "mt-1 h-4 w-4 rounded-full border-2 flex-shrink-0 transition-smooth",
              active ? "border-primary bg-primary/40 shadow-[0_0_8px_oklch(var(--primary)/0.5)]" : "border-muted-foreground"
            ].join(" ")
          }
        )
      ]
    }
  );
}
function SettingsPage() {
  const { status, profile } = useCurrentUser();
  const { actor } = useAuthenticatedBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [visibility, setVisibility] = reactExports.useState(Visibility.everyone);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const isOwner = profile !== null && (profile == null ? void 0 : profile.username) === ADMIN_USERNAME && isVerifiedUser((profile == null ? void 0 : profile.username) ?? "", false);
  reactExports.useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio);
      setVisibility(profile.visibility);
    }
  }, [profile]);
  reactExports.useEffect(() => {
    if (status === "unauthenticated") {
      void navigate({ to: "/login" });
    }
  }, [status, navigate]);
  if (status === "initializing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto space-y-5 px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-36" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] }) });
  }
  if (status === "unauthenticated") return null;
  async function handleSave() {
    if (!actor) return;
    if (!username.trim()) {
      ue.error(t.usernameCannotBeEmpty);
      return;
    }
    setIsSaving(true);
    try {
      const ok = await actor.updateProfile(
        username.trim(),
        bio.trim(),
        visibility
      );
      if (ok) {
        await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        ue.success(t.settingsSaved);
      } else {
        ue.error(t.settingsSaveFailed);
      }
    } catch {
      ue.error(t.settingsSaveError);
    } finally {
      setIsSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "settings-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            className: "space-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground tracking-tight", children: t.settingsTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.settingsSubtitle })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Section,
          {
            title: t.accountSection,
            description: t.accountSectionDesc,
            delay: 0.08,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "username",
                    className: "text-sm font-medium text-foreground",
                    children: t.usernameLabel
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "username",
                    "data-ocid": "settings-username-input",
                    value: username,
                    onChange: (e) => setUsername(e.target.value),
                    placeholder: "your_username",
                    maxLength: 32,
                    className: "bg-secondary/30 border-input focus:metallic-border h-11"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t.usernameHint })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "bio",
                    className: "text-sm font-medium text-foreground",
                    children: t.bioLabel
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "bio",
                    "data-ocid": "settings-bio-input",
                    value: bio,
                    onChange: (e) => setBio(e.target.value),
                    placeholder: t.bioHint,
                    rows: 3,
                    maxLength: 280,
                    className: "bg-secondary/30 border-input resize-none focus:metallic-border"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  bio.length,
                  " / 280"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "settings-save-button",
                  onClick: handleSave,
                  disabled: isSaving,
                  className: "gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth shadow-[0_0_16px_oklch(var(--primary)/0.35)] hover:shadow-[0_0_24px_oklch(var(--primary)/0.5)]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
                    isSaving ? t.savingBtnLabel : t.saveBtn
                  ]
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Section,
          {
            title: t.privacySection,
            description: t.privacySectionDesc,
            delay: 0.16,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                VisibilityOption,
                {
                  value: Visibility.everyone,
                  current: visibility,
                  onChange: setVisibility,
                  icon: Globe,
                  label: t.everyone,
                  description: t.everyoneDesc
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                VisibilityOption,
                {
                  value: Visibility.followersOnly,
                  current: visibility,
                  onChange: setVisibility,
                  icon: Lock,
                  label: t.followersOnly,
                  description: t.followersOnlyDesc
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-1", children: t.visibilityHint })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t.aboutSection, delay: 0.24, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-primary/15 p-3 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 22, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base font-semibold text-foreground", children: t.aboutTitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: t.aboutDesc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 pt-1", children: t.aboutVersion })
          ] })
        ] }) }),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: t.adminDashboard ?? "Admin Dashboard", delay: 0.32, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t.adminDashboardDesc ?? "Manage users, reports, and verification badges." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => void navigate({ to: "/admin" }),
              className: "gap-2 shrink-0",
              "data-ocid": "settings.admin_dashboard_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { size: 16 }),
                t.adminDashboard ?? "Admin Dashboard"
              ]
            }
          )
        ] }) })
      ]
    }
  ) });
}
export {
  SettingsPage as default
};
