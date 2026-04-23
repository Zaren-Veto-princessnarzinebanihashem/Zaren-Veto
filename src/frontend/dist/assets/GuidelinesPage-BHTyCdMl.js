import { b as createLucideIcon, a as useLanguage, u as useNavigate, j as jsxRuntimeExports } from "./index-CinqF2FC.js";
import { L as Layout, U as Users } from "./Layout-B_cAPpUr.js";
import { A as ArrowLeft } from "./arrow-left-B06wAvc1.js";
import { B as Ban, a as BadgeCheck } from "./ban-DWJT7vED.js";
import { F as Flag } from "./flag-CKLcHI1_.js";
import "./index-DXe1TNIQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m11 17 2 2a1 1 0 1 0 3-3", key: "efffak" }],
  [
    "path",
    {
      d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
      key: "9pr0kb"
    }
  ],
  ["path", { d: "m21 3 1 11h-2", key: "1tisrp" }],
  ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3", key: "1uvwmv" }],
  ["path", { d: "M3 4h8", key: "1ep09j" }]
];
const Handshake = createLucideIcon("handshake", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M12 7v2", key: "stiyo7" }],
  ["path", { d: "M12 13h.01", key: "y0uutt" }]
];
const MessageSquareWarning = createLucideIcon("message-square-warning", __iconNode$1);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
const SECTION_ICONS = [
  Handshake,
  Ban,
  BadgeCheck,
  ShieldAlert,
  Ban,
  Ban,
  BadgeCheck,
  MessageSquareWarning
];
function GuidelinesPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar";
  const sections = [
    { title: t.cgSection1Title, body: t.cgSection1Body },
    { title: t.cgSection2Title, body: t.cgSection2Body },
    { title: t.cgSection3Title, body: t.cgSection3Body },
    { title: t.cgSection4Title, body: t.cgSection4Body },
    { title: t.cgSection5Title, body: t.cgSection5Body },
    { title: t.cgSection6Title, body: t.cgSection6Body },
    { title: t.cgSection7Title, body: t.cgSection7Body },
    { title: t.cgSection8Title, body: t.cgSection8Body }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12",
      "data-ocid": "guidelines.page",
      dir: isRtl ? "rtl" : "ltr",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex items-center ${isRtl ? "flex-row-reverse justify-end" : ""}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => void navigate({ to: "/" }),
                className: "flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm min-h-[44px]",
                "data-ocid": "guidelines.back-button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: `w-4 h-4 ${isRtl ? "rotate-180" : ""}` }),
                  t.backToHome
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border-b border-border px-4 sm:px-8 py-5 sm:py-6 flex items-center gap-3 sm:gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 sm:w-6 sm:h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-display font-bold text-foreground leading-tight", children: t.communityGuidelines }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground mt-0.5", children: [
                t.lastUpdated,
                ": 14",
                " ",
                language === "ar" ? "أبريل" : language === "fr" ? "avril" : "April",
                " ",
                "2026"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-5 sm:py-6 border-b border-border bg-primary/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed", children: t.cgIntro }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: sections.map((section, index) => {
            const Icon = SECTION_ICONS[index] ?? Handshake;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-4 sm:px-8 py-4 sm:py-5 flex gap-3 sm:gap-4 items-start",
                "data-ocid": `guidelines.item.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm sm:text-base font-semibold text-foreground leading-snug", children: section.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: section.body })
                  ] })
                ]
              },
              section.title
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-4 sm:py-5 border-t border-border bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 sm:gap-4 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm sm:text-base font-semibold text-foreground leading-snug", children: t.cgReportTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: t.cgReportBody })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-4 sm:py-5 bg-destructive/[0.03] rounded-b-2xl border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 sm:gap-4 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm sm:text-base font-semibold text-foreground leading-snug", children: t.cgEnforcementTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: t.cgEnforcementBody })
            ] })
          ] }) })
        ] })
      ]
    }
  ) });
}
export {
  GuidelinesPage as default
};
