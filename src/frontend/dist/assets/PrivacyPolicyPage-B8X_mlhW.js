import { a as useLanguage, u as useNavigate, j as jsxRuntimeExports } from "./index-CvIOltKC.js";
import { L as Layout } from "./Layout-B9hj0KjP.js";
import { A as ArrowLeft } from "./arrow-left-z1ZYzBE8.js";
import { S as Shield } from "./shield-CWyNyhYw.js";
import { L as Lock } from "./lock-DxaJhVmU.js";
import "./index-jDDIPp20.js";
function PrivacyPolicyPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12",
      "data-ocid": "privacy-policy.page",
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
                "data-ocid": "privacy-policy.back-button",
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 sm:w-6 sm:h-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-display font-bold text-foreground leading-tight", children: t.privacyPolicy }),
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-5 sm:py-6 border-b border-border bg-primary/[0.02]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground leading-relaxed", children: t.ppIntro }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicySection, { title: t.ppSection1Title, body: t.ppSection1Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PolicySection,
              {
                title: t.ppSection2Title,
                body: t.ppSection2Body,
                icon: "lock"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicySection, { title: t.ppSection3Title, body: t.ppSection3Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PolicySection,
              {
                title: t.ppSection4Title,
                body: t.ppSection4Body,
                highlight: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicySection, { title: t.ppSection5Title, body: t.ppSection5Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicySection, { title: t.ppSection6Title, body: t.ppSection6Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicySection, { title: t.ppSection7Title, body: t.ppSection7Body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PolicySection, { title: t.ppSection8Title, body: t.ppSection8Body })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 sm:px-8 py-5 sm:py-6 bg-muted/30 rounded-b-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-1 text-sm sm:text-base", children: t.ppContactTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: t.ppContactBody })
            ] })
          ] }) })
        ] })
      ]
    }
  ) });
}
function PolicySection({
  title,
  body,
  highlight = false,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `px-4 sm:px-8 py-4 sm:py-5 space-y-2 ${highlight ? "bg-primary/[0.03]" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: `text-sm sm:text-base font-semibold ${highlight ? "text-primary" : "text-foreground"} flex items-center gap-2 leading-snug`,
            children: [
              icon === "lock" && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-primary shrink-0" }),
              title
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: body })
      ]
    }
  );
}
export {
  PrivacyPolicyPage as default
};
