import { useNavigate, useParams } from "react-router-dom";
import type { SurahPageProps } from "./SurahPage.types";
import { IconButton } from "../../components/common";
import { useLanguage } from "../../hooks";
import { Loading } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { useSurahQuery, type Ayah } from "../../api";
import ErrorPage from "../ErrorPage/ErrorPage";
import { Target } from "lucide-react";
import { getDiscoverItems } from "../../components/pages/surah-components/surah-utils/surah-constants";
import ReplayIcon from "@mui/icons-material/Replay";
import { quranSurahs } from "../../utils/constants";
import { useState, useEffect, useRef } from "react";
import { MenuBook } from "@mui/icons-material";
import { NextSurahCard } from "../../components/pages/surah-components/next-surah-card";
import { AyahModal } from "../../components/pages/surah-components/ayah-modal";
import SurahSection from "../../components/pages/surah-components/surah-section/surah-section";
import { useSurahTafsir } from "@/api/domains/tafsir";
import { TafsirCard } from "../../components/pages/surah-components/tafsir-card";
import { useAudio } from "../../hooks";
import { SurahDetails } from "@/components/pages";
import { SEO } from "@/components/seo";

const SurahPage: React.FC<SurahPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { language, isRtl } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ayahModalVisible, setAyahModalVisible] = useState(false);
  const [selectedDiscoverContent, setSelectedDiscoverContent] =
    useState<React.ReactNode | null>(null);
  const [activeDiscoverType, setActiveDiscoverType] = useState<
    "tafsir" | "tadabor" | "lessons" | null
  >(null);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const discoverContentRef = useRef<HTMLDivElement>(null);
  const surahNumber = Number(id);
  const edition = language === "ar" ? "ar.alafasy" : "en.asad";

  const {
    data: surah,
    isLoading,
    isError,
    refetch: refetchSurah,
  } = useSurahQuery({
    surahNumber,
    edition,
  });

  const { data: tafsirData } = useSurahTafsir(1, surahNumber, language);

  // Get Surah metadata for SEO
  const surahInfo = quranSurahs.find((s) => s.number === surahNumber);
  const surahSEO = surahInfo
    ? {
        title:
          language === "ar"
            ? `سورة ${surahInfo.arabicName} - ${surahInfo.name}`
            : `Surah ${surahInfo.name}`,
        description:
          language === "ar"
            ? `اقرأ واستمع إلى سورة ${surahInfo.arabicName} (${surahInfo.name}) - ${surahInfo.verses} آية. اقرأ القرآن الكريم مع التفسير والترجمة.`
            : `Read and listen to Surah ${surahInfo.name} (${surahInfo.arabicName}) - ${surahInfo.verses} verses. Read the Holy Quran with translation and tafsir.`,
        keywords: [
          `Surah ${surahInfo.name}`,
          surahInfo.arabicName,
          `Surah ${surahNumber}`,
          `${surahInfo.verses} verses`,
          "Quran",
          "القرآن",
        ],
        url: `/surah/${surahNumber}`,
      }
    : {
        title: "Surah - Yaqeen Islamic",
        description: "Read and listen to the Holy Quran",
        url: `/surah/${surahNumber}`,
      };

  const { play, toggle, currentAudio } = useAudio();

  useEffect(() => {
    return () => {
      setSelectedDiscoverContent(null);
      setActiveDiscoverType(null);
    };
  }, [id]);

  // Scroll to discover content when it's set
  useEffect(() => {
    if (selectedDiscoverContent) {
      setTimeout(() => {
        discoverContentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [selectedDiscoverContent]);

  if (isLoading) {
    const currentSurah = quranSurahs.find((s) => s.number === surahNumber);
    const surahName = isRtl ? currentSurah?.arabicName : currentSurah?.name;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" message={t("surah.loading", { surahName })} />
      </div>
    );
  }
  if (isError || !surah) {
    return (
      <ErrorPage
        message={t("surah.error_loading_page", {
          surahName: isRtl ? surah?.name : surah?.englishName,
        })}
        showBackButton
        showRetryButton
        onRetry={refetchSurah}
      />
    );
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
    const discoverItems = getDiscoverItems({
      onTafsirClick: () => {
        if (activeDiscoverType === "tafsir") {
          setSelectedDiscoverContent(null);
          setActiveDiscoverType(null);
        } else if (tafsirData) {
          const soarData = tafsirData.tafasir.soar;
          let surahTafsirSegments;

          if (Array.isArray(soarData)) {
            surahTafsirSegments = soarData.filter(
              (s) => s.sura_id === surahNumber,
            );
          } else {
            surahTafsirSegments = soarData[surahNumber.toString()] || [];
          }

          setSelectedDiscoverContent(
            <div className="space-y-4">
              <h1 className="text-2xl font-bold mb-4">
                {tafsirData.tafasir.name}
              </h1>
              {surahTafsirSegments && surahTafsirSegments.length > 0 ? (
                <div className="space-y-3">
                  {surahTafsirSegments.map((segment) => (
                    <TafsirCard
                      key={segment.id}
                      segment={segment}
                      isPlaying={currentAudio === segment.url}
                      onToggle={() => {
                        if (currentAudio === segment.url) {
                          toggle();
                        } else {
                          play(segment.url, surahNumber, 'surah');
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary">
                  No tafsir segments available for this surah.
                </p>
              )}
            </div>,
          );
          setActiveDiscoverType("tafsir");
        }
      },
      onTadaborClick: () => {
        if (activeDiscoverType === "tadabor") {
          setSelectedDiscoverContent(null);
          setActiveDiscoverType(null);
        } else {
          setSelectedDiscoverContent(<div>tadabor</div>);
          setActiveDiscoverType("tadabor");
        }
      },
      onLessonsClick: () => {
        if (activeDiscoverType === "lessons") {
          setSelectedDiscoverContent(null);
          setActiveDiscoverType(null);
        } else {
          setSelectedDiscoverContent(<div>lessons</div>);
          setActiveDiscoverType("lessons");
        }
      },
    });
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
              onClick={item.onClick}
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
      <SEO {...surahSEO} />
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
      {selectedDiscoverContent && (
        <div
          ref={discoverContentRef}
          className="max-w-4xl justify-start  mx-auto px-4 py-8"
        >
          {selectedDiscoverContent}
        </div>
      )}
    </>
  );
};

export default SurahPage;
