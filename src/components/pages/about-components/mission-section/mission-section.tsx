import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks";

export const MissionSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRtl } = useLanguage();

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className={isRtl ? "md:order-2" : ""}>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
              {t("about.mission.title")}
            </h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>{t("about.mission.intro")}</p>
              <p>{t("about.mission.goal")}</p>
              <p className="text-primary font-semibold italic">
                {t("about.mission.quote")}
              </p>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className={`${isRtl ? "md:order-1" : ""} relative`}>
            <div className="relative h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="relative z-10 text-center p-8">
                <div
                  className={`text-6xl md:text-8xl font-amiri text-primary mb-4 ${
                    isRtl ? "text-right" : "text-center"
                  }`}
                  dir="rtl"
                >
                  ﷽
                </div>
                <p className="text-text-secondary font-medium">
                  {t("about.mission.bismillah")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
