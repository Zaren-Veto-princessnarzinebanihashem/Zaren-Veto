import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar";

  return (
    <Layout>
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12"
        data-ocid="privacy-policy.page"
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
            data-ocid="privacy-policy.back-button"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            {t.backToHome}
          </button>
        </div>

        {/* Header card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="bg-primary/5 border-b border-border px-4 sm:px-8 py-5 sm:py-6 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground leading-tight">
                {t.privacyPolicy}
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
              {t.ppIntro}
            </p>
          </div>

          {/* Sections */}
          <div className="divide-y divide-border">
            <PolicySection title={t.ppSection1Title} body={t.ppSection1Body} />
            <PolicySection
              title={t.ppSection2Title}
              body={t.ppSection2Body}
              icon="lock"
            />
            <PolicySection title={t.ppSection3Title} body={t.ppSection3Body} />
            <PolicySection
              title={t.ppSection4Title}
              body={t.ppSection4Body}
              highlight
            />
            <PolicySection title={t.ppSection5Title} body={t.ppSection5Body} />
            <PolicySection title={t.ppSection6Title} body={t.ppSection6Body} />
            <PolicySection title={t.ppSection7Title} body={t.ppSection7Body} />
            <PolicySection title={t.ppSection8Title} body={t.ppSection8Body} />
          </div>

          {/* Contact */}
          <div className="px-4 sm:px-8 py-5 sm:py-6 bg-muted/30 rounded-b-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                  {t.ppContactTitle}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t.ppContactBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PolicySection({
  title,
  body,
  highlight = false,
  icon,
}: {
  title: string;
  body: string;
  highlight?: boolean;
  icon?: string;
}) {
  return (
    <div
      className={`px-4 sm:px-8 py-4 sm:py-5 space-y-2 ${highlight ? "bg-primary/[0.03]" : ""}`}
    >
      <h2
        className={`text-sm sm:text-base font-semibold ${highlight ? "text-primary" : "text-foreground"} flex items-center gap-2 leading-snug`}
      >
        {icon === "lock" && <Lock className="w-4 h-4 text-primary shrink-0" />}
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  );
}
