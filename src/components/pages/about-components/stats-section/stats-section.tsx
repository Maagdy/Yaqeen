import { useTranslation } from "react-i18next";
import { formatNumber } from "@/utils/numbers";
import { useLanguage } from "@/hooks";

export const StatsSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const stats = [
    {
      value: 114,
      label: t("about.stats.surahs"),
      suffix: "",
    },
    {
      value: 6236,
      label: t("about.stats.ayahs"),
      suffix: "",
    },
    {
      value: 32,
      label: t("about.stats.duas"),
      suffix: "",
    },
    {
      value: 100,
      label: t("about.stats.reciters"),
      suffix: "+",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t("about.stats.title")}
          </h2>
          <p className="text-lg text-text-secondary">
            {t("about.stats.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {formatNumber(stat.value, language)}
                {stat.suffix}
              </div>
              <div className="text-text-secondary font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <p className="text-text-secondary leading-relaxed">
            {t("about.stats.description")}
          </p>
        </div>
      </div>
    </section>
  );
};
