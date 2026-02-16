import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { ArrowForward } from "@mui/icons-material";
import { useLanguage } from "@/hooks";

export const CTASection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isRtl } = useLanguage();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8">
          <h2
            className={`text-3xl md:text-4xl font-bold text-text-primary mb-4 ${
              isRtl ? "font-amiri" : ""
            }`}
          >
            {t("about.cta.title")}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("about.cta.description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate(ROUTES.QURAN)}
            className="group px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {t("about.cta.explore_quran")}
            <ArrowForward
              className={`group-hover:translate-x-1 transition-transform ${
                isRtl ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            onClick={() => navigate(ROUTES.AUTH)}
            className="px-8 py-4 bg-card border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-all"
          >
            {t("about.cta.join_community")}
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p
            className={`text-text-secondary mb-4 ${isRtl ? "font-amiri" : ""}`}
          >
            {t("about.cta.support_text")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>{t("about.cta.open_source")}</span>
            <span>•</span>
            <span>{t("about.cta.no_ads")}</span>
            <span>•</span>
            <span>{t("about.cta.free_forever")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
