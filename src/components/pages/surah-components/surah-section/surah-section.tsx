import type { SurahSectionProps } from "./surah-section.types";

const SurahSection: React.FC<SurahSectionProps> = ({
  title,
  description,
  headerAction,
  children,
  className,
}) => {
  return (
    <div
      className={`w-full max-w-4xl mx-auto border border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-xl sm:rounded-2xl bg-background ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 sm:p-6 border-b border-border/50">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-text-primary text-lg sm:text-xl leading-tight">
            {title}
          </h2>

          {description && (
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>

        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Body */}
      {children && <div className="p-4 sm:p-6">{children}</div>}
    </div>
  );
};

export default SurahSection;
