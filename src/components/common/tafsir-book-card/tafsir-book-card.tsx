import type { TafsirBookCardProps } from "./tafsir-book-card.types";

export const TafsirBookCard: React.FC<TafsirBookCardProps> = ({
  name,
  active,
  onClick,
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border transition-all text-center
          ${
            active
              ? "bg-primary text-white border-primary shadow-lg"
              : "bg-surface border-border hover:border-primary"
          }
        `}
      >
        <p className="font-semibold text-sm sm:text-base">{name}</p>
      </button>
    </div>
  );
};
