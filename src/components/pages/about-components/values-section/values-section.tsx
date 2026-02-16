import { useTranslation } from "react-i18next";
import {
  VerifiedUser,
  Language,
  Accessible,
  Favorite,
} from "@mui/icons-material";

export const ValuesSection: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: VerifiedUser,
      title: t("about.values.authenticity.title"),
      description: t("about.values.authenticity.description"),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Accessible,
      title: t("about.values.accessibility.title"),
      description: t("about.values.accessibility.description"),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Language,
      title: t("about.values.multilingual.title"),
      description: t("about.values.multilingual.description"),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Favorite,
      title: t("about.values.free.title"),
      description: t("about.values.free.description"),
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t("about.values.title")}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("about.values.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="flex gap-6 p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow"
              >
                <div
                  className={`flex-shrink-0 w-16 h-16 ${value.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`${value.color} text-3xl`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
