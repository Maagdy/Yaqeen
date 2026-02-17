import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { MenuBook } from "@mui/icons-material";
import { BookCard, PdfViewer, type Book } from "@/components/common";
import { useLanguage } from "@/hooks";
import { ProphetStoriesCover1, ProphetStoriesCover2 } from "@/assets/images";

const ProphetStoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Define your two books here
  const books: Book[] = [
    {
      id: 1,
      title: "Stories of the Prophets - Mukhtasar Al-Qasas Al-Haqq",
      titleAr: "قصص الأنبياء - اختصار القصص الحق",
      author: "Abdulqadir Shaybah Al-Hamad",
      authorAr: "عبدالقادر شيبة الحمد",
      pdfPath: "/pdfs/qasas-al-anbiya-mukhtasar.pdf",
      pageCount: 369,
      coverImage: ProphetStoriesCover1,
    },
    {
      id: 2,
      title: "Stories of the Prophets - Ibn Kathir",
      titleAr: "قصص الأنبياء",
      author: "Imam Ibn Kathir",
      authorAr: "الإمام ابن كثير",
      pdfPath: "/pdfs/qasas-al-anbiya-ibn-kathir.pdf",
      pageCount: 748,
      coverImage: ProphetStoriesCover2,
    },
  ];

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseViewer = () => {
    setSelectedBook(null);
  };

  return (
    <>
      <Helmet>
        <title>
          {t("prophet_stories.title")} - {t("app.title")}
        </title>
        <meta name="description" content={t("prophet_stories.description")} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-linear-to-br from-primary/10 to-primary/5 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <MenuBook className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                {t("prophet_stories.title")}
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
                {t("prophet_stories.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
              {t("prophet_stories.available_books")}
            </h2>
            <p className="text-text-secondary">
              {t("prophet_stories.books_count", { count: books.length })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {books.map((book) => (
              <BookCard
                key={book.id}
                title={language === "ar" ? book.titleAr : book.title}
                author={language === "ar" ? book.authorAr : book.author}
                pdfPath={book.pdfPath}
                pageCount={book.pageCount}
                coverImage={book.coverImage}
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              {t("prophet_stories.about_section")}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {t("prophet_stories.about_description")}
            </p>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedBook && (
        <PdfViewer file={selectedBook.pdfPath} onClose={handleCloseViewer} />
      )}
    </>
  );
};

export default ProphetStoriesPage;
