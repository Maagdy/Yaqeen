import { RamadanDashboard } from "@/components/pages/ramadan-components/ramadan-dashboard/ramadan-dashboard";
import { Leaderboard } from "@/components/pages/ramadan-components/leaderboard/leaderboard";
import { getCurrentRamadanYear } from "@/utils/ramadan-dates";
import { useAuth } from "@/hooks";
import { SEO } from "@/components/seo/SEO";
import { useTranslation } from "react-i18next";

export const RamadanPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const currentRamadanYear = getCurrentRamadanYear();

  return (
    <>
      <SEO
        title={t("ramadan.title")}
        description={t("ramadan.subtitle")}
        keywords={["Ramadan", "رمضان", "Islamic Challenges", "Quran Reading", "Spiritual Growth"]}
      />
      <div className="min-h-screen">
        <RamadanDashboard />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Leaderboard
            ramadanYear={currentRamadanYear}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </>
  );
};
