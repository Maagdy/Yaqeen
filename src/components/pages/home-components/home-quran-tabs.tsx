import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useChaptersQuery } from "../../../api/mutations/useChaptersQuery";
import { useJuzsQuery } from "../../../api/mutations/useJuzsQuery";
import { SurahCard } from "../../common/surah-card/surah-card";
import { JuzCard } from "../../common/juz-card/juz-card";
import type { Surah, JuzMeta } from "../../../api/queries/queries.types";
import { juzData } from "../../../utils/constants";
import { revelationOrder } from "../../../utils/revelation-order";
import { useNavigate } from "react-router-dom";
import { generateRoute } from "../../../router/routes";

export default function HomeQuranTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("surah");
  const navigate = useNavigate();
  const { data: chaptersResponse, isLoading: isLoadingChapters } =
    useChaptersQuery();
  const { data: juzsResponse, isLoading: isLoadingJuzs } = useJuzsQuery();

  const chapters = chaptersResponse;
  const juzs = juzsResponse;

  const tabs = [
    { key: "surah", label: t("home.tabs.surah") },
    { key: "juz", label: t("home.tabs.juz") },
    { key: "revelation", label: t("home.tabs.revelation") },
  ];

  // Group surahs by Juz using the accurate juzData
  const getSurahsByJuz = () => {
    if (!chapters) return {};

    const surahsByJuz: Record<number, Surah[]> = {};

    // Use the juzData to get the correct surah numbers for each Juz
    juzData.forEach((juz) => {
      const surahNumbers = new Set(juz.surahs.map((s) => s.number));

      surahsByJuz[juz.number] = chapters
        .filter((ch) => surahNumbers.has(Number(ch.number)))
        .sort((a, b) => Number(a.number) - Number(b.number));
    });

    return surahsByJuz;
  };

  const getData = () => {
    if (activeTab === "surah") return chapters || [];
    if (activeTab === "revelation") {
      // Sort by revelation order
      return [...(chapters || [])].sort((a, b) => {
        const orderA = revelationOrder[Number(a.number)] || 999;
        const orderB = revelationOrder[Number(b.number)] || 999;
        return orderA - orderB;
      });
    }
    if (activeTab === "juz") return juzs || [];
    return [];
  };

  const currentData = getData();
  const isLoading = activeTab === "juz" ? isLoadingJuzs : isLoadingChapters;
  const surahsByJuz = getSurahsByJuz();
  const onReadJuz = (juzNumber: number) => {
    navigate(generateRoute.juz(juzNumber));
  };
  const onReadSurah = (chapterNumber: number) => {
    navigate(generateRoute.surah(chapterNumber));
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-8 mb-16">
      {/* Tabs Header */}
      <div className={`flex justify-start mb-8`}>
        <div className="inline-flex bg-background border border-border rounded-xl p-1 relative gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative z-10 px-6 sm:px-8 py-2 text-sm sm:text-base font-medium rounded-lg transition-colors duration-200 outline-none ${
                activeTab === tab.key
                  ? "text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-lg z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Content */}
      <div className="relative min-h-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {isLoading ? (
              <div className="w-full h-40 flex items-center justify-center text-text-secondary">
                {t("common.loading")}
              </div>
            ) : activeTab === "juz" ? (
              // Juz View - Masonry Layout
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {(currentData as JuzMeta[]).map((item, index) => {
                  const juzNumber = index + 1;
                  const surahsInJuz = surahsByJuz[juzNumber] || [];

                  return (
                    <JuzCard
                      key={juzNumber}
                      juzNumber={juzNumber}
                      surahs={surahsInJuz}
                      onClick={() => onReadJuz(juzNumber)}
                    />
                  );
                })}
              </div>
            ) : (
              // Surah/Revelation View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(currentData as Surah[]).map((chapter) => (
                  <SurahCard
                    key={chapter.number}
                    chapter={chapter}
                    onClick={() => onReadSurah(chapter.number)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
