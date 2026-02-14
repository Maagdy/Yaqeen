import { useCollectionBooks, useHadiths } from "@/api/domains/tafsir";
import { formatNumber } from "@/utils/numbers";
import { HadithCard } from "@/components/pages/hadiths-components";
import { Loading } from "@/components/ui";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useLanguage } from "@/hooks";
import { ErrorPage } from "@/pages/ErrorPage";

export default function HadithDetailsPage() {
  const { collectionName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { isRtl, language } = useLanguage();
  // Get params from URL or defaults
  const page = parseInt(searchParams.get("page") || "1");
  const book = searchParams.get("book")
    ? parseInt(searchParams.get("book")!)
    : 1;

  // Fetch Books for this collection to populate the dropdown
  const {
    data: books,
    isLoading: isLoadingBooks,
    isError: isErrorBooks,
    error: errorBooks,
    refetch: refetchBooks,
  } = useCollectionBooks(collectionName);

  // Fetch Hadiths
  const {
    data: hadithResponse,
    isLoading: isLoadingHadiths,
    isError: isErrorHadiths,
    error: errorHadiths,
    refetch: refetchHadiths,
  } = useHadiths({
    collection: collectionName,
    book: book,
    page: page,
    limit: 10,
  });

  const handleBookChange = (newBook: string) => {
    setSearchParams({ book: newBook, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ book: book.toString(), page: newPage.toString() });
  };

  if (isLoadingBooks && !books) {
    return (
      <div className="flex justify-center p-10">
        <Loading message={t("hadith.loading")} size="lg" />
      </div>
    );
  }

  if (isErrorBooks || isErrorHadiths) {
    console.error("Error loading hadith details:", errorBooks || errorHadiths);
    return (
      <ErrorPage
        title={t("hadith.error_loading")}
        message={t("hadith.error_loading_page")}
        showRetryButton
        onRetry={() => {
          refetchBooks();
          refetchHadiths();
        }}
        showHomeButton
        showBackButton
      />
    );
  }

  const currentBook = books?.find((b) => b.bookNumber === book.toString());

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold capitalize text-primary mb-2">
            {collectionName?.replace(/-/g, " ")}
          </h1>
          {currentBook && (
            <p className="text-muted-foreground">
              {/* Find book name by language */}
              {currentBook.book.find((b) => b.lang === (isRtl ? "ar" : "en"))
                ?.name || currentBook.book[0]?.name}{" "}
              •{" "}
              {t("hadith.hadiths_count", {
                formattedCount: formatNumber(
                  currentBook.numberOfHadith,
                  language,
                ),
              })}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {books && (
            <select
              value={book}
              onChange={(e) => handleBookChange(e.target.value)}
              className="p-2 rounded-lg border border-border bg-background w-full md:w-64"
            >
              {books.map((b) => {
                const bookName =
                  b.book.find((bg) => bg.lang === (isRtl ? "ar" : "en"))
                    ?.name || b.book[0]?.name;
                return (
                  <option key={b.bookNumber} value={b.bookNumber}>
                    {t("hadith.book")} {formatNumber(b.bookNumber, language)}:{" "}
                    {bookName}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoadingHadiths ? (
        <div className="flex justify-center p-10">
          <Loading message={t("hadith.loading")} size="lg" />
        </div>
      ) : (
        <div className="grid gap-6">
          {hadithResponse?.data?.length === 0 ? (
            <div className="text-center p-10 text-muted-foreground">
              {t("hadith.no_hadiths")}
            </div>
          ) : (
            hadithResponse?.data?.map((hadith) => (
              <HadithCard
                key={hadith.hadithNumber}
                hadith={hadith}
                isRtl={isRtl}
                bookName={
                  currentBook?.book.find(
                    (b) => b.lang === (isRtl ? "ar" : "en"),
                  )?.name || currentBook?.book[0]?.name
                }
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {hadithResponse?.data && hadithResponse.data.length > 0 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50 hover:bg-muted transition-colors"
          >
            {isRtl ? (
              <ArrowForward fontSize="small" />
            ) : (
              <ArrowBack fontSize="small" />
            )}
            <span>{t("common.previous")}</span>
          </button>

          <span className="font-medium">
            {t("common.page", { defaultValue: "Page" })} {page}
          </span>

          <button
            // Simple next check: if we got fewer items than limit, we are at the end
            disabled={hadithResponse.data.length < 10}
            onClick={() => handlePageChange(page + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <span>{t("common.next")}</span>
            {isRtl ? (
              <ArrowBack fontSize="small" />
            ) : (
              <ArrowForward fontSize="small" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
