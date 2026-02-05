import { useNavigate, useParams } from "react-router-dom";
import type { SurahPageProps } from "./SurahPage.types";
import { IconButton, SurahDetails } from "../../components/common";
import { useLanguage } from "../../hooks";
import { Loading } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { useSurahQuery, type Ayah } from "../../api";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Target } from "lucide-react";
import { discoverItems } from "../../components/pages/surah-components/surah-utils/surah-constants";
import ReplayIcon from "@mui/icons-material/Replay";
import { quranSurahs } from "../../utils/constants";
import { useState } from "react";
import { MenuBook } from "@mui/icons-material";
import { NextSurahCard } from "../../components/pages/surah-components/next-surah-card";
import { AyahModal } from "../../components/pages/surah-components/ayah-modal";
import SurahSection from "../../components/pages/surah-components/surah-section/surah-section";

const SurahPage: React.FC<SurahPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ayahModalVisible, setAyahModalVisible] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const surahNumber = Number(id);
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";

  const {
    data: surah,
    isLoading,
    isError,
  } = useSurahQuery({
    surahNumber,
    edition,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (isError || !surah) {
    return <ErrorPage message={t("surah.error_loading_page")} showBackButton />;
  }

  const NotAuthGoalContent = () => {
    return (
      <div className="w-full flex flex-col items-center gap-2 p-4 pb-2 justify-center">
        <div className="flex items-center justify-center gap-2 w-full">
          <h3 className="text-primary-light text-lg sm:text-2xl">
            {t("surah.acheive-quran-goals")}
          </h3>
          <Target className="text-primary" />
        </div>
        <h5 className="font-semibold tracking-tight leading-relaxed text-center mb-2">
          {t("surah.quran-goals-description")}
        </h5>
        <IconButton
          icon={<Target />}
          label={t("surah.set-quran-goal")}
          variant="primary"
          size="md"
          onClick={() => {}}
        />
      </div>
    );
  };

  const DiscoverContent = () => {
    return (
      <div className="flex gap-2 items-center justify-start w-full flex-wrap">
        {discoverItems.map((item) => {
          const Icon = item.icon;
          return (
            <IconButton
              key={item.key}
              icon={<Icon />}
              variant="ghost"
              size="md"
              label={t(item.labelKey) as string}
            />
          );
        })}
      </div>
    );
  };
  const getNextSurah = () => {
    const currentIndex = quranSurahs.findIndex((s) => s.number === surahNumber);
    if (currentIndex === quranSurahs.length - 1) {
      return null;
    }
    return quranSurahs[currentIndex + 1];
  };

  const getPreviousSurah = () => {
    const currentIndex = quranSurahs.findIndex((s) => s.number === surahNumber);
    if (currentIndex === 0) {
      return null;
    }
    return quranSurahs[currentIndex - 1];
  };
  const nextSurah = getNextSurah();
  const previousSurah = getPreviousSurah();

  const PlayNextSurah = () => {
    const hasPrevious = previousSurah !== null;
    const hasNext = nextSurah !== null;

    if (!hasPrevious && !hasNext) return null;

    return (
      <div className="flex flex-col gap-2">
        {previousSurah && (
          <NextSurahCard
            chapter={previousSurah}
            isPrevious={true}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate(`/surah/${previousSurah.number}`);
            }}
          />
        )}
        {nextSurah && (
          <NextSurahCard
            chapter={nextSurah}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate(`/surah/${nextSurah.number}`);
            }}
          />
        )}
      </div>
    );
  };
  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        <SurahDetails
          surah={surah}
          ayahs={surah.ayahs}
          onAyahClick={(ayah) => {
            setSelectedAyah(ayah);
            setAyahModalVisible(true);
          }}
        />
      </div>
      {ayahModalVisible && (
        <AyahModal
          open={ayahModalVisible}
          onClose={() => setAyahModalVisible(false)}
          ayah={selectedAyah}
          surah={surah}
          onAyahChange={setSelectedAyah}
        />
      )}
      <div className="flex flex-col lg:flex-row justify-center w-full my-10 gap-10 px-10">
        <SurahSection
          className="flex-1"
          title={t("surah.your-goals")}
          headerAction={
            <IconButton
              icon={<Target fontSize="small" className="text-primary" />}
              label={t("surah.start-your-journy")}
              variant="default"
              size="md"
              iconPosition="right"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                // navigate("/quran");
              }}
            />
          }
        >
          {NotAuthGoalContent()}
        </SurahSection>
        <SurahSection
          className="flex-1"
          title={t("surah.discover")}
          headerAction={
            <IconButton
              icon={<MenuBook fontSize="small" className="text-primary" />}
              label={t("surah.My-Quran")}
              variant="default"
              size="md"
              iconPosition="right"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                navigate("/quran");
              }}
            />
          }
        >
          {DiscoverContent()}
        </SurahSection>
        <SurahSection
          className="flex-1"
          title={t("surah.read-more")}
          headerAction={
            <IconButton
              icon={<ReplayIcon fontSize="small" className="text-primary" />}
              label={t("surah.read-again")}
              variant="default"
              size="md"
              iconPosition="right"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          }
        >
          {PlayNextSurah()}
        </SurahSection>
      </div>
    </>
  );
};

export default SurahPage;
