import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Flag,
  HandshakeIcon,
  MessageSquareWarning,
  ShieldAlert,
  Users,
} from "lucide-react";

const SECTION_ICONS = [
  HandshakeIcon,
  Ban,
  BadgeCheck,
  ShieldAlert,
  Ban,
  Ban,
  BadgeCheck,
  MessageSquareWarning,
];

export default function GuidelinesPage() {
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
    { title: t.cgSection8Title, body: t.cgSection8Body },
  ];

  return (
    <Layout>
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12"
        data-ocid="guidelines.page"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Back navigation */}
        <div
          className={`flex items-center ${isRtl ? "flex-row-reverse justify-end" : ""}`}
        >
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm min-h-[44px]"
            data-ocid="guidelines.back-button"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            {t.backToHome}
          </button>
        </div>

        {/* Header card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="bg-primary/5 border-b border-border px-4 sm:px-8 py-5 sm:py-6 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground leading-tight">
                {t.communityGuidelines}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {t.lastUpdated}: 14{" "}
                {language === "ar"
                  ? "أبريل"
                  : language === "fr"
                    ? "avril"
                    : "April"}{" "}
                2026
              </p>
            </div>
          </div>

          {/* Intro */}
          <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-border bg-primary/[0.02]">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t.cgIntro}
            </p>
          </div>

          {/* Guidelines sections */}
          <div className="divide-y divide-border">
            {sections.map((section, index) => {
              const Icon = SECTION_ICONS[index] ?? HandshakeIcon;
              return (
                <div
                  key={section.title}
                  className="px-4 sm:px-8 py-4 sm:py-5 flex gap-3 sm:gap-4 items-start"
                  data-ocid={`guidelines.item.${index + 1}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <h2 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                      {section.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reporting section */}
          <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-border bg-muted/20">
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Flag className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                  {t.cgReportTitle}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t.cgReportBody}
                </p>
              </div>
            </div>
          </div>

          {/* Enforcement section */}
          <div className="px-4 sm:px-8 py-4 sm:py-5 bg-destructive/[0.03] rounded-b-2xl border-t border-border">
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4 text-destructive" />
              </div>
              <div className="space-y-2 min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                  {t.cgEnforcementTitle}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t.cgEnforcementBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
