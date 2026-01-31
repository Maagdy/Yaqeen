import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";
import type { ReciterSurahCardProps } from "./reciter-surah-card.types";

export const ReciterSurahCard = ({
  number,
  name,
  arabicName,
  onPlay,
  isPlaying = false,
  onDownload,
  onCopyLink,
}: ReciterSurahCardProps) => {
  return (
    <div className="group relative flex items-center justify-between p-4 h-24 bg-background border border-border rounded-xl transition-all duration-300 hover:border-primary hover:shadow-md">
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Play Button */}
        <button
          onClick={onPlay}
          className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
            isPlaying
              ? "bg-primary text-white scale-105"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105"
          }`}
        >
          {isPlaying ? (
            <PauseIcon fontSize="medium" />
          ) : (
            <PlayArrowIcon fontSize="medium" />
          )}
        </button>

        {/* Surah Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-text-primary text-base sm:text-lg truncate group-hover:text-primary transition-colors duration-300">
            {number}. {name}
          </h3>

          {arabicName && (
            <span className="text-text-secondary text-sm font-amiri truncate">
              {arabicName}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onCopyLink}
          className="cursor-pointer text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <LinkIcon fontSize="small" />
        </button>

        <button
          onClick={onDownload}
          className="cursor-pointer text-text-secondary hover:text-primary transition-colors duration-200"
        >
          <DownloadIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};
