import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText, TriangleAlert } from "lucide-react";

export default function TermsPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar";

  return (
    <Layout>
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 pb-12"
        data-ocid="terms.page"
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
            data-ocid="terms.back-button"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            {t.backToHome}
          </button>
        </div>

        {/* Header card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="bg-primary/5 border-b border-border px-4 sm:px-8 py-5 sm:py-6 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground leading-tight">
                {t.termsOfService}
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
              {t.tosIntro}
            </p>
          </div>

          {/* Sections */}
          <div className="divide-y divide-border">
            <TermsSection title={t.tosSection1Title} body={t.tosSection1Body} />
            <TermsSection title={t.tosSection2Title} body={t.tosSection2Body} />
            <TermsSection title={t.tosSection3Title} body={t.tosSection3Body} />
            <TermsSection
              title={t.tosSection4Title}
              body={t.tosSection4Body}
              highlight
            />
            <TermsSection title={t.tosSection5Title} body={t.tosSection5Body} />
            <TermsSection title={t.tosSection6Title} body={t.tosSection6Body} />
            <TermsSection
              title={t.tosSection7Title}
              body={t.tosSection7Body}
              highlight
            />
            <TermsSection title={t.tosSection8Title} body={t.tosSection8Body} />
            <TermsSection title={t.tosSection9Title} body={t.tosSection9Body} />
          </div>

          {/* Important notice */}
          <div className="px-4 sm:px-8 py-4 sm:py-5 bg-muted/30 rounded-b-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <TriangleAlert className="w-4 h-4 text-destructive" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "استخدامك للمنصة يعني موافقتك على هذه الشروط. إذا كنت لا توافق على أي بند، يرجى التوقف عن استخدام زارن فيتو."
                  : language === "fr"
                    ? "L'utilisation de la plateforme implique votre acceptation de ces conditions. Si vous n'acceptez pas une clause, veuillez cesser d'utiliser Zaren Veto."
                    : "Using the platform constitutes acceptance of these terms. If you disagree with any clause, please stop using Zaren Veto."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function TermsSection({
  title,
  body,
  highlight = false,
}: {
  title: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`px-4 sm:px-8 py-4 sm:py-5 space-y-2 ${highlight ? "bg-destructive/[0.02]" : ""}`}
    >
      <h2
        className={`text-sm sm:text-base font-semibold leading-snug ${highlight ? "text-destructive/80" : "text-foreground"}`}
      >
        {title}
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  );
}
