import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks";
import { formatNumber } from "@/utils/numbers";

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-linear-to-br from-primary/5 via-background to-primary/10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            {t("about.badge")}
          </span>
        </div>

        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight ${
            isRtl ? "font-amiri" : ""
          }`}
        >
          {t("about.hero.title")}
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-8">
          {t("about.hero.description")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="px-6 py-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t("about.hero.established")}
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatNumber(2026, language)}
            </p>
          </div>
          <div className="px-6 py-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t("about.hero.type")}
            </p>
            <p className="text-2xl font-bold text-primary">
              {t("about.hero.sadaqah")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
