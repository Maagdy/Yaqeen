import { useTranslation } from "react-i18next";
import {
  MenuBook,
  Mic,
  Radio,
  AutoStories,
  Bookmarks,
  Search,
} from "@mui/icons-material";
import MosqueIcon from "@mui/icons-material/Mosque";

const featureIcons = {
  quran: MenuBook,
  reciters: Mic,
  radio: Radio,
  hadiths: MenuBook,
  azkar: AutoStories,
  prayer: MosqueIcon,
  search: Search,
  favorites: Bookmarks,
};

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      key: "quran",
      icon: featureIcons.quran,
      title: t("about.features.quran.title"),
      description: t("about.features.quran.description"),
    },
    {
      key: "reciters",
      icon: featureIcons.reciters,
      title: t("about.features.reciters.title"),
      description: t("about.features.reciters.description"),
    },
    {
      key: "hadiths",
      icon: featureIcons.hadiths,
      title: t("about.features.hadiths.title"),
      description: t("about.features.hadiths.description"),
    },
    {
      key: "azkar",
      icon: featureIcons.azkar,
      title: t("about.features.azkar.title"),
      description: t("about.features.azkar.description"),
    },
    {
      key: "prayer",
      icon: featureIcons.prayer,
      title: t("about.features.prayer.title"),
      description: t("about.features.prayer.description"),
    },
    {
      key: "radio",
      icon: featureIcons.radio,
      title: t("about.features.radio.title"),
      description: t("about.features.radio.description"),
    },
    {
      key: "search",
      icon: featureIcons.search,
      title: t("about.features.search.title"),
      description: t("about.features.search.description"),
    },
    {
      key: "favorites",
      icon: featureIcons.favorites,
      title: t("about.features.favorites.title"),
      description: t("about.features.favorites.description"),
    },
  ];

  return (
    <section className="py-20 px-4 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t("about.features.title")}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("about.features.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group p-6 bg-card border border-border rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
