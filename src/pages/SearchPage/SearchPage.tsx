import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loading } from "../../components/ui/loading";
import { ErrorPage } from "../ErrorPage";
import { quranSurahs } from "../../utils/constants";
import { IconButton } from "../../components/common";
import { ArrowBack, ArrowForward, MenuBook } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { generateRoute } from "../../router/routes";
import { useLanguage } from "@/hooks";
import HomeSearchBar from "@/components/pages/home-components/home-search-bar/home-search-bar";
import { useSearchQueries } from "@/api";
import { SEO, SEO_CONFIG } from "@/components/seo";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawKeyword = searchParams.get("q") || "";
  const { isRtl, language } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const ITEMS_PER_PAGE = 20;

  const seoConfig = SEO_CONFIG.search[language as "en" | "ar"];

  const [searchInput, setSearchInput] = useState(rawKeyword);

  useEffect(() => {
    setSearchInput(rawKeyword);
  }, [rawKeyword]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      setSearchParams((prev) => {
        prev.set("q", term);
        prev.set("page", "1");
        return prev;
      });
    }
  };

  const parsedQuery = useMemo(() => {
    let keyword = rawKeyword.trim();
    let scope: string | number = "all";
    let edition = "en.pickthall"; // Default English
    let detectedSurah = null;

    if (!keyword) return { keyword, scope, edition, detectedSurah };

    const referencePattern = /^(\d+)[:\s](\d+)$/;
    const referenceMatch = keyword.match(referencePattern);

    if (referenceMatch) {
      scope = parseInt(referenceMatch[1]);
      return {
        keyword: referenceMatch[2],
        scope,
        edition,
        detectedSurah: quranSurahs.find((s) => s.number === scope) || null,
        isReference: true,
        ayahNumber: parseInt(referenceMatch[2]),
      };
    }

    const arabicPattern = /[\u0600-\u06FF]/;
    const isArabic = arabicPattern.test(keyword);

    if (isArabic) {
      edition = "quran-simple";
    }

    const normalizedKeyword = keyword.toLowerCase();

    const matchedSurah = quranSurahs.find((s) => {
      const englishMatch =
        s.name.toLowerCase().includes(normalizedKeyword) ||
        normalizedKeyword.includes(s.name.toLowerCase());
      const arabicMatch =
        s.arabicName.includes(keyword) || keyword.includes(s.arabicName);

      return englishMatch || arabicMatch;
    });

    if (matchedSurah) {
      let remaining = keyword;
      if (remaining.toLowerCase().includes(matchedSurah.name.toLowerCase())) {
        remaining = remaining
          .replace(new RegExp(matchedSurah.name, "gi"), "")
          .trim();
      } else if (remaining.includes(matchedSurah.arabicName)) {
        remaining = remaining.replace(matchedSurah.arabicName, "").trim();
      }

      remaining = remaining.replace(/\b(in|from|fi|min|في|من)\b/gi, "").trim();

      if (remaining.length > 2) {
        scope = matchedSurah.number;
        keyword = remaining;
        detectedSurah = matchedSurah;
      } else if (remaining.length === 0 || remaining.length < 3) {
        detectedSurah = matchedSurah;
        keyword = "";
      }
    }

    return {
      keyword,
      scope,
      edition,
      detectedSurah,
      isReference: false,
      ayahNumber: null,
    };
  }, [rawKeyword]);

  const { data, isLoading, error, refetch } = useSearchQueries(
    {
      keyword: parsedQuery.keyword,
      scope: parsedQuery.scope,
      edition: parsedQuery.edition,
    },
    !!parsedQuery.keyword,
  );

  const matches = useMemo(() => data?.data.matches || [], [data]);
  const totalMatches = matches.length;
  const totalPages = Math.ceil(totalMatches / ITEMS_PER_PAGE);

  const displayedMatches = useMemo(() => {
    if (parsedQuery.isReference) return matches;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return matches.slice(start, end);
  }, [matches, page, parsedQuery.isReference]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setSearchParams((prev) => {
      prev.set("page", String(value));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!rawKeyword && !searchInput) {
    return (
      <>
        <SEO {...seoConfig} />
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-8 text-primary">
            {t("search.title")}
          </h1>
          <HomeSearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            placeholder={t("search.placeholder")}
            className="w-full max-w-2xl"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        {...seoConfig}
        title={rawKeyword ? `Search for "${rawKeyword}" - ${seoConfig.title}` : seoConfig.title}
      />
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-6rem)]">
        <div className="mb-8">
        <HomeSearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          placeholder={t("search.placeholder")}
          className="w-full max-w-2xl"
        />
      </div>

      {parsedQuery.detectedSurah && (
        <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <MenuBook fontSize="large" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                {isRtl
                  ? parsedQuery.detectedSurah.arabicName
                  : parsedQuery.detectedSurah.name}
              </h3>
              <p className="text-text-secondary">
                {parsedQuery.isReference
                  ? t("search.ayah_reference", {
                      surah: parsedQuery.detectedSurah.name,
                      ayah: parsedQuery.ayahNumber ?? "",
                    })
                  : t("search.surah", {
                      number: parsedQuery.detectedSurah.number,
                      name: parsedQuery.detectedSurah.name,
                    })}
              </p>
            </div>
          </div>
          <IconButton
            icon={isRtl ? <ArrowBack /> : <ArrowForward />}
            label={
              parsedQuery.isReference
                ? t("surah.go_to_ayah", { number: parsedQuery.ayahNumber ?? 0 })
                : t("surah.read-more")
            }
            variant="primary"
            onClick={() => {
              const route = generateRoute.surah(
                parsedQuery.detectedSurah!.number,
              );
              if (parsedQuery.isReference) {
                navigate(`${route}?ayah=${parsedQuery.ayahNumber}`);
              } else {
                navigate(route);
              }
            }}
          />
        </div>
      )}

      {isLoading && <Loading size="lg" />}

      {error ? (
        <ErrorPage
          title={t("error.title")}
          message={t("search.error", { keyword: rawKeyword })}
          showRetryButton
          onRetry={() => refetch()}
          showHomeButton
        />
      ) : (
        <>
          {!parsedQuery.isReference && (
            <p className="mb-8 text-text-secondary">
              {data?.data.matches && data.data.matches.length > 0
                ? t("search.results_count", {
                    count: data.data.count,
                    keyword: parsedQuery.keyword,
                  }) +
                  (parsedQuery.scope !== "all"
                    ? ` (${t("search.surah", { number: parsedQuery.scope, name: isRtl ? parsedQuery.detectedSurah?.arabicName : parsedQuery.detectedSurah?.name })})`
                    : "")
                : !parsedQuery.detectedSurah &&
                  t("search.no_results", { keyword: rawKeyword })}
            </p>
          )}

          <div className="space-y-4">
            {displayedMatches?.map((result, index) => (
              <div
                key={index}
                className="p-4 bg-surface border border-border rounded-xl hover:border-primary transition-colors cursor-pointer group"
                onClick={() =>
                  navigate(generateRoute.surah(result.surah.number))
                }
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-primary font-medium group-hover:underline">
                    {t("search.surah", {
                      number: result.surah.number,
                      name: result.surah.englishName,
                    })}
                  </span>
                  <span className="text-xs text-text-secondary bg-background px-2 py-1 rounded-md">
                    {t("search.ayah", { number: result.number })}
                  </span>
                </div>
                <p
                  className="text-lg text-text-primary leading-relaxed"
                  dir={parsedQuery.edition === "quran-simple" ? "rtl" : "ltr"}
                >
                  {result.text}
                </p>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8" dir="ltr">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </>
      )}
      </div>
    </>
  );
};

export default SearchPage;
