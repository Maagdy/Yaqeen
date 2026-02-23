import { MobileAyahCard } from "@/components/common";
import type { MobileAyahsListProps } from "./MobileAyahsList.types";
import { formatNumber } from "@/utils/numbers";
import { useLanguage } from "@/hooks";

export const MobileAyahsList: React.FC<MobileAyahsListProps> = ({
  ayahs,
  surah,
  isPlaying,
  currentSurahNumber,
  currentAudio,
  onPlay,
  onBookmark,
  onShare,
  onCopy,
  onTafsirClick,
  isBookmarked,
  isBookmarkLoading,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      {ayahs.map((ayah, index) => {
        const isAyahPlaying =
          isPlaying &&
          currentSurahNumber === surah.number &&
          currentAudio === ayah.audio;

        const isLastAyahOnPage =
          index === ayahs.length - 1 ||
          ayahs[index + 1]?.page !== ayah.page;

        return (
          <div key={ayah.number}>
            <MobileAyahCard
              ayah={ayah}
              surah={surah}
              isPlaying={isAyahPlaying}
              onPlay={() => onPlay(ayah)}
              onBookmark={() => onBookmark(ayah)}
              onShare={() => onShare(ayah)}
              onCopy={() => onCopy(ayah)}
              onTafsirClick={() => onTafsirClick(ayah)}
              isBookmarked={isBookmarked(ayah)}
              isBookmarkLoading={isBookmarkLoading?.()}
            />
            {isLastAyahOnPage && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-px flex-1 bg-primary/15" />
                <span className="text-xs text-primary/70">
                  {formatNumber(ayah.page, language)}
                </span>
                <div className="h-px flex-1 bg-primary/15" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
