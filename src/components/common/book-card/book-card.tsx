import { MenuBook, Person } from "@mui/icons-material";
import type { BookCardProps } from "./book-card.types";
import { useTranslation } from "react-i18next";

export const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  pageCount,
  coverImage,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:scale-105 hover:border-primary"
    >
      {/* Cover Image or Placeholder */}
      <div className="relative h-64 sm:h-80 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
        {coverImage ? (
          <img
            loading="lazy"
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <MenuBook className="w-24 h-24 text-primary opacity-50" />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
          <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
            {t("prophet_stories.open_book")}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 min-h-14">
          {title}
        </h3>

        {author && (
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
            <Person className="w-4 h-4" />
            <span className="line-clamp-1">{author}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <MenuBook className="w-4 h-4" />
          <span>
            {pageCount} {t("prophet_stories.pages")}
          </span>
        </div>
      </div>
    </div>
  );
};
