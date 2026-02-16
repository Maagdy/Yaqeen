import { useTranslation } from "react-i18next";
import { TipsAndUpdates, School, Groups } from "@mui/icons-material";

export const VisionSection: React.FC = () => {
  const { t } = useTranslation();

  const visionPoints = [
    {
      icon: TipsAndUpdates,
      title: t("about.vision.innovation.title"),
      description: t("about.vision.innovation.description"),
    },
    {
      icon: School,
      title: t("about.vision.education.title"),
      description: t("about.vision.education.description"),
    },
    {
      icon: Groups,
      title: t("about.vision.community.title"),
      description: t("about.vision.community.description"),
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t("about.vision.title")}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("about.vision.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {visionPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="text-center p-8 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-primary text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {point.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
