import { b as createLucideIcon, a as useLanguage, u as useNavigate, j as jsxRuntimeExports } from "./index-I4BClEcX.js";
import { L as Layout } from "./Layout-ylNcgSWV.js";
import { A as ArrowLeft } from "./arrow-left-CQBTROJr.js";
import { F as FileText } from "./file-text-SPtuf3L-.js";
import "./useCurrentUser-BgKU1S1t.js";
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
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function TermsPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12",
      "data-ocid": "terms.page",
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
                "data-ocid": "terms.back-button",
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 sm:w-6 sm:h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-display font-bold text-foreground leading-tight", children: t.termsOfService }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-5 sm:py-6 border-b border-border bg-primary/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed", children: t.tosIntro }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection1Title, body: t.tosSection1Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection2Title, body: t.tosSection2Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection3Title, body: t.tosSection3Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TermsSection,
              {
                title: t.tosSection4Title,
                body: t.tosSection4Body,
                highlight: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection5Title, body: t.tosSection5Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection6Title, body: t.tosSection6Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TermsSection,
              {
                title: t.tosSection7Title,
                body: t.tosSection7Body,
                highlight: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection8Title, body: t.tosSection8Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: t.tosSection9Title, body: t.tosSection9Body })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-4 sm:py-5 bg-muted/30 rounded-b-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: language === "ar" ? "استخدامك للمنصة يعني موافقتك على هذه الشروط. إذا كنت لا توافق على أي بند، يرجى التوقف عن استخدام زارن فيتو." : language === "fr" ? "L'utilisation de la plateforme implique votre acceptation de ces conditions. Si vous n'acceptez pas une clause, veuillez cesser d'utiliser Zaren Veto." : "Using the platform constitutes acceptance of these terms. If you disagree with any clause, please stop using Zaren Veto." })
          ] }) })
        ] })
      ]
    }
  ) });
}
function TermsSection({
  title,
  body,
  highlight = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `px-4 sm:px-8 py-4 sm:py-5 space-y-2 ${highlight ? "bg-destructive/[0.02]" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: `text-sm sm:text-base font-semibold leading-snug ${highlight ? "text-destructive/80" : "text-foreground"}`,
            children: title
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: body })
      ]
    }
  );
}
export {
  TermsPage as default
};
